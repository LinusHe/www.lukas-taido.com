import Image from "next/image";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CMSImage } from "../types";

interface ImageSliderProps {
  images: CMSImage[];
  duration: number;
  transitionDuration: number;
}

const ImageSlider: React.FC<ImageSliderProps> = (props) => {
  const { images, duration, transitionDuration, ...rest } = props;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    let intervalId: NodeJS.Timeout;
    const changeImage = () => {
      intervalId = setTimeout(() => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
      }, duration);
    };
    changeImage();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    isLoading,
    currentImageIndex,
    duration,
    images.length,
    transitionDuration,
  ]);
  return (
    <ImageSliderContainer {...rest}>
      <LoadingScreen />
      {props.images.map((image, index) => (
        <SlideImage
          transitionDuration={transitionDuration}
          key={index}
          alt=""
          isCurrentImage={index === currentImageIndex}
          style={{
            opacity: !isLoading && index === currentImageIndex ? 1 : 0,
          }}
          objectFit="cover"
          layout="fill"
          src={image.url}
          onLoad={() => {
            console.log("loaded");

            if (index === 0) setIsLoading(false);
          }}
        />
      ))}
    </ImageSliderContainer>
  );
};

export default ImageSlider;

const ImageSliderContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const SlideImage = styled(Image)<{
  isCurrentImage: boolean;
  transitionDuration: number;
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity ${(p) => p.transitionDuration}ms ease-in-out;
  opacity: ${(props) => (props.isCurrentImage ? 1 : 0)};
`;

const LoadingScreen = styled.div`
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: darkgray;
`;
