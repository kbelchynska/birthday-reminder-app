import React from 'react';
import PeopleListContext from "../context/PeopleListContext/PeopleListContext";
function PeopleListProvider(props) {
  const [peopleList, setPeopleList] = React.useState([]);
  return <PeopleListContext.Provider value={[peopleList, setPeopleList]} {...props} />;
}

export default PeopleListProvider;