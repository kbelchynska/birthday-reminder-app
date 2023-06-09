import { useContext, useEffect, useState } from 'react';
import './AppHead.scss';
import SearchBox from '../SearchBox/SearchBox';
import { AppContext } from '../../context/AppContext/AppContext';
import SortingSelectbox from '../SortingSelectbox/SortingSelectbox';
import ScreenContext from '../../context/ScreenContext/ScreenContext';
import matchMinMedia from '../../helpers/matchMinMedia';
function AppHead() {
  const { favState } = useContext(AppContext);
  const [showFavourites, setShowFavourites] = favState;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useContext(ScreenContext);

  useEffect(() => {
    if (matchMinMedia(769)) setIsLargeScreen(() => true);
    else setIsLargeScreen(() => false);
  }, [setIsLargeScreen]);
  return (
    <header className="app-head">
      {(isLargeScreen || !showSearchBox) && (
        <h1 className="app-head__logo">BirthdayReminder</h1>
      )}

      <nav className="app-head-nav">
        {(showSearchBox && (
          <SearchBox setShowSearchBox={setShowSearchBox} />
        )) || (
          <>
            <SortingSelectbox />
            <button
              className="app-head-nav__search-btn"
              aria-label="Search"
              onClick={() => setShowSearchBox(!showSearchBox)}
            >
              <i className="fas fa-search app-head-nav__icon"></i>
            </button>
          </>
        )}

        <button
          className="app-head-nav__fav-btn"
          onClick={() => !setShowFavourites(!showFavourites)}
          style={{
            color: showFavourites ? ' #dcd6f7' : '#c9c2e8',
          }}
          aria-label="Favourites"
        >
          <i className="fa fa-star app-head-nav__icon" aria-hidden="true"></i>
        </button>
      </nav>
    </header>
  );
}

export default AppHead;