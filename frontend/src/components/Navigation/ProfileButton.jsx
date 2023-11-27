import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import * as sessionActions from '../../store/session';
// import OpenModalMenuItem from './OpenModalMenuItem';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='pointer-cursor' onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}><Link to="/" className='logout-button-link'>Log Out</Link></button>
            </li>
          </>
        ) :
        // (
        //   <>
        //     <OpenModalMenuItem
        //       itemText="Log In"
        //       onItemClick={closeMenu}
        //       modalComponent={<LoginFormModal />}
        //     />
        //     <OpenModalMenuItem
        //       itemText="Sign Up"
        //       onItemClick={closeMenu}
        //       modalComponent={<SignupFormModal />}
        //     />
        //   </>
        // )
        null
        }
        <li><NavLink to="/groups">View groups</NavLink></li>
        <li><NavLink to="/events">View events</NavLink></li>
      </ul>
    </>
  );
}

export default ProfileButton
