import React, { useState } from 'react'
import auth, { createUser } from 'services/auth.js';
import { collection, setDoc, doc, addDoc, Timestamp } from 'firebase/firestore';
import db from 'services/storage.js';
import styled from 'styled-components';
import { Background } from 'styles/styledComponents';
import 'pages/LoginPage/LoginPage.Styles.css';


const SignUpPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');


    const handleSignUp = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const { user } = await createUser(email, password);
            console.log('User created successfully!');

            const userRef = doc(collection(db, 'users'), user.uid);
            const date = new Date();
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                createdAt: Timestamp.fromDate(date),
            });

            // Create user first tweet
            const tweetsRef = collection(db, 'tweets');
            const newTweetRef = await addDoc(tweetsRef, {
                authorID: user.uid,
                body: 'I just joined the twitter clone Tweeter!',
                date: Timestamp.fromDate(date),
            });

            const tweetID = newTweetRef.id;

            // Create user sub-collection tweetBucket
            const tweetBucketRef = collection(userRef, 'tweetBucket');
            await addDoc(tweetBucketRef, {
                tweetID: tweetID,
            });

            // Create user sub-collection followers
            const followersRef = collection(userRef, 'followers');
            // Add Tom as first follower
            await addDoc(followersRef, {
                user: 'Lpckb0DmB4ahjnLruadN7Kjisa42'
            });

            // Create user sub-collection following
            const followingRef = collection(userRef, 'following');
            await addDoc(followingRef, {
                user: 'Lpckb0DmB4ahjnLruadN7Kjisa42'
            });

            // navigate('/'); TODO: Navigate to Feed
        } catch (error) {
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
                <div className="sign-up-controls">
                    <button className="login-button" type="submit">Sign Up</button>
                </div>
                {error && <div className='error'>{error}</div>}
            </form>
        </div>
    </Background>
  )
}

export default SignUpPage

