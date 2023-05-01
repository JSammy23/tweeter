import { doc, getDoc } from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import db from 'services/storage';

import styled from 'styled-components';
import { Title, UserHandle } from 'styles/styledComponents';

const TweetCard = styled.div`
 width: 100%;
 display: flex;
 padding: .5em;
 border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

const TweetHeader = styled.div`
 width: 100%;
 display: flex;
`;

const Div = styled.div`
 width: 100%;
 display: flex;
 justify-content: space-between;
`;

const UserImage = styled.img`
 width: 75px;
 height: 75px;
 border-radius: 50%;
 border: 1px solid ${props => props.theme.colors.primary};
 margin-right: .5em;
`;

const Name = styled.h2`
 color: ${props => props.theme.colors.primary};
`;

const Handle = styled.h3`
 color: ${props => props.theme.colors.secondary};
`;

const TweetBody = styled.div`
 width: 100%;
 text-align: center;
 color: #fff;
 font-size: 1.3em;
`;

const Tweet = ({ tweet }) => {

    const [author, setAuthor] = useState(null);

    useEffect(() => {
        const fetchAuthor = async () => {
            const authorRef = doc(db, 'users', tweet.authorID);
            const authorDoc = await getDoc(authorRef);
            setAuthor(authorDoc.data());
        }

        fetchAuthor();
    },[]);


  return (
    <TweetCard>
        <UserImage src={author?.profileImg} />
        <div className="flex column">
            <TweetHeader>
                <Div>
                    <div className="flex column">
                        <Name>{author?.displayName}</Name>
                        <Handle>{author?.userHandle}</Handle>
                    </div>
                    <div className="flex column">
                        <Handle>Tweet Date</Handle>
                    </div>
                </Div>
            </TweetHeader>
            <TweetBody>
                {tweet.body}
            </TweetBody>
        </div>
    </TweetCard>
  )
}

export default Tweet