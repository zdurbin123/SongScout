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
        const userProfileData = await getUserProfileById(currentUser.uid);
        setUserProfile(userProfileData);
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
          <p>Username: {userProfile.username}</p>
          <p>Liked songs: {userProfile.likedsongs.length > 0 ? userProfile.likedsongs.map(song => <span key={song}>{song}</span>) : 'Null'}</p>
          <p>Disliked songs: {userProfile.dislikedsongs.length > 0 ? userProfile.dislikedsongs.map(song => <span key={song}>{song}</span>) : 'Null'}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfile;
