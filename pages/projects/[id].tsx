import styled from "styled-components";
import { Project } from "../../types";
import { GetServerSidePropsContext } from "next";
import SlateContent from "../../components/SlateContent";

interface Props {
  project: Project;
}
export default function ProjectPage({ project }: Props) {
  const { content, title, images } = project;

  return (
    <Wrapper>
      <ProjectTitle>{title}</ProjectTitle>
      <SlateContent content={content} />
      {images && !!images.length && (
        <MediaGrid>
          {images.map(({ image, caption }) => (
            <div>
              <img src={CMS_URL + (image.sizes.tablet.url || image.url)} />
              {caption && <div className="caption">{caption}</div>}
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
`;
const ProjectTitle = styled.h1`
  font-size: 1.5em;
  line-height: 1.2em;
  margin-bottom: 20px;
  font-weight: 200;
`;
const MediaGrid = styled.div`
  display: grid;
  max-width: 100%;
  gap: 8px;
  grid-template-columns: 1fr;
  img {
    max-width: 100%;
  }
  > div {
    .caption {
      margin-top: 24px;
    }
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
