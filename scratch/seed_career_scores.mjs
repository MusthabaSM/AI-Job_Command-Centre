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

async function seedScores() {
  const ref = db.collection('career_scores').doc('primary_scores');
  await ref.set({
    overall_score: 81,
    resume_score: 85,
    application_score: 78,
    interview_score: 75,
    updated_at: new Date().toISOString()
  }, { merge: true });
  console.log('Successfully saved primary career scores into Firestore.');
}

seedScores().catch(console.error);
