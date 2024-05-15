import React, { useState } from 'react';
import { diffWordsWithSpace } from 'diff';  // Importing the function for word-level diffs
import './JsonComparator.css';

function JsonComparator() {
    const [inputOne, setInputOne] = useState('');
    const [inputTwo, setInputTwo] = useState('');
    const [differences, setDifferences] = useState('');

    const handleInputOneChange = (event) => {
        setInputOne(event.target.value);
    };

    const handleInputTwoChange = (event) => {
        setInputTwo(event.target.value);
    };

    const compareInputs = () => {
        // Use diffWordsWithSpace for word-level comparison
        const diff = diffWordsWithSpace(inputOne, inputTwo);
        if (diff.length === 1 && !diff[0].added && !diff[0].removed) {
            setDifferences('No differences found.');
        } else {
            const formattedDiff = diff.map((part, index) => {
                const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
                const style = { backgroundColor: color, padding: '0.1em 0', marginRight: '2px' }; // Add styles for clarity
                return <span key={index} style={style}>{part.value}</span>;
            });
            setDifferences(<div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{formattedDiff}</div>);
        }
    };

    return (
        <div>
            <h3 className='json-heading'>Check Difference</h3>
            <div className='textareas-container'>
                <textarea
                    className='diff-text-area-left'
                    value={inputOne}
                    onChange={handleInputOneChange}
                    rows="10"
                    cols="50"
                    placeholder="Enter Text..."
                />
                <textarea
                    className='diff-text-area-right'
                    value={inputTwo}
                    onChange={handleInputTwoChange}
                    rows="10"
                    cols="50"
                    placeholder="Enter Text..."
                />
            </div>
            <div>
                <button className='btn' onClick={compareInputs}>Compare</button>
            </div>
            <div>
                <h2>Differences:</h2>
                {differences || <p>No differences detected or input is empty.</p>}
            </div>
        </div>
    );
}

export default JsonComparator;

