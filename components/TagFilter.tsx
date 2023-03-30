import { HTMLAttributes } from "react";
import styled from "styled-components";
import { Tag } from "../types";

interface Props extends HTMLAttributes<HTMLDivElement> {
  active: Tag;
  tags: Tag[];
  onSelectTag: (tag: Tag) => void;
}

const TagFilter: React.FC<Props> = (props) => {
  const { tags, active, onSelectTag, ...rest } = props;
  return (
    <Wrapper {...rest}>
      {tags.map((tag) => (
        <div
          onClick={() => onSelectTag(tag)}
          className={active.id === tag.id ? "active" : ""}
        >
          {tag.label}
        </div>
      ))}
    </Wrapper>
  );
};

export default TagFilter;

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  font-size: 16px;
  flex-wrap: wrap;
  > div {
    cursor: pointer;
    white-space: nowrap;
    color: gray;
    &.active {
      text-decoration: underline;
    }
  }
`;
