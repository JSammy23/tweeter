import React, { useContext } from 'react'
import { AppContext } from 'services/appContext'
import Tweet from './Tweet';

import styled from 'styled-components';
import { Header } from 'styles/styledComponents';
import Compose from './Compose';


const Thread = () => {
    const { activeThread, setActiveThread, setActiveFilter, currentUser } = useContext(AppContext);
    

  return (
    <>
        <Header>
            <h2>Tweet</h2>
        </Header>    
        <Tweet key={activeThread} tweet={activeThread} />
        <Compose 
         user={currentUser}
         action='reply'
         activeThread={activeThread} />
    </>
  )
}

export default Thread