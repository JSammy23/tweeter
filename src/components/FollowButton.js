import React, { useContext, useEffect, useState } from 'react';
import { doc, deleteDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import db from 'services/storage';
import { AppContext } from 'services/appContext';

import styled from 'styled-components';
import { Button } from 'styles/styledComponents';
import { faCheck } from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Checkmark = styled.span`
 position: relative;
 margin-left: .3em;
`;


const FollowButton = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    const {currentUser, viewedUser, followingList, setFollowingList} = useContext(AppContext);

    const userRef = doc(db, 'users', currentUser.uid);
    const viewedUserRef = doc(db, 'users', viewedUser?.uid);
    const followingRef = collection(userRef, 'following');

    useEffect(() => {
        checkIsFollowing();
    }, [currentUser, viewedUser]);

    const checkIsFollowing = () => {
        const isFollowing = followingList.some((user) => user.user === viewedUser.uid);
        setIsFollowing(isFollowing);
    };

    const handleFollowUser =  async () => {
        // Add user to local follow list
        try {
            setFollowingList(prevFollowingList => [...prevFollowingList, {
                user: viewedUser.uid
            }]);
            setIsFollowing(true);
        } catch (error) {
            console.error('Error adding user to local followList', error);
        };

        // Add user to backend follower list
        try {
            await addDoc(followingRef, {
            user: viewedUser.uid
            });
            console.log('User followed')
    
        } catch (error) {
            console.error('Error following user', error);
        };

        // Add currentUser to viewedUser follower list
        try {
            const followersRef = collection(viewedUserRef, 'followers');
            await addDoc(followersRef, {
                user: currentUser.uid
            });
            console.log('Current User added to follower list');
        } catch (error) {
            console.error('Error adding current user to follower list.', error);
        };
    };

    const handleUnfollowUser = async () => {
        // Remove user from local following list
        try {
            setFollowingList(prevFollowingList => prevFollowingList.filter(item => item.user !== viewedUser.uid));
            setIsFollowing(false);
        } catch (error) {
            console.error('Error removing user from local followList', error);
        };

        // Remove user from firebase follower list
        try {
          const querySnapshot = await getDocs(followingRef);
          querySnapshot.forEach((doc) => {
            if (doc.data().user === viewedUser.uid) {
              deleteDoc(doc.ref);
              console.log('User unfollowed');
            }
          });
        } catch (error) {
          console.error('Error unfollowing user', error);
        };

        // Remove current user from viewedUser follower list
        try {
            const followersRef = collection(viewedUserRef, 'followers');
            const querySnapshot = await getDocs(followersRef);
            querySnapshot.forEach((doc) => {
                if (doc.data().user === currentUser.uid) {
                    deleteDoc(doc.ref);
                    console.log('Current user removed from viewedUser follower list');
                }
            });
        } catch (error) {
            console.error('Error removing current user from viewedUser follower list', error);
        };
    };

    const renderFollowButton = () => {
        if (isFollowing) {
            return (
                <Button onClick={handleUnfollowUser} >
                    Following
                    <Checkmark>
                        <FontAwesomeIcon icon={faCheck} />
                    </Checkmark>
                </Button>
            )
        } else {
            return (
                <Button onClick={handleFollowUser}>
                    Follow
                </Button>
            )
        }
    }

  return (
    <>
        {renderFollowButton()}
    </>
  )
}

export default FollowButton;

