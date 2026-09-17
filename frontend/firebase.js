import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDeOEGg8zi6UWdBdqX-6x4Gt-ktxmegw0",
  authDomain: "fooddelivery-abfd6.firebaseapp.com",
  projectId: "fooddelivery-abfd6",
  storageBucket: "fooddelivery-abfd6.firebasestorage.app",
  messagingSenderId: "644832025475",
  appId: "1:644832025475:web:da60939d8c275f0af9f4b6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;