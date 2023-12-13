
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
    orderBy
  } from "firebase/firestore/lite";
  import { initializeApp } from "firebase/app";
  import FirebaseConfig from '../src/firebase/FirebaseConfig'

//uid is user_id
const firebaseApp = initializeApp(FirebaseConfig);
const db = getFirestore(firebaseApp);
const likesCollection = collection(db, 'likes');
async function likeSong(uid, { song_name, song_id, artists, preview_url,song_url,image_url }) {
    const userDocRef = doc(db, 'users', uid);
    const likesDocRef = doc(likesCollection, song_id);
  
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedsongs = userData.likedsongs || [];
        const likedSong = {
          song_name,
          song_id,
          artists,
          preview_url,
          song_url,
          image_url
        };
        const songExists = likedsongs.some(song => song.song_id === song_id);

        if (!songExists) {
          likedsongs.push(likedSong);
          await updateDoc(userDocRef, { likedsongs });
          //update likes collection
          const likesDoc = await getDoc(likesDocRef);
                if (likesDoc.exists()) {
                    const currentLikes = likesDoc.data().likes || 0;
                    await updateDoc(likesDocRef, { likes: currentLikes + 1 });
                } else {
                    await setDoc(likesDocRef, { likedSong,likes: 1 });
                }
          console.log('Liked song successfully!');
        } else {
          console.log('Song already liked!');
        }
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
    const likesDocRef = doc(likesCollection, song_id);
  
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedsongs = userData.likedsongs || [];
        const updatedLikedsongs = likedsongs.filter((likedSong) => likedSong.song_id !== song_id);
        await updateDoc(userDocRef, { likedsongs: updatedLikedsongs });
        //update likes collection
        const likesDoc = await getDoc(likesDocRef);
            if (likesDoc.exists()) {
                const currentLikes = likesDoc.data().likes || 0;
                await updateDoc(likesDocRef, { likes: Math.max(0, currentLikes - 1) });
            }
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

  async function getLikedSongsSortedByLikes() {
    try {
        const querySnapshot = await getDocs(query(
            likesCollection,
            where('likes', '>', 0),
            orderBy('likes', 'desc')
        ));

        const likedSongs = [];
        querySnapshot.forEach((doc) => {
            likedSongs.push(doc.data());
        });

        return likedSongs;
    } catch (error) {
        console.error('Error getting liked songs sorted by likes:', error);
        throw error;
    }
}

  
  export{
    likeSong,
    dislikeSong,
    getLikedSongs,
    getLikedSongsSortedByLikes
  }
