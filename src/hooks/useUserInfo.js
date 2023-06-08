import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import db from 'services/storage';

const useUserInfo = (userUid) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userDocRef = doc(db, 'users', userUid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserInfo(userData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userUid]);

  return { userInfo, loading };
};

export default useUserInfo;