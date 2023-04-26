import Link from "next/link";
import { HTMLAttributes } from "react";
import styled from "styled-components";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Footer: React.FC<Props> = ({ ...rest }) => {
  return (
    <Wrapper {...rest}>
      <Link href="/impressum">Impressum</Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 2.5vw;
  a {
    color: white;
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  }
`;

export default Footer;
