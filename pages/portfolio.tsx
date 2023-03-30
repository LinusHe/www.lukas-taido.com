import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import MainNav from "../components/MainNav";
import TagFilter from "../components/TagFilter";
import type { Global, Project } from "../types";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

interface Props {
  projectsByTag: Record<string, Project[]>;
  global: Global;
}

const PortfolioPage: NextPage<Props> = ({ projectsByTag, global }) => {
  const [tag, setTag] = useState(global.activeTags[0]);
  const { route } = useRouter();

  return (
    <Wrapper>
      <TagFilter tags={global.activeTags} active={tag} onSelectTag={setTag} />
      <Grid>
        {projectsByTag[tag.id].map((project) => (
          <Link key={project.id} href={"/projects/" + project.id}>
            <Teaser
              imageUrl={
                CMS_URL +
                (project.teaserImage?.sizes.thumbnail.url ||
                  project.teaserImage?.url!)
              }
            >
              <div>{project.title}</div>
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
  gap: 32px;
`;
const Grid = styled.div`
  display: grid;
  gap: clamp(12px, 2.5vw, 40px);
  grid-template-columns: repeat(
    auto-fit,
    minmax(200px, 1fr)
  ); /* Minimum width of 200px, maximum width of 1fr */
`;
const Teaser = styled.div<{ imageUrl: string }>`
  background-image: url(${({ imageUrl }) => imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: none;
  padding-top: 56.66%;
  position: relative;
  outline: 1px solid grey;
  cursor: pointer;
  > div {
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
  :hover > div {
    opacity: 1;
  }
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
