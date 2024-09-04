import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyBG-fnu53_HeHzxTKGSFj2fxllF3AiovTg",
    authDomain: "whatsapp-7fa33.firebaseapp.com",
    projectId: "whatsapp-7fa33",
    storageBucket: "whatsapp-7fa33.appspot.com",
    messagingSenderId: "681726736571",
    appId: "1:681726736571:web:c5c77cda8452f3a3c2119e",
    measurementId: "G-SRDLQF5M3Z"
  };
  const app=initializeApp(firebaseConfig);
  export const firebaseAuth=getAuth(app);
  