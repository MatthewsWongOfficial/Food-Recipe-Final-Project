import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD-PkceaDYTGCVo9JqXCH1V0xWSHs4O6RM",
    authDomain: "meal-app-65651.firebaseapp.com",
    projectId: "meal-app-65651",
    storageBucket: "meal-app-65651.appspot.com",
    messagingSenderId: "1050955125390",
    appId: "1:1050955125390:web:4bc627f8cf86b22d8f6fdf",
    measurementId: "G-KY5R0NVPN1"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
