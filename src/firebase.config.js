import { initializeApp } from "firebase/app";
import "firebase/auth"

console.log(process.env);

const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
    projectId: `${process.env.REACT_APP_PROJECT_ID}`,
    storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.REACT_APP_MESSAGE_SENDER_ID}`,
    appId: `${process.env.REACT_APP_APP_ID}`
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const auth = app.auth;
  export default app;