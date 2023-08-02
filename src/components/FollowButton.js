import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'services/appContext';
import { followUser, unfollowUser } from 'utilities/userUtilities';

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
          await unfollowUser(currentUser.uid, user);
        } catch (error) {
          console.error('Error unfollowing user', error);
        }
      } else {
        try {
          if (!followingList.some(followingUser => followingUser.user === user)) {
            setFollowingList((prevFollowingList) => [...prevFollowingList, { user }]);
            setIsFollowing(true);
            await followUser(currentUser.uid, user);
          }
        } catch (error) {
          console.error('Error following user', error);
        }
      }
    };

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

