import React from 'react';
import css from './Searchbar.module.css';

const Searchbar = ({ onSubmit, initialQuery }) => {
  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={onSubmit}>
        <button type="submit" className={css.button}>
          <span className={css.button}>Search</span>
        </button>

        <input
          className={css.input}
          type="text"
          name="searchQuery"
          defaultValue={initialQuery}
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

export default Searchbar;
