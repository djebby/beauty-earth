import React from 'react';
import {useParams} from "react-router-dom";

const UserPictures = () => {
    const uid = useParams().userId;

  return (
    <div>UserPictures {uid}</div>
  )
}

export default UserPictures;