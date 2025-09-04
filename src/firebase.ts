import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: "AIzaSyC6XstVXgGCdisFCkLQycpntudvyoqizpY",
  authDomain: "the-cake-co-pagadian.firebaseapp.com",
  projectId: "the-cake-co-pagadian",
  storageBucket: "the-cake-co-pagadian.firebasestorage.app",
  messagingSenderId: "451913821928",
  appId: "1:451913821928:web:ffcacdea35096f4d82235d",
  measurementId: "G-6ZTY0T5FXB"
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { db, storage, auth };
