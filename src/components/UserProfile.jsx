import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { getUserProfileById, updateUserProfile } from '../../data/userprofile';
import '../App.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Form, Card, Button } from 'react-bootstrap';


function UserProfile() {
  const { currentUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('black');
  const [fontColor, setFontColor] = useState('white');
  const [bannerImage, setBannerImage] = useState(null);
  const [imageExists, setImageExists] = useState(true);
  const imagePath = "../../images/" + currentUser.uid + ".jpg"; // Use currentUser.photoURL as imagePath
  const [bannerImagePath, setBannerImagePath] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
          let path = `../../images/${currentUser.uid}_banner.jpg`;
          const userProfileData = await getUserProfileById(currentUser.uid);
          const cachedProfile = await axios.get(`http://localhost:3000/api/getCachedProfile/${currentUser.uid}`);
          if (userProfileData.profileBanner === '') {
            path = '';
          } 
          if (!cachedProfile.data) {
            const userProfileData = await getUserProfileById(currentUser.uid);
            await axios.post(`http://localhost:3000/api/setCachedProfile/${currentUser.uid}`, userProfileData);
          }
          setBannerImagePath(path);
          setUserProfile(userProfileData);
          if (userProfileData && userProfileData.backgroundColor) {
            setBackgroundColor(userProfileData.backgroundColor);
          }
          if (userProfileData && userProfileData.fontColor) {
            setFontColor(userProfileData.fontColor);
          }
        } catch (error) {
          console.log('Error fetching user profile:', error);
          setError('Failed to load user profile!!! Please try again later.');
        }
      };

      fetchUserProfile();
    }, [currentUser.uid]);

    const handleBannerImageChange = (e) => {
      const file = e.target.files[0];
      setBannerImage(file);
    };

    const handleUpdateProfile = async () => {
      try {
        const displayName = newUsername || userProfile.username;

        let firstEnglishCharacter = '';
        for (let i = 0; i < displayName.length; i++) {
          const char = displayName.charAt(i);
          if (/[a-zA-Z]/.test(char)) {
            firstEnglishCharacter = char;
            break;
          }
        }

        const result = firstEnglishCharacter || '$';
        let updatedBannerImagePath = bannerImagePath;

        // Upload banner image
        if (bannerImage && currentUser.uid) {
          const formData = new FormData();
          console.log(currentUser.uid);
          formData.append('image', bannerImage, `${currentUser.uid}_banner.jpg`);
          formData.append('uid', currentUser.uid);
          await axios.post('http://localhost:3000/api/uploadBanner', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          updatedBannerImagePath = `../../images/${currentUser.uid}_banner.jpg`;
        } else {
          if(!currentUser.uid){
            console.error('Error: currentUser.uid is undefined');
          }
        }

        await updateUserProfile(
          displayName,
          currentUser.email,
          currentUser.uid,
          userProfile.likedsongs,
          backgroundColor,
          fontColor,
          updatedBannerImagePath
        );

        await axios.post('http://localhost:3000/api/generateImage', {
          name: result.toUpperCase(),
          uid: currentUser.uid,
          backgroundColor: backgroundColor,
          fontColor: fontColor,
        });

        const updatedProfile = await getUserProfileById(currentUser.uid);
        await axios.post(`http://localhost:3000/api/setCachedProfile/${currentUser.uid}`, updatedProfile);
        setUserProfile(updatedProfile);
        window.location.href = '/account';
        console.log('User profile and image updated successfully!');
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    };

    const handleImageError = () => {
      setImageExists(false);
    };

    return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="row">
        <div className="col-md-4">
          <img
            src={imagePath}
            alt="My Image"
            className="img-fluid rounded border"
          />
          <label className="mt-2">
            Upload Banner Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerImageChange}
            />
          </label>
        </div>
        <div className="col-md-8">
          {/* Other form elements and content */}
          <div>
            <label>
              Select Background Color Visually:
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Select Font Color Visually:
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
              />
            </label>
          </div>
          <p>Username: {userProfile?.username}</p>
          <Link to="/likedsongs">Liked Songs</Link>
          <br/>
          <Link to="/dislikedsongs">Disliked Songs</Link>
          <div className="form-group mt-2">
            <label>New Username:</label>
            <input
              type="text"
              className={`form-control ${newUsername && !/[a-zA-Z]/.test(newUsername) ? 'is-invalid' : ''}`}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            {newUsername && !/[a-zA-Z]/.test(newUsername) && (
              <div className="invalid-feedback">Username must contain at least one letter</div>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleUpdateProfile}
          >
            Update Profile and Image
          </button>
        </div>
      </div>
      {bannerImagePath && (
        <div className="mt-4">
          {imageExists ? (
            <img
              src={bannerImagePath}
              alt="Resource"
              className="img-fluid"
              onError={handleImageError}
            />
          ) : null}
        </div>
      )}
      
      {!bannerImagePath && (
        <p>No banner image found</p>
      )}
    </div>
  );
}

export default UserProfile;