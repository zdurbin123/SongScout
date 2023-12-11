
import {
    doc,
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    addDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDoc,
  } from "firebase/firestore/lite";
  import { initializeApp } from "firebase/app";
  import FirebaseConfig from '../src/firebase/FirebaseConfig'

//uid is user_id

async function likeSong(uid, { song_name, song_id, author_id, author_name, preview_url }) {
    const userDocRef = doc(db, 'users', uid);
  
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedsongs = userData.likedsongs || [];
        const likedSong = {
          song_name,
          song_id,
          author_id,
          author_name,
          preview_url,
        };
  
        likedsongs.push(likedSong);
  
        await updateDoc(userDocRef, { likedsongs });
        console.log('Liked song added successfully!');
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error adding liked song:', error);
      throw error;
    }
  }

  async function dislikeSong(uid, song_id) {
    const userDocRef = doc(db, 'users', uid);
  
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedsongs = userData.likedsongs || [];
        const updatedLikedsongs = likedsongs.filter((likedSong) => likedSong.song_id !== song_id);
        await updateDoc(userDocRef, { likedsongs: updatedLikedsongs });
        console.log('Liked song removed successfully!');
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error removing liked song:', error);
      throw error;
    }
  }

  async function getLikedSongs(uid) {
    const userDocRef = doc(db, 'users', uid);
    try {
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedsongs = userData.likedsongs || [];
  
        console.log('Liked songs:', likedsongs);
        return likedsongs;
      } else {
        console.error('User not found');
        throw 'User not found';
      }
    } catch (error) {
        if (error == 'User not found'){
            console.error(error);
            throw error;
        }
      console.error('Error getting liked songs:', error);
      throw error;
    }
  }


  
  export{
    likeSong,
    dislikeSong,
    getLikedSongs
  }