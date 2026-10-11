import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function test() {
  try {
    const cred = await signInAnonymously(auth);
    console.log("Signed in anonymously:", cred.user.uid);
    const snap = await getDocs(collection(db, "career_tasks"));
    console.log("Success! Found", snap.docs.length, "career tasks:");
    snap.docs.forEach(d => console.log(" -", d.id, d.data().title));
  } catch (e) {
    console.error("Firestore client error:", e);
  }
}

test();

