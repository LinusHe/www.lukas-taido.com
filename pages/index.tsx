import styled from "styled-components";
import Link from "next/link";
import ImageSlider from "../components/ImageSlider";
import { CMSImage } from "../types";
interface Props {
  introGallery: CMSImage[];
}
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

export default function Home({ introGallery }: Props) {
  return (
    <>
      <Link href={"/portfolio"}>
        <Wrapper>
          <StyledImageSlider
            images={introGallery}
            duration={3000}
            transitionDuration={1000}
          />
          <div id="content">
            <h1>
              lukas taido - music_audiovisual concept art_soundsculptures_audio
              installations
            </h1>
            <div id="cta">click anywhere to enter</div>
          </div>
        </Wrapper>
      </Link>
    </>
  );
}
export async function getServerSideProps() {
  // fetch global data from CMS
  const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/global`;
  const res = await fetch(url);
  const introGallery: { image: CMSImage }[] = (await res.json()).introGallery;

  return {
    props: {
      introGallery: introGallery.map((media) => {
        media.image.url = CMS_URL + media.image.url;
        return media.image;
      }),
    },
  };
}

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;

  #content {
    position: absolute;
    left: 10%;
    right: 10%;
    top: 15%;
    color: #d0ebdc;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;

    h1 {
      font-size: 1.5em;
      line-height: 1.5em;
    }
    #cta {
      margin: 34px 0 0 30px;
      font-size: 1em;
    }
    @media only screen and (min-width: 551px) {
      left: 18%;
      right: 18%;
      top: 10%;
      h1 {
        font-size: 2em;
      }
      #cta {
        font-size: 1.2em;
      }
    }
  }
`;
const StyledImageSlider = styled(ImageSlider)`
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
