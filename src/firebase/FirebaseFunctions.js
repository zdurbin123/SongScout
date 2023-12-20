import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import axios from 'axios';
import {createUserProfile,getUserProfileById} from '../../data/userprofile';

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();
  try{
    let filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!filter.test(email)) {
            throw 'Please provide a valid email address';
        }
    if (!(password.length >= 6 && !/\s/.test(password))) {
      throw 'invalid password';
    }
    if (!(/^[a-zA-Z]+$/.test(displayName) && displayName.length <= 10)) {
      throw 'invalid disPlayName should be Under 10 and at least one letter with no space';
    }
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {displayName: displayName});
    await createUserProfile(displayName,email,auth.currentUser.uid);
    let firstEnglishCharacter = '';
    for (let i = 0; i < displayName.length; i++) {
      const char = displayName.charAt(i);
        if (/[a-zA-Z]/.test(char)) {
          firstEnglishCharacter = char;
          break; 
        }
      }
    const result = firstEnglishCharacter || '$';
    await axios.post('http://localhost:3000/api/generateImage', {
      name: result.toUpperCase(),
      uid: auth.currentUser.uid,
      backgroundColor: 'black',
      fontColor: 'white'
    });
  }catch(error){
    throw error;
  }
}

async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  console.log(credential);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  let auth = getAuth();
  try{
    let filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!filter.test(email) || email.length > 35) {
            throw 'Please provide a valid email address';
        }
    if (!(password.length >= 6 && !/\s/.test(password) && password.length<=35)) {
      throw 'invalid password';
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
  }catch(error){
    throw error
  }
}

async function doSocialSignIn() {
  let auth = getAuth();
  let socialProvider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, socialProvider);  
    const username = auth.currentUser.displayName;
    const email = auth.currentUser.email;
    const uid = auth.currentUser.uid;

    try {
      const existingUserProfile = await getUserProfileById(uid);
      console.log("Existing User Profile:", existingUserProfile);
    } catch (getUserProfileError) {
      if (getUserProfileError === 'User not found') {
        const newProfile = await createUserProfile(username, email, uid);
        let firstEnglishCharacter = '';
        for (let i = 0; i < username.length; i++) {
          const char = username.charAt(i);
            if (/[a-zA-Z]/.test(char)) {
              firstEnglishCharacter = char;
              break; 
            }
          }
        const result = firstEnglishCharacter || '$';
        await axios.post('http://localhost:3000/api/generateImage', {
          name: result.toUpperCase(),
          uid: auth.currentUser.uid,
          backgroundColor: 'black',
          fontColor: 'white'
        });
        console.log("New User Profile:", newProfile);
      } else {
        console.error("Error in getUserProfileById:", getUserProfileError);
      }
    }
  } catch (signInError) {
    console.error("Error in doSocialSignIn:", signInError);
    throw signInError;
  }
}

async function doPasswordReset(email) {
  let auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  let auth = getAuth();
  await signOut(auth);
  
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword
};
