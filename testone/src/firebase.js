import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD58B3Kh8wABZOUd4KQCHMSJmnN5k0EWk4",
  authDomain: "assignment-764bd.firebaseapp.com",
  projectId: "assignment-764bd",
  storageBucket: "assignment-764bd.appspot.com",  
  messagingSenderId: "469341824654",
  appId: "1:469341824654:web:7f4e9b54487563f64b4bdf",
  measurementId: "G-65Z3HM2P37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };
