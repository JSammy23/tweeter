import app from "../firebase.config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const db = getFirestore(app);

export const storage = getStorage(app);


export default db;