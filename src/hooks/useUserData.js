import { useEffect, useState, useContext } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import db from 'services/storage';
import { AppContext } from 'services/appContext'; 

const useUserData = (userUid) => {
  const { currentUser, setCurrentUser, setFollowingList } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userUid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setCurrentUser(userData);

          const followingRef = collection(db, 'users', userUid, 'following');
          const followingSnapshot = await getDocs(followingRef);
          const followingData = followingSnapshot.docs.map((doc) => doc.data());
          setFollowingList(followingData);

          setLoading(false);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user data is already available in the context
    if (!currentUser || userUid !== currentUser.uid) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [userUid, currentUser, setCurrentUser, setFollowingList]);

  return { loading };
};

export default useUserData;