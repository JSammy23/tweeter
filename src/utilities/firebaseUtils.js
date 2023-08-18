import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import db from "services/storage";

export const checkUserHandleAvailability = async (userHandle) => {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(
        query(usersRef, where('userHandle', 'in', [`@${userHandle}`, userHandle]))
      );
    return querySnapshot.empty; // true if no matching documents found, false otherwise
};

/**
 * @param {string} collectionName
 * @param {Array} queryArgs - Array of args to build query.Each element is an array with three elements:
 *                            the field, operation, and the value.
 * @return {Promise<Array>} - A promise that resolves to an array of documents.
 */

export const fetchFromFirestore = async (collectionName, queryArgs) => {
  // Build the base query
  let baseCollection = collection(db, collectionName);
  let conditions = [];

  for (const [field, operation, value] of queryArgs) {
    if(operation === 'orderBy') {
      // If operation is orderBy, push an orderBy condition
      conditions.push(orderBy(field, value)); // 'value' here can be 'asc' or 'desc'
    } else {
      // Else, push a where condition
      conditions.push(where(field, operation, value));
    }
  }

  // Apply the conditions to the base query
  const finalQuery = query(baseCollection, ...conditions);

  // Fetch the documents based on the constructed query
  const snapshot = await getDocs(finalQuery);

  // Map over the results to get the desired data format
  return snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
  });
};