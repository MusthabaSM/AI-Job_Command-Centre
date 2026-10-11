import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  });
}

const db = getFirestore();

async function checkJobs() {
  const snap = await db.collection('jobs').get();
  console.log(`Jobs count: ${snap.size}`);
  snap.forEach(doc => {
    console.log(doc.id, '=>', JSON.stringify(doc.data()));
  });
}

checkJobs().catch(console.error);
