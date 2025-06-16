// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCSWg2-y0BLu_l8kNT_fw_PWsLpimOKYhc",
    authDomain: "remembrance-day-dbb60.firebaseapp.com",
    projectId: "remembrance-day-dbb60",
    storageBucket: "remembrance-day-dbb60.firebasestorage.app",
    messagingSenderId: "354276902979",
    appId: "1:354276902979:web:958ac80b961821c7ed6cf6",
    measurementId: "G-V3EER7NV2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);