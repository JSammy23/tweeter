import React, { useState } from 'react'
import auth, { createUser } from 'services/auth.js';
import { collection, setDoc, doc, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import db from 'services/storage.js';
import { storage } from 'services/storage.js';
import { getDownloadURL, ref } from 'firebase/storage';
import Loading from 'components/Loading/Loading';
import { checkUserHandleAvailability } from 'utilities/firebaseUtils';

import styled from 'styled-components';
import { Background } from 'styles/styledComponents';
import 'pages/LoginPage/LoginPage.Styles.css';



const SignUpPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [userHandle, setUserHandle] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


    const handleSignUp = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        const handleAvailable = await checkUserHandleAvailability(userHandle);
        if (!handleAvailable) {
            setError('User handle is already taken!');
            setIsLoading(false);
            return;
        }

        try {
            const { user } = await createUser(email, password);
            console.log('User created successfully!');

            // Assign user stock prfoile image
            const imageRef = ref(storage, '/profile-imgs/default-user.jpg');
            const imageURL = await getDownloadURL(imageRef);

            // Add user to the users collection by uid
            const userRef = doc(db, 'users', user.uid);
            const date = new Date();
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                createdAt: Timestamp.fromDate(date),
                userHandle: `@${userHandle}`,
                displayName: displayName,
                profileImg: imageURL,
            });

            // Create user first tweet
            const tweetsRef = collection(db, 'tweets');
            const newTweetRef = await addDoc(tweetsRef, {
                authorID: user.uid,
                body: '{"blocks":[{"key":"1mrjt","text":"I just joined the twitter clone Tweeter!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
                date: Timestamp.fromDate(date),
                displayName: displayName,
                profileImg: imageURL,
                userHandle: `@${userHandle}`,
            });

            const tweetID = newTweetRef.id;

            // // Create user sub-collection tweetBucket
            const tweetBucketRef = collection(userRef, 'tweetBucket');
            await addDoc(tweetBucketRef, {
                tweetID: tweetID,
                date: Timestamp.fromDate(date),
            });

            // // Create user sub-collection followers
            // const followersRef = collection(userRef, 'followers');
            // // Add Tom as first follower
            // await addDoc(followersRef, {
            //     user: 'FaaNkzhneeXE1e6KTlqoQPXIskf2'
            // });

            // // Create user sub-collection following
            // const followingRef = collection(userRef, 'following');
            // await addDoc(followingRef, {
            //     user: 'FaaNkzhneeXE1e6KTlqoQPXIskf2'
            // });

            navigate('/home'); 
        } catch (error) {
            setIsLoading(false);
            setError(error.message)
        }
    };

    const handleInputChange = (e) => {
        if (e.target.value !== '') {
            e.target.parentElement.classList.add('has-value');
        } else {
            e.target.parentElement.classList.remove('has-value');
        }
    };

  return (
    <Background>
        <div className="login-box">
            <form onSubmit={handleSignUp}>
                <div>
                    <div className="user-box">
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} />
                        <label htmlFor="email" >Email</label>
                    </div>
                    <div className="user-box">
                        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} />
                        <label htmlFor="password" >Password</label>
                    </div>
                    <div className="user-box">
                        <input type="password" name='confirmPassword' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                    <div className="info">
                        <p></p>
                    </div>
                </div>
                <div>
                    <div className="user-box">
                        <input type="text" name='displayName' id='displayName' value={displayName} onChange={(e) => setDisplayName(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} />
                        <label htmlFor="displayName" >Display Name</label>
                    </div>
                    <div className="user-box">
                        <input type="text" name='userHandle' id='userHandle' value={userHandle} onChange={(e) => setUserHandle(e.target.value)} onBlur={handleInputChange} onFocus={handleInputChange} />
                        <label htmlFor="userHandle" >User Handle</label>
                    </div>
                </div>
                <div className="sign-up-controls">
                    <button className="login-button" type="submit">Sign Up</button>
                </div>
                {error && <div className='error'>{error}</div>}
            </form>
        </div>
        {isLoading && (
            <Loading />
        )}
    </Background>
  )
}

export default SignUpPage

