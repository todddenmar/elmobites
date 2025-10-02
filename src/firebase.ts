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
  apiKey: "AIzaSyCPZd0BPvkxy5yCN88bIcwZN0QzEGw_uKg",
  authDomain: "elmo-bites.firebaseapp.com",
  projectId: "elmo-bites",
  storageBucket: "elmo-bites.firebasestorage.app",
  messagingSenderId: "567294133897",
  appId: "1:567294133897:web:f1556f8355e543967fe858",
  measurementId: "G-5LEBG7HK29",
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { db, storage, auth };
