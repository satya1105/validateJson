import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import './JsonTool.css';

function JsonTool() {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [lineNumbers, setLineNumbers] = useState('1'); 
    const [historyVisible, setHistoryVisible] = useState(false);
    const [history, setHistory] = useState(
        () => JSON.parse(sessionStorage.getItem('jsonHistory')) || []
    );
    const [expanded, setExpanded] = useState(false);
    const [textareaHeight, setTextareaHeight] = useState('17rem');
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    useEffect(() => {
        if (!textareaRef.current.contains(document.activeElement)) {
            if (expanded) {
                setTextareaHeight(`${textareaRef.current.scrollHeight-256}em`);
            } else {
                setTextareaHeight('17rem');
            }
        }
    }, [expanded, jsonInput]);

    const handleInputChange = (event) => {
        setJsonInput(event.target.value);
        setError(''); 
        updateLineNumbers(event.target.value);
    };

    const validateJson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setJsonInput(formattedJson);
            updateLineNumbers(formattedJson);
            updateHistory(formattedJson);
            setError('');
        } catch (err) {
            setError(`Invalid JSON! Error: ${err.message}`);
        }
    };

    const compressJson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const compressedJson = JSON.stringify(parsedJson);
            setJsonInput(compressedJson);
            updateLineNumbers(compressedJson);
            updateHistory(compressedJson);
            setError('');
        } catch (err) {
            setError(`Cannot compress JSON! Error: ${err.message}`);
        }
    };

    const clearJson = () => {
        setJsonInput('');
        setError('');
        setLineNumbers('1'); // Reset line numbers
    };

    const copyText = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsonInput).then(() => {
                alert('Copied to clipboard!');
            }).catch(err => {
                setError(`Failed to copy text: ${err.message}`);
            });
        } else {
            setError('Clipboard API not available.');
        }
    };

    const updateLineNumbers = (text) => {
        const lines = text.split('\n');
        const newLineNumbers = lines.map((_, index) => index + 1).join('\n');
        setLineNumbers(newLineNumbers);
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleScroll = () => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const updateHistory = (json) => {
        const newEntry = { json, timestamp: new Date().toLocaleString() };
        const newHistory = [newEntry, ...history].slice(0, 10); // Keep only the latest 50 entries
        setHistory(newHistory);
        sessionStorage.setItem('jsonHistory', JSON.stringify(newHistory));
    };

    const toggleHistory = () => {
        setHistoryVisible(!historyVisible);
    };

    const expandWindow = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`json-wrapper ${expanded ? 'expanded' : ''}`}>
            <h3 className='json-heading'>Check your JSON here</h3>
            <div className='textarea-container'>
                <textarea
                    className='json-text-area'
                    ref={textareaRef}
                    value={jsonInput}
                    onChange={handleInputChange}
                    onScroll={handleScroll}
                    rows="10"
                    cols="50"
                    placeholder="Enter JSON here..."
                    style={{ resize: 'none', height: textareaHeight }}
                />
            </div>
            <div className='btn-container'>
                <Button className='btns-jsontool' onClick={validateJson}>Validate</Button>
                <Button className='btns-jsontool' onClick={compressJson}>Compress JSON</Button>
                <Button className='btns-jsontool' onClick={clearJson}>Clear</Button>
                <Button className='btns-jsontool' onClick={toggleHistory}>{historyVisible ? 'Hide History' : 'Show History'}</Button>
                {jsonInput && (
                    <Button className='btns-jsontool' onClick={copyText}>Copy</Button>
                )}
            </div>
            <button className='btn-expand-bottom' onClick={expandWindow}>
                {expanded ? <i className="material-icons">expand_less</i> : <i className="material-icons">expand_more</i>}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {historyVisible && (
                <ul>
                    {history.map((entry, index) => (
                        <li key={index}>{entry.timestamp}: {entry.json}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default JsonTool;
