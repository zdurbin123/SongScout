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
  import { getAuth, updateProfile } from 'firebase/auth';
  import { initializeApp } from "firebase/app";
  import FirebaseConfig from '../src/firebase/FirebaseConfig'
  import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
  
  const firebaseApp = initializeApp(FirebaseConfig);
  const db = getFirestore(firebaseApp);
  const storage = getStorage();
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
    const auth = getAuth();
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
        photoURL:"../../images/"+uid+".jpg",
        backgroundColor:'black',
        fontColor:'#ffffff',
        profileBanner:''
      });
      await updateProfile(auth.currentUser, {
        photoURL: "../../images/"+uid+".jpg",
    });
      return getUserProfileById(uid);
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      throw error;
    }
  }

  async function updateUserProfile(username, email,uid,likedsongs,backgroundColor,fontColor,profileBanner){
    const userDocRef = doc(db, 'users', uid);
    const auth = getAuth();

    try {
      const userProfile = {
        username: username,
        email: email,
        likedsongs: likedsongs,
        backgroundColor,
        fontColor,
        profileBanner
      };
      await setDoc(userDocRef, userProfile, { merge: true });
      await updateProfile(auth.currentUser, {
          displayName: username
      });

      console.log('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  const getFileUrlByName = async (fileName) => {
    try {
      const files = await listAll(ref(storage, 'images'));
  
      const targetFile = files.items.find((file) => file.name === fileName);
  
      if (targetFile) {
        const fileUrl = await getDownloadURL(targetFile);
        console.log('File URL:', fileUrl);
  
        return fileUrl;
      } else {
        console.log('File not found');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving file URL:', error);
      return null;
    }
  };
  

  export {
    getUserProfileById,
    createUserProfile,
    updateUserProfile,
    getFileUrlByName
  }
