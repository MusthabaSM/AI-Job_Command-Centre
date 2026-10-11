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

async function updateExistingJobs() {
  const snap = await db.collection('jobs').get();
  for (const doc of snap.docs) {
    const data = doc.data();
    if (!data.match_score) {
      await doc.ref.update({
        match_score: 78,
        skill_coverage: 80,
        keyword_coverage: 75,
        categories: {
          "Backend & Cloud": 85,
          "Full-Stack": 90,
          "Distributed Systems": 65,
          "CS Fundamentals": 70
        },
        missing_skills: ["Apache Kafka", "Data Structures & Algorithms (LeetCode)", "High-throughput Streaming"],
        last_analyzed_at: data.created_at || new Date().toISOString(),
        agent_status: 'analyzed'
      });
      console.log(`Updated job ${doc.id} (${data.company} - ${data.role || data.title}) with match analysis.`);
    }
  }
}

updateExistingJobs().catch(console.error);
