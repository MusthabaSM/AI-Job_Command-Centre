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

async function addTestApp() {
  const appRef = await db.collection('applications').add({
    company: 'LinkedIn',
    position: 'Software Engineer',
    title: 'Software Engineer',
    status: 'interview', // Technical Interview
    priority: 'high',
    match_score: 78,
    missing_skills: ['Apache Kafka', 'Distributed Systems'],
    applied_date: new Date().toISOString().split('T')[0],
    notes: 'Class of 2026 grad role. Preparing for LeetCode Medium/Hard and Kafka architecture.',
    created_at: new Date().toISOString()
  });
  console.log('Successfully created test application with ID:', appRef.id);
}

addTestApp().catch(console.error);
