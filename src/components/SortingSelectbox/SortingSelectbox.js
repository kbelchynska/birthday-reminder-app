import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext/AppContext';
import PeopleListContext from '../../context/PeopleListContext/PeopleListContext';
import sortingLogic from '../../helpers/sortingLogic';
import './SortingSelectbox.scss';
function SortingSelectbox() {
  const { dispatch, favState, sortingState } = useContext(AppContext);
  const [peopleList, setPeopleList] = useContext(PeopleListContext);
  const [showFavourites] = favState;
  const [sortState, setSortState] = sortingState;

  const handleChange = (e) => {
    const value = e.target.value;
    const nextSort = reformatValue(value);
    const args = {
      peopleList,
      setPeopleList,
      nextSort,
      showFavourites,
      dispatch,
    };
    sortingLogic(args);
    setSortState(nextSort);
  };

  const reformatValue = (value) => {
    switch (value) {
      case 'sort-by-name':
        return 'sortByName';
      case 'sort-by-age':
        return 'sortByAge';
      case 'sort-by-month':
        return 'sortByMonth';
      default:
        break;
    }
  };
  
  return (
    <label>
      <select
        className="sorting-selectbox"
        aria-selected
        role="option"
        onChange={handleChange}
        defaultValue={sortState}
      >
        <option
          id="test"
          value="sort-by-name"
          className="sorting-selectbox__option"
        >
          Sort by name
        </option>
        <option value="sort-by-age" className="sorting-selectbox__option">
          Sort by age
        </option>
        <option value="sort-by-month" className="sorting-selectbox__option">
          Sort by month
        </option>
      </select>
    </label>
  );
}

export default SortingSelectbox;