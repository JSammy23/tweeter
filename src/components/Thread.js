import React, { useContext } from 'react'
import { AppContext } from 'services/appContext'
import Tweet from './Tweet';

const Thread = () => {
    const { activeThread, setActiveThread, setActiveFilter } = useContext(AppContext);
    

  return (
    <>
        <Tweet key={activeThread} tweet={activeThread} />
    </>
  )
}

export default Thread