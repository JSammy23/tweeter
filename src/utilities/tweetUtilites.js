import { updateDoc, deleteDoc, getDocs, addDoc, arrayRemove, arrayUnion, collection, doc, where, query, increment } from 'firebase/firestore'; 
import db from 'services/storage';

// ***********/ Retweet Tweet /**************/

export const getRetweets = async (tweetId, userId) => {
    const userRetweetsRef = collection(db, 'users', userId, 'retweets');
    const userRetweetsQuery = query(userRetweetsRef, where('tweetID', '==', tweetId));
    const userRetweetsSnapshot = await getDocs(userRetweetsQuery);
    return !userRetweetsSnapshot.empty;
};

export const removeRetweet = async (tweetId, userId, newRetweetCount) => {
    const tweetRef = doc(db, 'tweets', tweetId);

    await updateDoc(tweetRef, {
        retweets: newRetweetCount,
        retweetedBy: arrayRemove(userId),
    });

    const userTweetBucketRef = collection(db, 'users', userId, 'tweetBucket');
    const userTweetQuery = query(userTweetBucketRef, where('tweetID', '==', tweetId));
    const userTweetSnapshot = await getDocs(userTweetQuery);
    const userTweetDoc = userTweetSnapshot.docs[0];

    if (userTweetDoc) {
        const userTweetDocRef = doc(db, 'users', userId, 'tweetBucket', userTweetDoc.id);
        await deleteDoc(userTweetDocRef);
    }

    const userRetweetsRef = collection(db, 'users', userId, 'retweets');
    const userRetweetsQuery = query(userRetweetsRef, where('tweetID', '==', tweetId));
    const userRetweetsSnapshot = await getDocs(userRetweetsQuery);
    const userRetweetsDoc = userRetweetsSnapshot.docs[0];

    if (userRetweetsDoc) {
        const userRetweetsDocRef = doc(db, 'users', userId, 'retweets', userRetweetsDoc.id);
        await deleteDoc(userRetweetsDocRef);
    }
};

export const addRetweet = async (tweetId, userId, newRetweetCount) => {
    const tweetRef = doc(db, 'tweets', tweetId);

    await updateDoc(tweetRef, {
        retweets: newRetweetCount,
        retweetedBy: arrayUnion(userId),
    });

    const userTweetBucketRef = collection(db, 'users', userId, 'tweetBucket');
    await addDoc(userTweetBucketRef, {
        tweetID: tweetId,
        date: new Date(),
    });

    const userRetweetsRef = collection(db, 'users', userId, 'retweets');
    await addDoc(userRetweetsRef, {
        tweetID: tweetId,
        date: new Date(),
    });
};

// ***********/ Like Tweet /**************/

export const checkIfLiked = async (tweetId, userId) => {
    const userLikesRef = collection(db, 'users', userId, 'likes');
    const userLikesQuery = query(userLikesRef, where('tweetID', '==', tweetId));
    const userLikesSnapshot = await getDocs(userLikesQuery);
    return !userLikesSnapshot.empty;
};

export const likeTweet = async (tweetId, userId) => {
    try {
        const documentRef = doc(db, 'tweets', tweetId);
        const userLikesRef = collection(db, 'users', userId, 'likes');
        await updateDoc(documentRef, {
            likedBy: arrayUnion(userId),
            likes: increment(1)
        });
        await addDoc(userLikesRef, {
            tweetID: tweetId,
            date: new Date(),
        });
        console.log('Tweet liked');
    } catch (error) {
        console.error('Error liking tweet', error);
    }
};

export const unlikeTweet = async (tweetId, userId) => {
    try {
        const documentRef = doc(db, 'tweets', tweetId);
        const userLikesRef = collection(db, 'users', userId, 'likes');
        await updateDoc(documentRef, {
            likedBy: arrayRemove(userId),
            likes: increment(-1)
        });
        const userLikesQuery = query(userLikesRef, where('tweetID', '==', tweetId));
        const userLikesSnapshot = await getDocs(userLikesQuery);
        const userLikesDoc = userLikesSnapshot.docs[0];
        if (userLikesDoc) {
            const userLikesDocRef = doc(userLikesRef, userLikesDoc.id);
            await deleteDoc(userLikesDocRef);
        }
        console.log('Tweet unliked');
    } catch (error) {
        console.error('Error unliking tweet', error);
    }
};