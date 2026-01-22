'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// 사용자 프로필 타입
interface UserProfile {
  uid: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt?: Date;
}

// 컨텍스트 타입
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, company?: string, phone?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 프로필 가져오기
  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile({
          uid,
          email: data.email,
          name: data.name,
          company: data.company,
          phone: data.phone,
          role: data.role || 'user',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
        });
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error);
    }
  };

  // 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 이메일 로그인
  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(result.user.uid);
  };

  // 회원가입
  const signUp = async (
    email: string,
    password: string,
    name: string,
    company?: string,
    phone?: string
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // 프로필 업데이트
    await updateProfile(result.user, { displayName: name });

    // Firestore에 사용자 데이터 저장
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      name,
      company: company || '',
      phone: phone || '',
      role: 'user',
      createdAt: serverTimestamp(),
    });

    await fetchUserProfile(result.user.uid);
  };

  // Google 로그인
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // 신규 사용자인 경우 Firestore에 저장
    const docRef = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        email: result.user.email,
        name: result.user.displayName || '사용자',
        company: '',
        phone: '',
        role: 'user',
        createdAt: serverTimestamp(),
      });
    }

    await fetchUserProfile(result.user.uid);
  };

  // 로그아웃
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
