import React, { useState } from 'react';
import data from '../nested_data/nested_data_with_chapters.json';


function DropdownComponent() {
    // const data = { /* Your JSON data here */ };

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState(null);

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
        setSelectedSubject(null);
        setSelectedTitle(null);
    };

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
        setSelectedTitle(null);
    };

    const handleTitleChange = (event) => {
        setSelectedTitle(event.target.value);
    };

    return (
        <div>
            <select onChange={handleClassChange}>
                <option value="">Select class</option>
                {Object.keys(data).map((cls) => <option key={cls} value={cls}>{cls}</option>)}
            </select>

            {selectedClass && (
                <select onChange={handleSubjectChange}>
                    <option value="">Select subject</option>
                    {Object.keys(data[selectedClass]).map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                </select>
            )}

            {selectedSubject && (
                <select onChange={handleTitleChange}>
                    <option value="">Select book title</option>
                    {data[selectedClass][selectedSubject].map((book) => <option key={book.title} value={book.title}>{book.title}</option>)}
                </select>
            )}

            {selectedTitle && (
                <select>
                    <option value="">Select chapter</option>
                    {data[selectedClass][selectedSubject].find(book => book.title === selectedTitle).chapters.map((chapter, index) => <option key={index} value={chapter}>{chapter}</option>)}
                </select>
            )}
        </div>
    );
}

export default DropdownComponent;
