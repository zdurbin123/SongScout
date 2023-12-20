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
 
        <li>
          <NavLink to='/home'>Home</NavLink>
        </li>
 
        <li>
          <NavLink to='/Trending'>Trending</NavLink>
        </li>
 
        <li>
          <NavLink to='/RecommedResults'>Recommendations</NavLink>
        </li>
 
        <li>
          <NavLink to='/Display'>Tracks</NavLink>
        </li>
 
        <li>
          <NavLink to='/Artists'>Artists</NavLink>
        </li>
 
        <li>
          <NavLink to='/account'>Account</NavLink>
        </li>
 
        <li>
          <NavLink to='/MySongs'>MySongs</NavLink>
        </li>
 
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
