import React from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import UserProfile from './UserProfile';

function Account() {
  return (
    <div className='card'>
      <h2>Account Page</h2>
      <UserProfile/>
      <ChangePassword />
      <SignOutButton />
    </div>
  );
}

export default Account;
