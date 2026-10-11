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

async function seedTasks() {
  const tasks = [
    {
      title: "Bridge Skill Gap: Integrate Apache Kafka event streaming into CodePulse AI",
      priority: "Critical",
      impact: "12",
      time: "2 hours",
      difficulty: "Hard",
      completed: false,
      category: "Distributed Systems",
      created_at: new Date().toISOString()
    },
    {
      title: "Algorithms Prep: Solve 15 LeetCode Medium problems on Trees, Graphs & DP for LinkedIn",
      priority: "High",
      impact: "10",
      time: "1 hour daily",
      difficulty: "Hard",
      completed: false,
      category: "Algorithms",
      created_at: new Date().toISOString()
    },
    {
      title: "Resume Polish: Quantify CodePulse AI achievements with metrics (latency, AST throughput)",
      priority: "Medium",
      impact: "8",
      time: "45 mins",
      difficulty: "Medium",
      completed: false,
      category: "Resume Optimization",
      created_at: new Date().toISOString()
    },
    {
      title: "Architecture Study: Review low-latency caching and Redis pub/sub vs Kafka pipelines",
      priority: "Medium",
      impact: "7",
      time: "3 hours",
      difficulty: "Medium",
      completed: false,
      category: "System Design",
      created_at: new Date().toISOString()
    },
    {
      title: "Cloud Certification: Review AWS Developer Associate core services",
      priority: "Low",
      impact: "5",
      time: "1 week",
      difficulty: "Medium",
      completed: false,
      category: "Certifications",
      created_at: new Date().toISOString()
    }
  ];

  for (const t of tasks) {
    const ref = await db.collection('career_tasks').add(t);
    console.log('Added task:', ref.id, t.title);
  }
}

seedTasks().catch(console.error);
