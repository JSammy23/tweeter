import React from 'react'

const FollowList = ({ followers, following, onBackClick }) => {
  return (
    <div>
        <div>Following List</div>
        <button onClick={onBackClick}>Return</button>
    </div>
  )
}

export default FollowList