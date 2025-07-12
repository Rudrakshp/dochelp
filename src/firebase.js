// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBONagyQ3OWJ5QRXaZs4hneJwBrjH4L_q8",
  authDomain: "dochelp-e6551.firebaseapp.com",
  projectId: "dochelp-e6551",
  storageBucket: "dochelp-e6551.firebasestorage.app",
  messagingSenderId: "95182648112",
  appId: "1:95182648112:web:62e3400ae9cc1eb0624ef5",
  measurementId: "G-0Z1YH4H2SJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);