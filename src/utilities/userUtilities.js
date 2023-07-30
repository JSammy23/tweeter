import { doc, deleteDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import db from 'services/storage';

export const followUser = async (currentUser, userToFollow) => {
    const userRef = doc(db, 'users', currentUser);
    const userToFollowRef = doc(db, 'users', userToFollow);
    const followingRef = collection(userRef, 'following');
    const followersRef = collection(userToFollowRef, 'followers');

    try {
        await addDoc(followingRef, { user: userToFollow });
        await addDoc(followersRef, { user: currentUser });
        console.log('User followed!');
    } catch (error) {
        console.error('Error following user', error);
    }
};

export const unfollowUser = async (currentUser, userToFollow) => {
    const userRef = doc(db, 'users', currentUser);
    const userToUnfollowRef = doc(db, 'users', userToFollow);
    const followingRef = collection(userRef, 'following');
    const followersRef = collection(userToUnfollowRef, 'followers');
  
    try {
      const followingSnapshot = await getDocs(followingRef);
      followingSnapshot.forEach((doc) => {
        if (doc.data().user === userToFollow) {
          deleteDoc(doc.ref);
        }
      });
  
      const followersSnapshot = await getDocs(followersRef);
      followersSnapshot.forEach((doc) => {
        if (doc.data().user === currentUser) {
          deleteDoc(doc.ref);
        }
      });
      console.log('User unfollowed');
    } catch (error) {
      console.error('Error unfollowing user', error);
    }
};