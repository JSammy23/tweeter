import { doc, arrayRemove, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import db from 'services/storage';

export const followUser = async (currentUser, userToFollow) => {
  const currentUserRef = doc(db, 'users', currentUser);
  const userToFollowRef = doc(db, 'users', userToFollow);

  try {
    await updateDoc(currentUserRef, {
        following: arrayUnion(userToFollow)
    });
    await updateDoc(userToFollowRef, {
        followers: arrayUnion(currentUser)
    });
    console.log('User followed!');
  } catch (error) {
    console.error('Error following user', error);
  }
};

export const unfollowUser = async (currentUser, userToUnfollow) => {
  const currentUserRef = doc(db, 'users', currentUser);
  const userToUnfollowRef = doc(db, 'users', userToUnfollow);

  try {
    await updateDoc(currentUserRef, {
        following: arrayRemove(userToUnfollow)
    });
    
    await updateDoc(userToUnfollowRef, {
        followers: arrayRemove(currentUser)
    });
    console.log('User unfollowed!');
  } catch (error) {
    console.error('Error unfollowing user', error);
  }
};

export const fetchFollowers = async (userUid) => {
  const userRef = doc(db, 'users', userUid);
  const followersRef = collection(userRef, 'followers');
  const querySnapshot = await getDocs(followersRef);
  const followers = querySnapshot.docs.map(doc => doc.data().user);
  return followers;
};

export const fetchFollowing = async (userUid) => {
  const userRef = doc(db, 'users', userUid);
  const followingRef = collection(userRef, 'following');
  const querySnapshot = await getDocs(followingRef);
  const following = querySnapshot.docs.map(doc => doc.data().user);
  return following;
}