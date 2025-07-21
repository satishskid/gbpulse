// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYg7U9K0UQ9W3iyGWp5ksNyM_M1CBkSO0",
  authDomain: "llm-health-79ff6.firebaseapp.com",
  projectId: "llm-health-79ff6",
  storageBucket: "llm-health-79ff6.firebasestorage.app",
  messagingSenderId: "536390750936",
  appId: "1:536390750936:web:c3bc89a0bc6237e391fdad",
  measurementId: "G-K401E91ZQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
