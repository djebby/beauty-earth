import React, {useContext} from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context.js";
import Wrapper from "../../shared/components/UIElements/Wrapper.js";
import classes from "./PictureCard.module.css";

const PictureCard = ({ picture, pictureDeleteHandler }) => {

  const logCtx = useContext(AuthContext);
  

  return (
    <Wrapper>
      <img
        className={classes.img}
        src={`${process.env.REACT_APP_ASSET_URL + picture.image_url}`}
      />
      <div className={classes.row}>
        <h3>{picture.title}</h3>

        {"creator_id" in picture && (
          <Link to={`/${picture.creator_id._id}/pictures`}>
            <img
              className={classes.img_avatar}
              src={
                process.env.REACT_APP_ASSET_URL + picture.creator_id.image_url
              }
            />
            {picture.creator_id.name}
          </Link>
        )}
      </div>
      <p>{picture.description}</p>
      <h6>
        <i className="bi bi-geo-alt-fill"></i> {picture.address}
      </h6>
      {logCtx.isLoggedIn &&  (logCtx.userId === picture.creator_id._id ) && <div className={classes.edit_delete}>
        <Link to={`/pictures/update/${picture._id}`}>
          <button type="button" className="btn btn-success mx-4">
            Editing
          </button>
        </Link>
        <button
          type="button"
          className="btn btn-danger"
          onClick={pictureDeleteHandler.bind(this, picture._id)}
        >
          Delete
        </button>
      </div>}
    </Wrapper>
  );
};

export default PictureCard;
