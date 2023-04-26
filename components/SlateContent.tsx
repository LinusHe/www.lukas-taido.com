import { HTMLAttributes, useMemo, useState } from "react";
import { slateToHtml, payloadSlateToDomConfig } from "slate-serializers";
import styled from "styled-components";

const Wrapper = styled.div`
  a {
    color: #d0ebdc;
    :hover {
      text-decoration: underline;
    }
  }
  p {
    margin-top: 10px;
    margin-bottom: 25px;
  }
  strong {
    font-weight: 400;
  }
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  ul li::before {
    content: "-";
    margin-right: 0.5em;
  }
  h1 {
    font-size: 1.5em;
    line-height: 1.2em;
    margin-top: 20px;
    margin-bottom: 32px;
    font-weight: 200;
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 400;
  }
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  content?: any[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const SlateContent: React.FC<Props> = (props) => {
  const {
    content = [],
    collapsible,
    defaultOpen: defaultCollapsed,
    children,
    ...rest
  } = props;
  const [open, setOpen] = useState(props.defaultOpen || false);

  const shouldCollapse =
    (collapsible && content.length > 2) ||
    (content[0] ? content[0].children.length > 3 : false);

  const collapsedContent = useMemo(() => {
    if (!content?.length) return undefined;
    if (content.length > 2) return content.slice(0, 2);
    else return content[0].children.slice(0, 3);
  }, [content]);

  if (!content?.length) return null;
  return (
    <Wrapper {...rest}>
      <Content
        show={!shouldCollapse || open}
        dangerouslySetInnerHTML={{
          __html: slateToHtml(content, payloadSlateToDomConfig),
        }}
      />
      {shouldCollapse && (
        <Content
          show={!open}
          dangerouslySetInnerHTML={{
            __html: slateToHtml(collapsedContent, payloadSlateToDomConfig),
          }}
        />
      )}

      {shouldCollapse && (
        <Button onClick={() => setOpen(!open)}>
          {open ? "Show less" : "...show more"}
        </Button>
      )}
    </Wrapper>
  );
};

export default SlateContent;

const Content = styled.div<{ show?: boolean }>`
  height: ${(props) => (props.show ? "auto" : "0")};
  overflow: hidden;
`;

const Button = styled.div`
  cursor: pointer;
  margin-top: 10px;
  color: #87a687;
  :hover {
    text-decoration: underline;
  }
`;
