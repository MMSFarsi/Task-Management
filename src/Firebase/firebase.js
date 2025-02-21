import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDmLzjfbH6wcPTUvYP8OMb93gX9apOtVBM",
    authDomain: "tasksubmit-2a8de.firebaseapp.com",
    projectId: "tasksubmit-2a8de",
    storageBucket: "tasksubmit-2a8de.firebasestorage.app",
    messagingSenderId: "252620906278",
    appId: "1:252620906278:web:3828060d132f994ddb6be7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error(error);
    }
};

const logOut = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

export { auth, signInWithPopup,googleProvider, signInWithGoogle, logOut, signOut };
