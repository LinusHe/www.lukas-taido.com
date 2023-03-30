import { HTMLAttributes } from "react";
import { slateToHtml, payloadSlateToDomConfig } from "slate-serializers";
import styled from "styled-components";

const Wrapper = styled.div`
  a {
    color: #d0ebdc;
    :hover {
      text-decoration: underline;
    }
  }
  strong {
    font-weight: bold;
  }
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  content: any;
}

const SlateContent: React.FC<Props> = (props) => {
  const { content, children, ...rest } = props;
  return (
    <Wrapper
      {...rest}
      dangerouslySetInnerHTML={{
        __html: slateToHtml(content, payloadSlateToDomConfig),
      }}
    />
  );
};

export default SlateContent;
