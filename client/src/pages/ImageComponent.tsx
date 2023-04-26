import React from "react";

interface Props {
  imageUrl: string;
  altText: string;
}

const ImageComponent: React.FC<Props> = ({ imageUrl, altText }) => {
  return (
    <img src={imageUrl} alt={altText} />
  );
};

export default ImageComponent;