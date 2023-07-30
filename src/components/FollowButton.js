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


const FollowButton = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const { currentUser, followingList, setFollowingList } = useContext(AppContext);
  
    const userRef = doc(db, 'users', currentUser.uid);
    const userToFollowRef = doc(db, 'users', user);
    const followingRef = collection(userRef, 'following');
  
    useEffect(() => {
      checkIsFollowing();
    }, [currentUser, user]);
  
    const checkIsFollowing = () => {
      const isFollowing = followingList.some((followingUser) => followingUser.user === user);
      setIsFollowing(isFollowing);
    };

    const handleFollow = async () => {
      if (isFollowing) {
        try {
          setFollowingList((prevFollowingList) => prevFollowingList.filter((item) => item.user !== user));
          setIsFollowing(false);
          try {
            const querySnapshot = await getDocs(followingRef);
            querySnapshot.forEach((doc) => {
              if (doc.data().user === user) {
                deleteDoc(doc.ref);
                console.log('User unfollowed');
              }
            });
          } catch (error) {
            console.error('Error unfollowing user', error);
          }
      
          try {
            const followersRef = collection(userToFollowRef, 'followers');
            const querySnapshot = await getDocs(followersRef);
            querySnapshot.forEach((doc) => {
              if (doc.data().user === currentUser.uid) {
                deleteDoc(doc.ref);
                console.log('Current user removed from viewedUser follower list');
              }
            });
          } catch (error) {
            console.error('Error removing current user from viewedUser follower list', error);
          }
          // ...rest of the code to unfollow the user
        } catch (error) {
          console.error('Error unfollowing user', error);
        }
      } else {
        try {
          if (!followingList.some(followingUser => followingUser.user === user)) {
            setFollowingList((prevFollowingList) => [...prevFollowingList, { user }]);
            setIsFollowing(true);
          }
          
          try {
            await addDoc(followingRef, { user });
            console.log('User followed');
          } catch (error) {
            console.error('Error following user', error);
          }
      
          try {
            const followersRef = collection(userToFollowRef, 'followers');
            await addDoc(followersRef, { user: currentUser.uid });
            console.log('Current User added to follower list');
          } catch (error) {
            console.error('Error adding current user to follower list.', error);
          }
          // ...rest of the code to follow the user
        } catch (error) {
          console.error('Error following user', error);
        }
      }
    };
  
    // const handleFollowUser = async () => {
    //   try {
    //     setFollowingList((prevFollowingList) => [...prevFollowingList, { user }]);
    //     setIsFollowing(true);
    //   } catch (error) {
    //     console.error('Error adding user to local followList', error);
    //   }
  
    //   try {
    //     await addDoc(followingRef, { user });
    //     console.log('User followed');
    //   } catch (error) {
    //     console.error('Error following user', error);
    //   }
  
    //   try {
    //     const followersRef = collection(userToFollowRef, 'followers');
    //     await addDoc(followersRef, { user: currentUser.uid });
    //     console.log('Current User added to follower list');
    //   } catch (error) {
    //     console.error('Error adding current user to follower list.', error);
    //   }
    // };
  
    // const handleUnfollowUser = async () => {
    //   try {
    //     setFollowingList((prevFollowingList) => prevFollowingList.filter((item) => item.user !== user));
    //     setIsFollowing(false);
    //   } catch (error) {
    //     console.error('Error removing user from local followList', error);
    //   }
  
    //   try {
    //     const querySnapshot = await getDocs(followingRef);
    //     querySnapshot.forEach((doc) => {
    //       if (doc.data().user === user) {
    //         deleteDoc(doc.ref);
    //         console.log('User unfollowed');
    //       }
    //     });
    //   } catch (error) {
    //     console.error('Error unfollowing user', error);
    //   }
  
    //   try {
    //     const followersRef = collection(userToFollowRef, 'followers');
    //     const querySnapshot = await getDocs(followersRef);
    //     querySnapshot.forEach((doc) => {
    //       if (doc.data().user === currentUser.uid) {
    //         deleteDoc(doc.ref);
    //         console.log('Current user removed from viewedUser follower list');
    //       }
    //     });
    //   } catch (error) {
    //     console.error('Error removing current user from viewedUser follower list', error);
    //   }
    // };

    const renderFollowButton = () => {
        if (isFollowing) {
            return (
                <Button onClick={handleFollow} >
                    Following
                    <Checkmark>
                        <FontAwesomeIcon icon={faCheck} />
                    </Checkmark>
                </Button>
            )
        } else {
            return (
                <Button onClick={handleFollow}>
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

