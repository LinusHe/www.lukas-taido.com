import { NextPage } from "next";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import FlipMove from "react-flip-move";
import styled from "styled-components";
import TagFilter, { CustomTag } from "../components/TagFilter";
import { contentPadding } from "../styles/contentPadding";
import type { Global, Project, Press, Tag } from "../types";
import Footer from "../components/Footer";
import { pagePaddingBottom } from "../styles/pagePadding";
import PdfModal from "../components/PdfModal";
import VideoModal from "../components/VideoModal";

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
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [columnCount, setColumnCount] = useState(2);
  const masonryRef = useRef<HTMLDivElement>(null);

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
    if (pressItem.pressType === 'video') {
      setIsVideoModalOpen(true);
    } else {
      setIsPdfModalOpen(true);
    }
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  // Calculate dynamic column count based on viewport width
  useEffect(() => {
    const calculateColumnCount = () => {
      if (!masonryRef.current) return;

      const containerWidth = masonryRef.current.offsetWidth;
      const minColumnWidth = 250; // Same as projects grid
      const gap = 24; // Approximate gap size

      // Calculate how many columns can fit
      const availableWidth = containerWidth - gap;
      const calculatedColumns = Math.max(1, Math.floor(availableWidth / (minColumnWidth + gap)));

      // Limit to reasonable range
      const clampedColumns = Math.min(calculatedColumns, 6);
      setColumnCount(clampedColumns);
    };

    calculateColumnCount();
    window.addEventListener('resize', calculateColumnCount);
    return () => window.removeEventListener('resize', calculateColumnCount);
  }, [showPress]);

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

      {!showPress && (
        <Grid>
          {projects.map((project) => (
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
      )}

      {showPress && (
        <MasonryGrid ref={masonryRef} columnCount={columnCount}>
          {pressItems.map((press) => {
            const aspectRatio = press.thumbnail?.width && press.thumbnail?.height
              ? press.thumbnail.height / press.thumbnail.width
              : 0.75;

            const formatDate = (dateString: string) => {
              const date = new Date(dateString);
              return date.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            };

            // Generate optimized thumbnail URL with same aspect ratio
            const getOptimizedThumbnailUrl = (originalUrl: string, width: number, height: number) => {
              const maxWidth = 400; // Maximum width for thumbnails
              const maxHeight = 600; // Maximum height for thumbnails

              // Calculate new dimensions maintaining aspect ratio
              let newWidth = width;
              let newHeight = height;

              if (width > maxWidth) {
                newWidth = maxWidth;
                newHeight = Math.round((height * maxWidth) / width);
              }

              if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = Math.round((width * maxHeight) / height);
              }

              // Add Payload CMS resize parameters
              return `${originalUrl}?width=${newWidth}&height=${newHeight}&fit=cover`;
            };

            const optimizedImageUrl = press.thumbnail?.url
              ? getOptimizedThumbnailUrl(
                press.thumbnail.url,
                press.thumbnail.width || 400,
                press.thumbnail.height || 300
              )
              : '';

            return (
              <PressItemWithText key={press.id} onClick={() => handlePressItemClick(press)}>
                <PressBackground
                  className="background"
                  imageUrl={
                    CMS_URL + optimizedImageUrl
                  }
                  aspectRatio={aspectRatio}
                />
                {press.pressType === 'video' && (
                  <PlayIcon src="/btn-play.svg" alt="Play video" />
                )}
                <div className="foreground">
                  <div className="title">{press.title}</div>
                  <div className="meta">
                    <div className="date">{formatDate(press.date)}</div>
                    <div className="publisher">{press.publisher}</div>
                  </div>
                </div>
              </PressItemWithText>
            );
          })}
        </MasonryGrid>
      )}

      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={handleClosePdfModal}
        pressItem={selectedPressItem}
        cmsUrl={CMS_URL || ''}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        pressItem={selectedPressItem}
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

const MasonryGrid = styled.div<{ columnCount: number; }>`
  ${contentPadding("s")};
  column-count: ${({ columnCount }) => columnCount};
  column-gap: clamp(12px, 2.5vw, 24px);
  
  /* Ensure proper masonry behavior */
  > * {
    display: block;
    break-inside: avoid;
    margin-bottom: clamp(16px, 3vw, 32px);
  }
`;

const Teaser = styled.div`
  position: relative;
  outline: 1px solid grey;
  cursor: pointer;
  overflow: hidden;
  padding-top: 56.66%;
  break-inside: avoid;
  margin-bottom: clamp(12px, 2.5vw, 24px);

  > .foreground {
    color: white;
    position: absolute;
    font-size: 1em;
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

const PressItem = styled.div`
  position: relative;
  outline: 1px solid grey;
  cursor: pointer;
  overflow: hidden;
  display: block;

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

const PressItemWithText = styled.div`
  position: relative;
  outline: 1px solid grey;
  cursor: pointer;
  overflow: hidden;
  display: block;

  > .background {
    transition: transform 1s;
  }

  > .foreground {
    color: white;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background-color: rgba(0, 0, 0, 0.8);
    transform: translateY(0);
    transition: transform 0.3s ease;

    .title {
      font-size: 1em;
      margin-bottom: 4px;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      flex-wrap: wrap;
    }

    .date {
      font-size: 0.9em;
      opacity: 0.8;
    }

    .publisher {
      font-size: 0.9em;
      opacity: 0.8;
      text-align: right;
      flex-shrink: 0;
    }
  }

  :hover {
    > .background {
      transform: scale(1.1);
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
  background-repeat: no-repeat;
  transition: transform 1s;
`;

const PressBackground = styled.div<{ imageUrl: string; aspectRatio: number; }>`
  width: 100%;
  height: 0;
  padding-bottom: ${({ aspectRatio }) => aspectRatio * 100}%;
  background-image: url("${({ imageUrl }) => imageUrl}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 1s;
`;

const PlayIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  z-index: 2;
  opacity: 0.9;
  transition: opacity 0.3s ease;
  pointer-events: none;

  ${PressItemWithText}:hover & {
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
