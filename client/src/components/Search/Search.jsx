import React, {useState, useEffect} from 'react';
import './Search.css';
import {GoSearch} from "react-icons/go";

const Search = ({searchArray, searchSerials}) => {
  const [arrayName, setArrayName] = useState();
  const [serials, setSerials] =useState('');
  
  const inputChange = (event) => {
    event.preventDefault();
    const {value, name} = event.target;
    if (name === 'array-search') {
      setArrayName(value);
    } else if (name === 'serials-search') {
      setSerials(value);
    }
  };

  const arraySearchHandler = (event) => {
    event.preventDefault();
    console.log(arrayName)
    searchArray(arrayName);
  };

  const serialsSearchHandler = (event) => {
    event.preventDefault();
    
    const serialsToSearch = serials.split('\n');
    console.log('search:', serialsToSearch)
    
    searchSerials(serialsToSearch);

  };

  return (
    <div className='Search'>
      <h1>Search</h1>

      <form className='array-search-form' onSubmit={arraySearchHandler}>
        <label htmlFor='array-search-input'>
          Search by Array
          <input
            id='array-search-input'
            type='text'
            name='array-search'
            onChange={inputChange}
            placeholder='Enter array name'
          />
        </label>
        <button type='submit'>
          <GoSearch size={20}/>
        </button>        
      </form>

      <form className='serials-search-form' onSubmit={serialsSearchHandler}>
        <label htmlFor='serials-search-input'>
          Search by Serial
          <textarea
            id='serials-search-input'
            className='serach-field-text'
            name='serials-search'
            placeholder='Enter each serial number on a seperate line'
            onChange={inputChange}
          />
        </label>      
        <button type='submit'>
          <GoSearch size={20} />
        </button>
      </form>
      
    </div>
  );
};

export default Search;
