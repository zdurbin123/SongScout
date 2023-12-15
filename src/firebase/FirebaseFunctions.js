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
import {createUserProfile,getUserProfileById} from '../../data/userprofile';

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(auth.currentUser, {displayName: displayName});
  await createUserProfile(displayName,email,auth.currentUser.uid);
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
  const result = await signInWithEmailAndPassword(auth, email, password);
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
  window.location.reload()
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword
};
