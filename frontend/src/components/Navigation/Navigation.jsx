import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header>
      <div className='logo-container'>
        <NavLink to="/"><img src="https://logos-download.com/wp-content/uploads/2016/10/Meetup_logo-700x250.png" /></NavLink>
        {/* <NavLink exact to="/"><img src="https://logos-download.com/wp-content/uploads/2016/10/Meetup_logo-700x250.png" /></NavLink> */}
      </div>
      <nav>
        {isLoaded && sessionUser && (
          <NavLink to="/groups/new" className="start-group-link"><h3>Start a new group</h3></NavLink>
        )}
        {isLoaded && !sessionUser && <>
            <OpenModalMenuItem
              className="start-group-link"
              itemText="Log In"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </>}
        {isLoaded && sessionUser && (
          <ProfileButton user={sessionUser} />
        )}
      </nav>
    </header>
  );
}

export default Navigation;
