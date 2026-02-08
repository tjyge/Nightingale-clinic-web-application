import React from 'react';
import './SearchBar.css';
import searchIcon from '../assets/search.svg';

function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="search-bar-container">
      <img src={searchIcon} alt="Search" className="search-icon" />
      <input
        type="text"
        placeholder={placeholder || "Search"}
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;
