import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLikedSongs } from '../../data/music'; 
import { AuthContext } from './AuthContext';

const LikesContext = createContext();

const LikesProvider = ({ children }) => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [dislikedSongs, setDislikedSongs] = useState([]);
    const { currentUser } = useContext(AuthContext);

    // Fetch data on component mount
    useEffect(() => {
        // Initialize from local storage
        const localLikedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
        const localDislikedSongs = JSON.parse(localStorage.getItem('dislikedSongs')) || [];
        setLikedSongs(localLikedSongs);
        setDislikedSongs(localDislikedSongs);

        const fetchUserLikesAndDislikes = async () => {
            if (currentUser?.uid) {
                try {
                    const userData = await getLikedSongs(currentUser.uid);
                    setLikedSongs(userData.likedsongs?.map(song => song.song_id) || localLikedSongs);
                    setDislikedSongs(userData.dislikedsongs?.map(song => song.song_id) || localDislikedSongs);
                } catch (error) {
                    console.error('Error fetching user likes and dislikes:', error);
                }
            }
        };
        fetchUserLikesAndDislikes();
    }, [currentUser]);

    // Update local storage when likedSongs or dislikedSongs change
    useEffect(() => {
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
        localStorage.setItem('dislikedSongs', JSON.stringify(dislikedSongs));
    }, [likedSongs, dislikedSongs]);

    const handleLike = (songId) => {
        const newLikedSongs = [...likedSongs, songId];
        const newDislikedSongs = dislikedSongs.filter(id => id !== songId);
    
        setLikedSongs(newLikedSongs);
        setDislikedSongs(newDislikedSongs);
        localStorage.setItem('likedSongs', JSON.stringify(newLikedSongs));
        localStorage.setItem('dislikedSongs', JSON.stringify(newDislikedSongs));
    };
    
    const handleDislike = (songId) => {
        const newLikedSongs = likedSongs.filter(id => id !== songId);
        const newDislikedSongs = [...dislikedSongs, songId];
    
        setLikedSongs(newLikedSongs);
        setDislikedSongs(newDislikedSongs);
        localStorage.setItem('likedSongs', JSON.stringify(newLikedSongs));
        localStorage.setItem('dislikedSongs', JSON.stringify(newDislikedSongs));
    };
    

    return (
        <LikesContext.Provider value={{ likedSongs, dislikedSongs, handleLike, handleDislike }}>
            {children}
        </LikesContext.Provider>
    );
};
export {LikesContext,LikesProvider}






