import React, { useState, useEffect, useRef, ReactElement, useCallback } from "react";
import styled from "styled-components";

interface GridProps {
  children: ReactElement[];
  cellAspectRatio: number;
  gridGutter: number;
  minCellWidth: number;
  maxCellWidth: number;
  minColumns: number;
}

const GridContainer = styled.div<{ columnWidth: number; gridGutter: number; }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props) => props.columnWidth}px, 1fr)
  );
  grid-gap: ${(props) => props.gridGutter}px;
`;

const GridItem = styled.div`
  position: relative;
  will-change: transform, opacity;
`;

const AspectRatioGrid: React.FC<GridProps> = ({
  children,
  cellAspectRatio,
  gridGutter,
  minCellWidth,
  maxCellWidth,
  minColumns,
}) => {
  const [columnWidth, setColumnWidth] = useState(minCellWidth);
  const gridItemsRef = useRef<{ [key: string]: HTMLElement; }>({});

  const updateColumnWidth = useCallback(() => {
    const containerWidth = window.innerWidth;
    const numColumns = Math.max(
      minColumns,
      Math.floor(containerWidth / minCellWidth)
    );
    const newColumnWidth = Math.min(maxCellWidth, containerWidth / numColumns);
    setColumnWidth(newColumnWidth);
  }, [minColumns, minCellWidth, maxCellWidth]);

  const getPositionData = () => {
    const positions: { [key: string]: { top: number; left: number; }; } = {};

    for (const key in gridItemsRef.current) {
      const element = gridItemsRef.current[key];
      positions[key] = {
        top: element.offsetTop,
        left: element.offsetLeft,
      };
    }

    return positions;
  };

  const animateItems = (oldPositions: ReturnType<typeof getPositionData>) => {
    const newPositions = getPositionData();

    for (const key in gridItemsRef.current) {
      const element = gridItemsRef.current[key];
      const dx = oldPositions[key].left - newPositions[key].left;
      const dy = oldPositions[key].top - newPositions[key].top;

      if (dx || dy) {
        element.style.transform = `translate(${dx}px, ${dy}px)`;
        element.style.transition = "none";

        requestAnimationFrame(() => {
          element.style.transform = "";
          element.style.transition = "transform 0.5s ease";
        });
      }
    }
  };

  const handleResize = useCallback(() => {
    const oldPositions = getPositionData();
    updateColumnWidth();
    requestAnimationFrame(() => animateItems(oldPositions));
  }, [updateColumnWidth]);

  useEffect(() => {
    updateColumnWidth();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, updateColumnWidth]);

  return (
    <GridContainer columnWidth={columnWidth} gridGutter={gridGutter}>
      {children.map((child) => (
        <GridItem
          key={child.key}
          ref={(element) =>
            element && (gridItemsRef.current[child.key as string] = element)
          }
          style={{ paddingBottom: `${(1 / cellAspectRatio) * 100}%` }}
        >
          {child}
        </GridItem>
      ))}
    </GridContainer>
  );
};

export default AspectRatioGrid;
