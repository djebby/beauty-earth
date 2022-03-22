import React from "react";
import { useParams } from "react-router-dom";

const UpdatePictures = () => {
  const pid = useParams().picId;

  return <div>UpdatePictures ID == {pid}</div>;
};

export default UpdatePictures;
