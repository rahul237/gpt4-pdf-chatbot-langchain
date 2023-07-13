import jsonData from '../nested_data/nested_data.json';

import React, { useState } from "react";

// const jsonData = { ... };  // Your JSON data here

const Dropdown = () => {
  const [classLevel, setClassLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [book, setBook] = useState("");

  const classLevels = Object.keys(jsonData);
  const subjects = classLevel ? Object.keys(jsonData[classLevel]) : [];
  const books = classLevel && subject ? jsonData[classLevel][subject] : [];

  return (
    <div>
      <select onChange={e => { setClassLevel(e.target.value); setSubject(""); setBook(""); }}>
        <option value="">Select class level</option>
        {classLevels.map(level => <option key={level} value={level}>{level}</option>)}
      </select>

      <select onChange={e => { setSubject(e.target.value); setBook(""); }} disabled={!classLevel}>
        <option value="">Select subject</option>
        {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
      </select>

      <select onChange={e => setBook(e.target.value)} disabled={!subject}>
        <option value="">Select book</option>
        {books.map(bk => <option key={bk} value={bk}>{bk}</option>)}
      </select>
    </div>
  );
};

export default Dropdown;
