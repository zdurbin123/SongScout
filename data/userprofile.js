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
  
  const firebaseApp = initializeApp(FirebaseConfig);
  const db = getFirestore(firebaseApp);
  async function getUserProfileById(Uid) {
    try {
      const userDocRef = doc(db, "users", Uid);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        return userSnapshot.data();
      } else {
        throw 'User not found';
      }
    } catch (error) {
      if (error == 'User not found'){
        throw error;
      }else{
        console.error("Error in getUserProfileById:", error);
        throw error;
      }
    }
  }

  async function createUserProfile(username, email, uid) {
    try {
      const usersCollection = collection(db, "users");
      const userQuery = query(usersCollection, where("uid", "==", uid));
      const userSnapshot = await getDocs(userQuery);
  
      if (!userSnapshot.empty) {
        throw 'User exists';
      }
      const docRef = doc(usersCollection, uid);
  
      await setDoc(docRef, {
        username: username,
        email: email,
        uid: uid,
        likedsongs: [],
        dislikedsongs: []
      });
      return getUserProfileById(uid);
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      throw error;
    }
  }

  export {
    getUserProfileById,
    createUserProfile
  }