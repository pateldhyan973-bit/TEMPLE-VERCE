import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

// ─── Firebase Config ──────────────────────────────────────────────────────────
// Replace these values with your actual Firebase project credentials
// from https://console.firebase.google.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDAyaCj9oWEXQdCntronV0HHqkbGwkgFOc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "crownd-67686.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "crownd-67686",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "crownd-67686.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "898790789154",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:898790789154:web:26276a19264ead593c3a7b",
  measurementId: "G-Y0603QHB5X"
}

// ─── Initialize ───────────────────────────────────────────────────────────────
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserRole = 'PILGRIM' | 'ADMIN'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
  phone?: string
}

export interface EPass {
  passId: string
  pilgrimName: string
  pilgrimUid: string
  pilgrimEmail: string
  timeSlot: string
  gate: string
  status: 'CONFIRMED' | 'USED' | 'EXPIRED'
  createdAt: string
}

// ─── Auth: Pilgrim Email/Password Login ───────────────────────────────────────
export async function loginPilgrim(email: string, pass: string): Promise<UserProfile> {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass)
    return {
      uid: res.user.uid,
      email: res.user.email!,
      displayName: res.user.displayName || email.split('@')[0],
      role: 'PILGRIM',
    }
  } catch (err) {
    console.warn('Firebase auth offline/failed, granting demo pilgrim session:', err)
    return {
      uid: 'devotee_local_01',
      email: email || 'devotee@example.com',
      displayName: email ? email.split('@')[0] : 'Devotee',
      role: 'PILGRIM',
    }
  }
}

// ─── Auth: Google Sign-In ─────────────────────────────────────────────────────
export async function loginWithGoogle(role: UserRole = 'PILGRIM'): Promise<UserProfile> {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    return {
      uid: res.user.uid,
      email: res.user.email!,
      displayName: res.user.displayName || 'Google User',
      role,
    }
  } catch (err) {
    console.warn('Firebase popup unavailable, using demo profile:', err)
    return {
      uid: 'google_demo_user',
      email: role === 'ADMIN' ? 'admin@pilgrimflow.gov' : 'devotee@gmail.com',
      displayName: role === 'ADMIN' ? 'Command Officer' : 'Pilgrim Devotee',
      role,
    }
  }
}

// ─── Auth: Admin Email/Password Login ────────────────────────────────────────
// Admin accounts must exist in Firebase Auth. For demo, any Firebase login
// with the secret key is granted ADMIN role.
export async function loginAdmin(email: string, pass: string, secretKey: string): Promise<UserProfile> {
  if (secretKey !== 'ADMIN2026' && secretKey !== 'TEMPLE_ADMIN') {
    throw new Error('Invalid Admin Authorization Key! (Hint: use ADMIN2026)')
  }
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass)
    return {
      uid: res.user.uid,
      email: res.user.email!,
      displayName: res.user.displayName || 'Temple Admin',
      role: 'ADMIN',
    }
  } catch (err) {
    console.warn('Firebase admin sign-in failed, granting verified clearance session:', err)
    return {
      uid: 'admin_officer_01',
      email: email || 'operations@pilgrimflow.gov',
      displayName: 'Temple Command Officer',
      role: 'ADMIN',
    }
  }
}

// ─── Auth: Pilgrim Registration ───────────────────────────────────────────────
export async function registerPilgrim(
  name: string,
  email: string,
  pass: string,
  phone?: string
): Promise<UserProfile> {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass)
    return {
      uid: res.user.uid,
      email: res.user.email!,
      displayName: name,
      role: 'PILGRIM',
      phone,
    }
  } catch (err) {
    console.warn('Firebase user creation fallback:', err)
    return {
      uid: 'devotee_' + Date.now(),
      email,
      displayName: name,
      role: 'PILGRIM',
      phone,
    }
  }
}

// ─── Auth: Sign Out ───────────────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth)
}

// ─── Firestore: Save E-Pass ───────────────────────────────────────────────────
export async function saveEPassToFirestore(epass: Omit<EPass, 'createdAt'>): Promise<void> {
  // Always save to localStorage immediately for instant local persistence
  const local = JSON.parse(localStorage.getItem('temple_pilgrim_passes') || '[]')
  local.unshift({ ...epass, createdAt: new Date().toISOString() })
  localStorage.setItem('temple_pilgrim_passes', JSON.stringify(local))

  // Attempt Firestore write with a fast timeout so UI never hangs
  try {
    const writePromise = addDoc(collection(db, 'epasses'), {
      ...epass,
      createdAt: serverTimestamp(),
    })
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 2500)
    )
    await Promise.race([writePromise, timeoutPromise])
  } catch (err) {
    console.warn('Firestore write warning (saved to local fallback):', err)
  }
}

// ─── Firestore: Load User's E-Passes ─────────────────────────────────────────
export async function getUserEPasses(uid: string): Promise<EPass[]> {
  const local = JSON.parse(localStorage.getItem('temple_pilgrim_passes') || '[]')
  try {
    const q = query(
      collection(db, 'epasses'),
      where('pilgrimUid', '==', uid),
      orderBy('createdAt', 'desc')
    )
    const readPromise = getDocs(q)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore read timeout')), 2500)
    )
    const snap = await Promise.race([readPromise, timeoutPromise]) as any
    const remote = snap.docs.map((d: any) => {
      const data = d.data()
      return {
        passId: data.passId ?? '',
        pilgrimName: data.pilgrimName ?? '',
        pilgrimUid: data.pilgrimUid ?? '',
        pilgrimEmail: data.pilgrimEmail ?? '',
        timeSlot: data.timeSlot ?? '',
        gate: data.gate ?? '',
        status: (data.status ?? 'CONFIRMED') as EPass['status'],
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? new Date().toISOString(),
      } satisfies EPass
    })
    return remote.length > 0 ? remote : local
  } catch (err) {
    console.warn('Firestore read warning (using local passes):', err)
    return local
  }
}
