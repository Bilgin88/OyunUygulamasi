// Firebase Konfigürasyonu
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-eL7A8lWwlZr9WIYOvbFxLLDe2ry2HVQ",
  authDomain: "oyunuygulamasidb.firebaseapp.com",
  projectId: "oyunuygulamasidb",
  storageBucket: "oyunuygulamasidb.firebasestorage.app",
  messagingSenderId: "621054056039",
  appId: "1:621054056039:web:f6646a74f476aa791726c2",
  measurementId: "G-MKKE92PP6L"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
