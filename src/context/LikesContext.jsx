import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLikedSongs, getDislikedSongs } from '../../data/music'; 
import { AuthContext } from './AuthContext';

const LikesContext = createContext();

const LikesProvider = ({ children }) => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [dislikedSongs, setDislikedSongs] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserLikesAndDislikes = async () => {
            if (currentUser?.uid) {
                try {
                    const userLikedSongs = await getLikedSongs(currentUser.uid);
                    setLikedSongs(userLikedSongs.map(song => song.song_id));

                    const userDislikedSongs = await getDislikedSongs(currentUser.uid);
                    setDislikedSongs(userDislikedSongs.map(song => song.song_id));
                } catch (error) {
                    console.error('Error fetching user likes and dislikes:', error);
                }
            }
        };
        fetchUserLikesAndDislikes();
    }, [currentUser]);

    const handleLike = (songId) => {
        if (!likedSongs.includes(songId)) {
            setLikedSongs(prev => [...prev, songId]);
            setDislikedSongs(prev => prev.filter(id => id !== songId));
        }
    };
    
    const handleDislike = (songId) => {
        if (!dislikedSongs.includes(songId)) {
            setDislikedSongs(prev => [...prev, songId]);
            setLikedSongs(prev => prev.filter(id => id !== songId));
        }
    };

    return (
        <LikesContext.Provider value={{ likedSongs, dislikedSongs, handleLike, handleDislike }}>
            {children}
        </LikesContext.Provider>
    );
};

export { LikesContext, LikesProvider };
