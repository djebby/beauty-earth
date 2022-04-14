import React from "react";
import Wrapper from "../../shared/components/UIElements/Wrapper";

import classes from "./UserAvatar.module.css";

const UserAvatar = ({ name, email, image_url }) => {
  return (
    <Wrapper>
      <img
        className={classes.avatar__img}
        src={image_url}
        alt={name}
      />
      <h4>{name}</h4>
      <h6>{email}</h6>
    </Wrapper>
  );
};
export default UserAvatar;