import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfileById } from '../../data/userprofile';
import '../App.css';

function UserProfile() {
  const { currentUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileData = await getUserProfileById('1');
        setUserProfile(userProfileData[0]);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      {userProfile ? (
        <div>
          <p>User ID: {userProfile.Userid}</p>
          <p>Other profile data: {userProfile.Username}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfile;
