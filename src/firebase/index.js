import firebase from 'firebase/app'

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDBph54Brl4-HJTRW5S0vJlZMM-nc-nkdg",
  authDomain: "reboostify-f18db.firebaseapp.com",
  databaseURL: "https://reboostify-f18db-default-rtdb.firebaseio.com",
  projectId: "reboostify-f18db",
  storageBucket: "reboostify-f18db.appspot.com",
  messagingSenderId: "870800978453",
  appId: "1:870800978453:web:cffcfca384b9d1de3f141c",
  measurementId: "G-Z86QKJ0ND8"
};

firebase.initializeApp(firebaseConfig);

const noterFirestore = firebase.firestore();
const noterStorage = firebase.storage();
const noterAuth = firebase.auth();

const GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

const firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export { noterFirestore, noterAuth, noterStorage, firebaseTimestamp, GoogleAuthProvider };