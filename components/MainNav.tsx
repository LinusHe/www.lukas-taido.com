import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes } from "react";
import styled from "styled-components";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const MainNav: React.FC<Props> = (props) => {
  const { ...rest } = props;
  const { route, pathname } = useRouter();

  return (
    <Wrapper {...rest}>
      <Link href="/portfolio">
        <StyledLink active={route.includes("portfolio")}>HOME</StyledLink>
      </Link>
      <Link href="/cv">
        <StyledLink active={route.includes("cv")}>BIO/CV</StyledLink>
      </Link>
      <Link href="/contact">
        <StyledLink active={route.includes("contact")}>CONTACT</StyledLink>
      </Link>
      <Link
        href="https://www.instagram.com/lukas.taido/"
        target="_blank"
        referrerPolicy="no-referrer"
      >
        INSTAGRAM
      </Link>
    </Wrapper>
  );
};

export default MainNav;

const Wrapper = styled.nav`
  display: flex;
  gap: 30px;
  font-size: 1.5em;
  color: #87a687;
  padding: 24px 0;
  margin-bottom: 40px;
  position: sticky;
  z-index: 100;
  background-color: #2f3334;
  top: 0;
  > *:hover {
    text-decoration: underline;
  }
`;

const StyledLink = styled.span<{ active: boolean }>`
  text-decoration: ${({ active }) => (active ? "underline" : "none")};
`;
