import { updateDoc, deleteDoc, getDocs, addDoc, arrayRemove, arrayUnion, collection, doc, where, query, increment, orderBy, runTransaction } from 'firebase/firestore'; 
import db from 'services/storage';
import { fetchFromFirestore } from './firebaseUtils';

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

// ********** Replies *********** //

export const fetchReplies = async (threadId) => {
    if (!threadId) return [];

    const repliesRef = collection(db, 'tweets');
    const repliesQuery = query(
        repliesRef,
        where("replyTo", "==", threadId),
        orderBy('date', 'desc')
    );
    const repliesSnapshot = await getDocs(repliesQuery);

    if (!repliesSnapshot.empty) {
        return repliesSnapshot.docs.map(doc => doc.data());
    } else {
        return [];
    }
};

export const reduceReplyCount = async (tweetId) => {
    const tweetRef = doc(db, 'tweets', tweetId);
    // Start a new transaction
    await runTransaction(db, async (transaction) => {
        const tweetDoc = await transaction.get(tweetRef);
        if (!tweetDoc.exists()) {
            throw new Error("Tweet does not exist!");
        }

        let currentReplyCount = tweetDoc.data().replies || 0;

        if (currentReplyCount > 0) {
            currentReplyCount--;
        }
        transaction.update(tweetRef, { replies: currentReplyCount });
    });
};

// **************** Grab Tweet Id's ******************* //

export const fetchFromUserSubCollection = async (userUid, collectionName) => {
    // 1. Fetch data from the specified user's sub-collection
    const subCollectionRef = collection(db, 'users', userUid, collectionName);
    const subCollectionQuery = query(subCollectionRef);
    const subCollectionSnapshot = await getDocs(subCollectionQuery);
    const subCollectionData = subCollectionSnapshot.docs.map(doc => doc.data());
    const tweetIds = subCollectionData.map((data) => data.tweetID);
    
    // 2. Use the tweetID values to get the actual tweets
    const tweetsRef = collection(db, 'tweets');
    const tweetsQuery = query(tweetsRef, where('__name__', 'in', tweetIds));
    const tweetsSnapshot = await getDocs(tweetsQuery);

    // 3. Combine the two arrays based on the tweetID
    const tweetsData = tweetsSnapshot.docs.map(doc => doc.data());
    const combinedData = subCollectionData.map(subItem => {
        const tweet = tweetsData.find(t => t.id === subItem.tweetID);
        if (!tweet) return null;
        return {
            ...tweet,
            subCollectionDate: subItem.date
        };
    }).filter(item => item !== null);

    // 4. Sort the combined array based on the subCollectionDate values
    combinedData.sort((a, b) => b.subCollectionDate - a.subCollectionDate);

    return combinedData;
}

export const fetchUserTweetsAndLikes = async (userUid) => {
    const userTweets = await fetchFromUserSubCollection(userUid, 'tweetBucket');
    const userLikes = await fetchFromUserSubCollection(userUid, 'likes');
    return {
        userTweets,
        userLikes
    };
};

export const fetchSubscribedTweets = async (usersFollowingUidArray) => {
    const subscribedTweets = [];
    const fetchUserTweetsPromise = usersFollowingUidArray.map(async (user) => {
        const followedUserTweetBucketTweets = await fetchFromUserSubCollection(user, 'tweetBucket');
        followedUserTweetBucketTweets.forEach((tweet) => {
            const isDuplicate = subscribedTweets.some((existingTweet) => existingTweet.id === tweet.id);
            if (!isDuplicate) {
                subscribedTweets.push(tweet);
            }
        });
    });
    await Promise.all(fetchUserTweetsPromise);

    return {
        subscribedTweets
    };
}

export const fetchExploreTweets = async () => {
    const recentTweets = await fetchFromFirestore('tweets', [
        ['isReply', '==', false],
        ['date', 'orderBy', 'desc']
    ]);
    return {
        recentTweets
    };
};