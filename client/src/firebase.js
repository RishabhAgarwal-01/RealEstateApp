// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestateapp-d9df4.firebaseapp.com",
  projectId: "realestateapp-d9df4",
  storageBucket: "realestateapp-d9df4.appspot.com",
  messagingSenderId: "658463554194",
  appId: "1:658463554194:web:39fd71f4974c4d6c31844b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);