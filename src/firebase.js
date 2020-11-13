import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCf3xp5fgnA6NE6UdvRFyjkl5tsgNnnW0M",
  authDomain: "instagram-clone-500fe.firebaseapp.com",
  databaseURL: "https://instagram-clone-500fe.firebaseio.com",
  projectId: "instagram-clone-500fe",
  storageBucket: "instagram-clone-500fe.appspot.com",
  messagingSenderId: "761788200180",
  appId: "1:761788200180:web:535620c013b76324b9daa1",
  measurementId: "G-TDNZ3KST7R"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage }
