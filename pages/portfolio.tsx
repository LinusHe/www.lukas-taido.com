import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import FlipMove from "react-flip-move";
import styled from "styled-components";
import TagFilter from "../components/TagFilter";
import { contentPadding } from "../styles/contentPadding";
import type { Global, Project } from "../types";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

interface Props {
  projectsByTag: Record<string, Project[]>;
  global: Global;
}

const PortfolioPage: NextPage<Props> = ({ projectsByTag, global }) => {
  const [tag, setTag] = useState(
    global.portfolio.defaultTag || global.portfolio.activeTags[0]
  );

  return (
    <Wrapper>
      <Filter
        tags={global.portfolio.activeTags}
        active={tag}
        onSelectTag={setTag}
      />

      <Grid>
        {projectsByTag[tag.id].map((project) => (
          <Link key={project.id} href={"/projects/" + project.id}>
            <Teaser>
              <Background
                className="background"
                imageUrl={
                  CMS_URL +
                  (project.teaserImage?.sizes.thumbnail.url ||
                    project.teaserImage?.url!)
                }
              />
              <div className="foreground">{project.title}</div>
            </Teaser>
          </Link>
        ))}
      </Grid>
    </Wrapper>
  );
};
export default PortfolioPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5vw;
  padding-bottom: 2.5vw;
  padding-top: 12px;
  @media only screen and (min-width: 551px) {
    padding-top: 0;
  }
`;
const Filter = styled(TagFilter)`
  ${contentPadding("m")}
`;

const Grid = styled(FlipMove)`
  display: grid;
  gap: clamp(12px, 2.5vw, 24px);
  ${contentPadding("s")};
  transition: all ease-in-out 0.25s;
  grid-template-columns: 1fr 1fr;
  @media only screen and (min-width: 551px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
`;
const Teaser = styled.div`
  position: relative;
  outline: 1px solid grey;
  cursor: pointer;
  overflow: hidden;
  padding-top: 56.66%;

  > .foreground {
    color: white;
    position: absolute;
    font-size: 0.9em;
    opacity: 0;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    padding: 8px;
    transition: opacity 0.5s;
    background-color: rgba(0, 0, 0, 0.5);
  }
  :hover {
    > .background {
      transform: scale(1.25);
    }
    > .foreground {
      opacity: 1;
    }
  }
`;
const Background = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${({ imageUrl }) => imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: none;
  transition: transform 1s;
`;
export async function getServerSideProps() {
  const fetchProjects = async () => {
    const url = `${CMS_URL}/api/projects?limit=1000`;
    const res = await fetch(url);
    return await res.json();
  };
  const fetchGlobal = async () => {
    const url = `${CMS_URL}/api/globals/global`;
    const res = await fetch(url);
    return await res.json();
  };
  const [projects, global] = await Promise.all([
    fetchProjects(),
    fetchGlobal(),
  ]);

  const projectsByTag = (projects.docs as Project[]).reduce((acc, project) => {
    project.tags.forEach((tag) => {
      if (!acc[tag.id]) {
        acc[tag.id] = [];
      }
      acc[tag.id].push(project);
    });
    return acc;
  }, {} as Record<string, Project[]>);
  return {
    props: {
      projectsByTag,
      global,
    }, // will be passed to the page component as props
  };
}
