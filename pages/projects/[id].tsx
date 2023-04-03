import styled from "styled-components";
import { Project } from "../../types";
import { GetServerSidePropsContext } from "next";
import SlateContent from "../../components/SlateContent";
import { contentPadding } from "../../styles/contentPadding";

interface Props {
  project: Project;
}
export default function ProjectPage({ project }: Props) {
  const { content, title, images, videos } = project;

  return (
    <Wrapper>
      <ProjectTitle>{title}</ProjectTitle>
      <SlateContent content={content} collapsible />
      {((images && !!images.length) || (videos && !!videos.length)) && (
        <MediaGrid>
          {videos?.map(({ vimeoUrl, caption }) => {
            const videoId = vimeoUrl.split("/").pop();
            const embedUrl = `https://player.vimeo.com/video/${videoId}`;

            return (
              <VideoContainer>
                <IFrameWrapper>
                  <iframe
                    src={embedUrl}
                    frameBorder="0"
                    title={caption}
                    allow="autoplay; fullscreen; picture-in-picture"
                  />
                </IFrameWrapper>

                <Caption>{caption}</Caption>
              </VideoContainer>
            );
          })}
          {images?.map(({ image, caption }, index) => (
            <div key={index}>
              <img src={CMS_URL + (image.sizes.tablet.url || image.url)} />
              {caption && <Caption>{caption}</Caption>}
            </div>
          ))}
        </MediaGrid>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100%;
  color: white;
  ${contentPadding("m")}
  padding-bottom: 2.5vw;
`;
const ProjectTitle = styled.h1`
  font-size: 1.5em;
  line-height: 1.2em;
  margin-top: 20px;
  margin-bottom: 32px;
  font-weight: 200; ;
`;
const VideoContainer = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr;
`;

const Caption = styled.p`
  font-size: 16px;
  margin-top: 8px;
`;

const IFrameWrapper = styled.div`
  padding-bottom: 56.25%;
  position: relative;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
const MediaGrid = styled.div`
  margin-top: clamp(24px, 5vw, 40px);
  display: grid;
  max-width: 100%;
  gap: 4vw;
  grid-template-columns: 1fr;
  img {
    width: 100%;
    max-width: 100%;
    outline: 1px solid grey;
  }

  @media only screen and (min-width: 551px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { id } = query;
  const url = `${CMS_URL}/api/projects/${id}`;
  const res = await fetch(url);
  const project = await res.json();
  return {
    props: {
      project,
    }, // will be passed to the page component as props
  };
}
