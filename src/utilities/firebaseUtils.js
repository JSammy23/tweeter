import { collection, getDocs, query, where } from "firebase/firestore";
import db from "services/storage";

export const checkUserHandleAvailability = async (userHandle) => {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(
        query(usersRef, where('userHandle', 'in', [`@${userHandle}`, userHandle]))
      );
    return querySnapshot.empty; // true if no matching documents found, false otherwise
};