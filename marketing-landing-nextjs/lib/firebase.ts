import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAQnd9psDFTtee-q80cTmUsdImbyeg0U7k",
  authDomain: "test-1f628.firebaseapp.com",
  projectId: "test-1f628",
  storageBucket: "test-1f628.firebasestorage.app",
  messagingSenderId: "1082722923902",
  appId: "1:1082722923902:web:7f986fa59c183c49d3af2f",
  measurementId: "G-WSL3H5TBCX"
};

// Firebase 앱 초기화 (중복 방지)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase 서비스
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (클라이언트에서만 초기화)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
