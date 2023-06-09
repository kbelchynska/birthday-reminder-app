import './Person.scss';
import createFileURL from '../../helpers/createFileURL';
import PersonOptions from '../PersonOptions/PersonOptions';
import { arrayBufferToBlob } from '../../utils/IndexedDB/indexedDBManagement';
import { useEffect, useState } from 'react';
import getPersonAge from '../../helpers/getPersonAge';
import matchMinMedia from '../../helpers/matchMinMedia';

function Person(props) {
  const {
    person,
    handleDeletePerson,
    currentPersonID,
    setCurrentPersonID,
    handleSelectPerson,
  } = props;
  const { id, name, birthday, picture } = person;
  const [dropdownBtnStyle, setDropdownBtnStyle] = useState(null);
  const [pictureURL, setPictureURL] = useState(null);
  const [parentClass, setParentClass] = useState('');
  const [personAge, setPersonAge] = useState(null);
  const [tabindex, setTabindex] = useState(-1);

  useEffect(() => {
    let pictureURL = null;
    try {
      if (typeof picture !== 'string') {
        const blob = arrayBufferToBlob(picture);
        pictureURL = createFileURL(blob);
      } else {
        pictureURL = picture;
      }
    } catch (err) {
      console.log(err);
    }

    setPictureURL(() => pictureURL);
  }, [picture]);

  useEffect(() => {
    /*   document.q */
    let parentClassName =
      currentPersonID === id ? 'person person--highlighted' : 'person';
    setParentClass(parentClassName);
  }, [currentPersonID, id]);

  useEffect(() => {
    setPersonAge(getPersonAge(person));
  }, [person]);

  useEffect(() => {
    if (!matchMinMedia(769)) setTabindex(-1);
  }, []);

  const handleClick = () => {
    if (!matchMinMedia(769)) handleSelectPerson(id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSelectPerson(id);
  };

  const handleWindowKey = (e) => {
    if (e.key === 'Tab' && !matchMinMedia(769)) {
      setTabindex(1);
    } else if (e.key === 'Tab' && matchMinMedia(769)) {
      setTabindex(-1);
    }
  };

  // Handles person dropdown menu.
  const handleMouseEnter = (e) => {
    const target = e.target.closest('button');
    handleSelectPerson(id);
    const style = { height: '50px', width: '30px' };
    setDropdownBtnStyle(style);
    const handleMouseLeave = (e) => {
      const relatedTarget = e.relatedTarget;
      if (
        relatedTarget &&
        !relatedTarget.classList.contains('person-options-list__item')
      ) {
        setCurrentPersonID(null);
        setDropdownBtnStyle(null);
        target.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
    target.addEventListener('mouseleave', handleMouseLeave);
  };

  useEffect(() => {
    window.addEventListener('keyup', handleWindowKey);
    return () => {
      window.removeEventListener('keyup', handleWindowKey);
    };
  }, []);

  return (
    <li
      className={parentClass}
      onKeyPress={handleKeyPress}
      onClick={handleClick}
      tabIndex={tabindex}
    >
      <button
        className="person__dropdown-btn"
        onMouseEnter={handleMouseEnter}
        style={dropdownBtnStyle}
        aria-label="Dropdown menu"
      >
        <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
      </button>
      {currentPersonID === id && (
        <PersonOptions
          currentPersonID={currentPersonID}
          setCurrentPersonID={setCurrentPersonID}
          handleDeletePerson={handleDeletePerson}
        />
      )}
      <div className="person-img-container">
        <img
          className="person-img-container__img"
          src={pictureURL}
          alt={name}
        />
      </div>
      <div className="person-info">
        <p className="person-info__name">{name}</p>
        <p className="person-info__birthday">{birthday}</p>
      </div>
      <div className="person-age-container">
        <p className="person-age-container__title">Age:</p>
        <p className="person-age-container__age">{personAge}</p>
      </div>
    </li>
  );
}

export default Person;