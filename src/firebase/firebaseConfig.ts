import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbgkEx5-XXkStn7IMHLTyQKxY-9GwWzd4",
  authDomain: "car-parts-finder-88840.firebaseapp.com",
  projectId: "car-parts-finder-88840",
  storageBucket: "car-parts-finder-88840.appspot.com",
  messagingSenderId: "771209660481",
  appId: "1:771209660481:web:f3fa6bcd3f6bf008af1ec0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

