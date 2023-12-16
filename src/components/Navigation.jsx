import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import SignOutButton from './SignOut';
import '../App.css';

const Navigation = () => {
  const {currentUser} = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav className='navigation'>
      <ul>
        <li>
          <NavLink to='/'>Landing</NavLink>
        </li>
        <br/><br/>
        <li>
          <NavLink to='/home'>Home</NavLink>
        </li>
        <br/><br/>
        <li>
          <NavLink to='/Trending'>Trending</NavLink>
        </li>
        <br/><br/>
        <li>
          <NavLink to='/RecommedResults'>Recommendations</NavLink>
        </li>
        <br/><br/>
        <li>
          <NavLink to='/Display'>Tracks</NavLink>
        </li>
        <br/><br/>
        <li>
          <NavLink to='/Artists'>Artists</NavLink>
        </li>
        <br/><br/>
        <li>
          <NavLink to='/account'>Account</NavLink>
        </li>
        <br/><br/>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className='navigation'>
      <ul>
        <li>
          <NavLink to='/'>Landing</NavLink>
        </li>
        <li>
          <NavLink to='/signup'>Sign-up</NavLink>
        </li>

        <li>
          <NavLink to='/signin'>Sign-In</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
