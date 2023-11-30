import {
    doc,
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    addDoc,
    deleteDoc,
    updateDoc,
    getDoc,
  } from "firebase/firestore/lite";
  import { initializeApp } from "firebase/app";
  import FirebaseConfig from '../src/firebase/FirebaseConfig'
  
  const firebaseApp = initializeApp(FirebaseConfig);
  const db = getFirestore(firebaseApp);
  async function getUserProfileById() {
    try {
      const UsersCol = collection(db, "User"); 
      const users = await getDocs(UsersCol);
      const userlist = users.docs.map((doc) => doc.data()); 
      return userlist; 
    } catch (error) {
      console.error("Error fetching users:", error);
      throw "No Users Found";
    }
  }

  export {
    getUserProfileById
  }