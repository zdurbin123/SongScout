import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfileById, updateUserProfile } from '../../data/userprofile';
import '../App.css';
import { Link } from 'react-router-dom';

function UserProfile() {
  const { currentUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileData = await getUserProfileById(currentUser.uid);
        setUserProfile(userProfileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [currentUser.uid]);

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(
        newUsername || userProfile.username, 
        currentUser.email,
        currentUser.uid,
        userProfile.likedsongs, 
        'fuck'
      );

      const updatedProfile = await getUserProfileById(currentUser.uid);
      setUserProfile(updatedProfile);
      console.log('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div>
      {userProfile ? (
        <div>
          <p>Username: {userProfile.username}</p>
          <Link to="/likedsongs">Liked Songs</Link>

          <div>
            <label>New Username:</label>
            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <br />

            <button onClick={handleUpdateProfile}>Update Profile</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfile;
