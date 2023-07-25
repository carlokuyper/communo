// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyAr8op-1yCsgxXQ8aa9s_iPy3o5NO4rqJE",
        authDomain: "msgapp-6b4d0.firebaseapp.com",
        projectId: "msgapp-6b4d0",
        storageBucket: "msgapp-6b4d0.appspot.com",
        messagingSenderId: "744431644491",
        appId: "1:744431644491:web:a93217522515d4937402ce",
        measurementId: "G-7MBE4QXCD6"
    };
    
    // Initialize Firebase
    return initializeApp(firebaseConfig);
}