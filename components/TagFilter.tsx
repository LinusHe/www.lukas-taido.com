import { HTMLAttributes } from "react";
import styled from "styled-components";
import { contentPadding } from "../styles/contentPadding";
import { Tag } from "../types";

// Extended tag interface to allow for custom tags that aren't full Tag objects
export interface CustomTag {
  id: string;
  label: string;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  active?: Tag | CustomTag;
  tags?: (Tag | CustomTag)[];
  onSelectTag: (tag: Tag | CustomTag) => void;
}

const TagFilter: React.FC<Props> = (props) => {
  const { tags, active, onSelectTag, ...rest } = props;
  if (!tags) return null;
  return (
    <Wrapper {...rest}>
      {tags.map((tag, index) => (
        <div
          key={index}
          onClick={() => onSelectTag(tag)}
          className={active?.id === tag.id ? "active" : ""}
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
  column-gap: 20px;
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
