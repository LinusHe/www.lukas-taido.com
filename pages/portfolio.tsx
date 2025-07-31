import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import FlipMove from "react-flip-move";
import styled from "styled-components";
import TagFilter, { CustomTag } from "../components/TagFilter";
import { contentPadding } from "../styles/contentPadding";
import type { Global, Project, Press, Tag } from "../types";
import Footer from "../components/Footer";
import { pagePaddingBottom } from "../styles/pagePadding";
import PdfModal from "../components/PdfModal";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

interface Props {
  projectsByTag: Record<string, Project[]>;
  allProjects: Project[];
  pressItems: Press[];
  global: Global;
}

const PortfolioPage: NextPage<Props> = ({
  projectsByTag,
  allProjects,
  pressItems,
  global,
}) => {
  const [tag, setTag] = useState<Tag | undefined>(
    global.portfolio.defaultTag || global.portfolio.activeTags?.[0]
  );
  const [showPress, setShowPress] = useState(false);
  const [selectedPressItem, setSelectedPressItem] = useState<Press | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pressTag: CustomTag = { id: "press", label: "Press" };

  const handleTagSelect = (selectedTag: Tag | CustomTag) => {
    if (selectedTag.id === "press") {
      setShowPress(true);
      setTag(undefined);
    } else {
      setShowPress(false);
      setTag(selectedTag as Tag);
    }
  };

  const handlePressItemClick = (pressItem: Press) => {
    setSelectedPressItem(pressItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Determine what to display based on selection
  const projects = showPress ? [] : (tag ? projectsByTag[tag.id] : allProjects);

  // Add Press as a custom tag option only if there are press items
  const allTags = [
    ...(global.portfolio.activeTags || []),
    ...(pressItems.length > 0 ? [pressTag] : [])
  ];

  return (
    <Wrapper>
      <Filter
        tags={allTags}
        active={showPress ? pressTag : tag}
        onSelectTag={handleTagSelect}
      />

      <Grid>
        {!showPress && projects.map((project) => (
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

        {showPress && pressItems.map((press) => (
          <div key={press.id} onClick={() => handlePressItemClick(press)}>
            <Teaser>
              <Background
                className="background"
                imageUrl={
                  CMS_URL +
                  (press.thumbnail?.sizes.thumbnail.url ||
                    press.thumbnail?.url!)
                }
              />
              <div className="foreground">{press.title}</div>
            </Teaser>
          </div>
        ))}
      </Grid>

      <PdfModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pressItem={selectedPressItem}
        cmsUrl={CMS_URL || ''}
      />

      <Footer />
    </Wrapper>
  );
};
export default PortfolioPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5vw;
  ${pagePaddingBottom}

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
const Background = styled.div<{ imageUrl: string; }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("${({ imageUrl }) => imageUrl}");
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
  const fetchPress = async () => {
    const url = `${CMS_URL}/api/press?limit=1000`;
    const res = await fetch(url);
    return await res.json();
  };

  const [projects, global, press] = await Promise.all([
    fetchProjects(),
    fetchGlobal(),
    fetchPress(),
  ]);

  const projectsByTag = (projects.docs as Project[])
    .sort((a, b) => b.priority - a.priority)
    .reduce((acc, project) => {
      project.tags?.forEach((tag) => {
        if (!acc[tag.id]) {
          acc[tag.id] = [];
        }
        acc[tag.id].push(project);
      });
      return acc;
    }, {} as Record<string, Project[]>);

  const pressItems = press.docs ?
    (press.docs as Press[]).sort((a, b) => b.priority - a.priority) :
    [];

  return {
    props: {
      projectsByTag,
      allProjects: projects.docs,
      pressItems,
      global,
    },
  };
}
