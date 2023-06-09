import AddPersonUIInfo from '../AddPersonUIInfo/AddPersonUIInfo';
import EditPersonUIControls from '../EditPersonUIControls/EditPersonUIControls';
import PictureInput from '../PictureInput/PictureInput';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/AppContext/AppContext';
import findPersonByID from '../../helpers/findPersonByID';
import './EditPersonUI.scss';
import {
  blobToArrayBuffer,
  putItemToIDB,
} from '../../utils/IndexedDB/indexedDBManagement';
import blankImg from '../../assets/no-picture.png';
import PersonImgContainer from '../PersonImgContainer/PersonImgContainer';
import createFileURL from '../../helpers/createFileURL';
import validatePersonData from '../../helpers/validatePersonData';
function EditPersonUI(props) {
  const { currentPersonID, setShowEditPersonUI, setShowBackground } = props;
  const defaultState = currentPersonID;
  const nameContainer = useRef(null);
  const dateContainer = useRef(null);
  const { state, dispatch } = useContext(AppContext);
  const [currentPersonIDForEdit] = useState(defaultState);
  const [currentPicture, setCurrentPicture] = useState(null);
  const [didUserUploadPicture, setDidUserUploadPicture] = useState(false);
  const person = findPersonByID(state.people, currentPersonIDForEdit);

  const handleAcceptClick = async (e) => {
    e.stopPropagation();
    const newName = nameContainer.current.value;
    const newBirthday = dateContainer.current.value;
    const picture = didUserUploadPicture ? currentPicture : person.picture;
    let editedPerson = null;
    try {
      editedPerson = await createEditedPerson(newName, newBirthday, picture);
    } catch (err) {
      // Add notification.
      console.log(err);
    }
    if (editedPerson) {
      const filteredPeople = state.people.filter(
        (person) => person.id !== currentPersonIDForEdit
      );

      const newPeople = [...filteredPeople, editedPerson];
      try {
        putItemToIDB(editedPerson, 'userDatabase', '1', 'people');
      } catch (err) {
        console.log(err);
      }
      dispatch({
        type: 'EDIT_PERSON',
        payload: {
          people: newPeople,
          name: editedPerson.name,
        },
      });
      setShowBackground(false);
      setShowEditPersonUI(false);
    } 
  };

  const createEditedPerson = async (name, birthday, picture) => {
    const editedPerson = {
      ...person,
      id: currentPersonIDForEdit,
      name,
      birthday,
      picture,
    };
    try {
      picture = currentPicture
        ? await blobToArrayBuffer(currentPicture)
        : blankImg;
    } catch (err) {
      console.log(err);
    }
    const validationResult = validatePersonData(name, birthday, picture);
    switch (validationResult) {
      case 'INVALID_NAME':
      case 'INVALID_DATE':
      case 'INVALID_DAY':
      case 'INVALID_MONTH':
      case 'INVALID_YEAR':
      case 'INVALID_FILE_TYPE':
        dispatch({ type: validationResult });
        break;
      default:
        return editedPerson;
    }
    return null;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowEditPersonUI(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowEditPersonUI]);

  return (
    <div className="edit-person-ui">
      {didUserUploadPicture ? (
        <PersonImgContainer
          createFileURL={createFileURL}
          currentPicture={currentPicture}
          nameContainer={nameContainer}
        />
      ) : (
        <PictureInput
          setDidUserUploadPicture={setDidUserUploadPicture}
          currentPicture={currentPicture}
          setCurrentPicture={setCurrentPicture}
        />
      )}

      <AddPersonUIInfo
        name={person.name}
        birthday={person.birthday}
        currentPersonID={currentPersonID}
        nameContainer={nameContainer}
        dateContainer={dateContainer}
      />
      <EditPersonUIControls handleAcceptClick={handleAcceptClick} />
    </div>
  );
}

export default EditPersonUI;