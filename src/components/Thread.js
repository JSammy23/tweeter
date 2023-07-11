import React, { useContext } from 'react'
import { AppContext } from 'services/appContext'
import Tweet from './Tweet';

import styled from 'styled-components';
import { Header } from 'styles/styledComponents';

const Thread = () => {
    const { activeThread, setActiveThread, setActiveFilter } = useContext(AppContext);
    

  return (
    <>
        <Header>
            <h2>Tweet</h2>
        </Header>    
        <Tweet key={activeThread} tweet={activeThread} />
    </>
  )
}

export default Thread