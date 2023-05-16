import React, { useContext, useEffect, useState } from 'react';
import { doc, deleteDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import db from 'services/storage';

import styled from 'styled-components';
import { Button } from 'styles/styledComponents';
import { faCheck } from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppContext } from 'services/appContext';

const Checkmark = styled.span`
 position: relative;
 margin-left: .3em;
`;




const FollowButton = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    const {currentUser, viewedUser} = useContext(AppContext);

    const userRef = doc(db, 'users', currentUser.uid);
    const viewedUserRef = doc(db, 'users', viewedUser?.uid);
    const followingRef = collection(userRef, 'following');

    useEffect(() => {
        checkIsFollwing();
    }, [viewedUser]);

    const checkIsFollwing = async () => {
        try {
            const querySnapshot = await getDocs(followingRef);
            querySnapshot.forEach((doc) => {
                if (doc.data().user === viewedUser.uid) {
                    setIsFollowing(true);
                }
                else {
                    console.log('User not followed')
                }
            })
        } catch (error) {
            console.error('Error checking is currentUser follows user', error)
        };
    };

    const handleFollowUser =  async () => {
        // Add user uid to current user follow list
        // Toggle follow button after following
        try {
            await addDoc(followingRef, {
            user: viewedUser.uid
            });
            console.log('User followed')
            setIsFollowing(true);
    
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
        // Remove user uid from current user follow list
        // Toggle follow button after unfollowing
        try {
          const querySnapshot = await getDocs(followingRef);
          querySnapshot.forEach((doc) => {
            if (doc.data().user === viewedUser.uid) {
              deleteDoc(doc.ref);
              console.log('User unfollowed');
              setIsFollowing(false);
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

export default FollowButton
