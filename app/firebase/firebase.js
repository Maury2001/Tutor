import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7fLkh77pdJLrCwxTUxAWAU8Ml1Iuc8sM",
  authDomain: "firee-bd4a4.firebaseapp.com",
  projectId: "firee-bd4a4",
  storageBucket: "firee-bd4a4.firebasestorage.app",
  messagingSenderId: "666995217291",
  appId: "1:666995217291:web:418ae742f541b72570d58e",
  measurementId: "G-G7XJL31Q4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };
