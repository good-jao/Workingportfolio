import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  getDocs,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocFromServer,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import type { Project, DirectMessage, UserProfile } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection testing as mandated by skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Error handling as mandated by skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Check if current user is owner email
export const OWNER_EMAIL = 'jaopangan.oligarchmedia@gmail.com';
export function isUserOwner(user: User | null): boolean {
  if (!user) return false;
  return user.email === OWNER_EMAIL || Boolean(user.emailVerified);
}

// ----------------------------------------------------
// Projects Firestore CRUD
// ----------------------------------------------------
export function subscribeToProjects(
  onSuccess: (projects: Project[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'projects';
  try {
    const colRef = collection(db, path);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: Project[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as Project);
        });
        // Sort descending by createdAt or keep existing order
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        onSuccess(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    if (onError) onError(err);
    return () => {};
  }
}

// Remove undefined and null fields so Firestore setDoc never throws Unsupported field value or fails null checks
function cleanForFirestore<T>(data: T): any {
  if (data === null || data === undefined) return undefined;
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined && item !== null)
      .map((item) => cleanForFirestore(item));
  }
  if (typeof data === 'object') {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(data as Record<string, any>)) {
      if (v !== undefined && v !== null) {
        const cleaned = cleanForFirestore(v);
        if (cleaned !== undefined && cleaned !== null) {
          res[k] = cleaned;
        }
      }
    }
    return res;
  }
  return data;
}

export async function saveProjectDoc(project: Project): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    const cleaned = cleanForFirestore(project);
    await setDoc(doc(db, 'projects', project.id), cleaned);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function updateProjectDoc(project: Project): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    const cleaned = cleanForFirestore(project);
    await setDoc(doc(db, 'projects', project.id), cleaned, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function deleteProjectDoc(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ----------------------------------------------------
// Messages (Client Inquiries / Chat) Firestore CRUD
// ----------------------------------------------------
export async function sendClientMessage(message: DirectMessage): Promise<void> {
  const path = `messages/${message.id}`;
  try {
    const cleaned = cleanForFirestore(message);
    await setDoc(doc(db, 'messages', message.id), cleaned);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export function subscribeToMessages(
  onSuccess: (messages: DirectMessage[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'messages';
  try {
    const colRef = collection(db, path);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const msgs: DirectMessage[] = [];
        snapshot.forEach((d) => {
          msgs.push(d.data() as DirectMessage);
        });
        msgs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        onSuccess(msgs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    if (onError) onError(err);
    return () => {};
  }
}

export async function markMessageReadDoc(messageId: string): Promise<void> {
  const path = `messages/${messageId}`;
  try {
    await updateDoc(doc(db, 'messages', messageId), { isRead: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function deleteMessageDoc(messageId: string): Promise<void> {
  const path = `messages/${messageId}`;
  try {
    await deleteDoc(doc(db, 'messages', messageId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ----------------------------------------------------
// Profile Firestore
// ----------------------------------------------------
export async function getProfileDoc(): Promise<UserProfile | null> {
  const path = 'profile/main';
  try {
    const snap = await getDoc(doc(db, 'profile', 'main'));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveProfileDoc(profile: UserProfile): Promise<void> {
  const path = 'profile/main';
  try {
    const cleaned = cleanForFirestore(profile);
    await setDoc(doc(db, 'profile', 'main'), cleaned, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

// ----------------------------------------------------
// Settings (Owner Passcode Cloud Sync)
// ----------------------------------------------------
export async function saveOwnerPasscodeDoc(pin: string): Promise<void> {
  const path = 'settings/owner';
  try {
    await setDoc(doc(db, 'settings', 'owner'), {
      pin: pin.trim(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function getOwnerPasscodeDoc(): Promise<string | null> {
  const path = 'settings/owner';
  try {
    const snap = await getDoc(doc(db, 'settings', 'owner'));
    if (snap.exists() && snap.data()?.pin) {
      return String(snap.data().pin).trim();
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

// ----------------------------------------------------
// Auth Helpers
// ----------------------------------------------------
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutOwner(): Promise<void> {
  await signOut(auth);
}
