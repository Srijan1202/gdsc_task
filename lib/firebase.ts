import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEWeJpJJbd1oB776GrgLnZ9xH-O2hADvc",
  authDomain: "gdsctask-33f30.firebaseapp.com",
  projectId: "gdsctask-33f30",
  storageBucket: "gdsctask-33f30.firebasestorage.app",
  messagingSenderId: "14004674816",
  appId: "1:14004674816:web:da0fbbe190b795067e93e5",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

