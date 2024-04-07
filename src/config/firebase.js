import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBgbUw3TujMIGIrdIh2SSqoIEhbInuY9Mc",
    authDomain: "personal-finance-managem-de418.firebaseapp.com",
    projectId: "personal-finance-managem-de418",
    storageBucket: "personal-finance-managem-de418.appspot.com",
    messagingSenderId: "227605686819",
    appId: "1:227605686819:web:4735932b9ce9481d519f96"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;