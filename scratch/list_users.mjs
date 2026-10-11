import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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

const auth = getAuth();

async function listUsers() {
  const result = await auth.listUsers(10);
  console.log("Found", result.users.length, "users:");
  result.users.forEach(u => console.log(" - UID:", u.uid, "Email:", u.email));
}

listUsers().catch(console.error);
