import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbgkEx5-XXkStn7IMHLTyQKxY-9GwWzd4",
  authDomain: "car-parts-finder-88840.firebaseapp.com",
  projectId: "car-parts-finder-88840",
  storageBucket: "car-parts-finder-88840.appspot.com",
  messagingSenderId: "771209660481",
  appId: "1:771209660481:web:f3fa6bcd3f6bf008af1ec0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
