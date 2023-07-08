import {  useContext } from 'react';
import { AppContext } from 'services/appContext';
import { doc, getDoc } from 'firebase/firestore';
import db from 'services/storage';

export const useUserProfileClick = () => {
    const { setActiveFilter, setViewedUser, setIsUserLoaded } = useContext(AppContext);

    const handleUserProfileClick = async (userID) => {
        try {
            const userDocRef = doc(db, 'users', userID);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                setViewedUser(userDocSnap.data());
                setIsUserLoaded(true);
                setActiveFilter('viewUser');
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return handleUserProfileClick;
};