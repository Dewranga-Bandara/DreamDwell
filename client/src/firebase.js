// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dreamdwell-dd6bb.firebaseapp.com",
  projectId: "dreamdwell-dd6bb",
  storageBucket: "dreamdwell-dd6bb.appspot.com",
  messagingSenderId: "204248087885",
  appId: "1:204248087885:web:9d77b7fe558f1ffdafcb04"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);