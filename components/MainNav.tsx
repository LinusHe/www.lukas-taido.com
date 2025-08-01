import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes } from "react";
import styled from "styled-components";
import { contentPadding } from "../styles/contentPadding";

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
        passHref={true}
      >
        <Insta>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 7.6875C11.1471 7.6875 10.3133 7.94042 9.6041 8.41429C8.89492 8.88815 8.34217 9.56167 8.01577 10.3497C7.68937 11.1377 7.60397 12.0048 7.77036 12.8413C7.93676 13.6779 8.34749 14.4463 8.9506 15.0494C9.55372 15.6525 10.3221 16.0632 11.1587 16.2296C11.9952 16.396 12.8623 16.3106 13.6503 15.9842C14.4383 15.6578 15.1118 15.1051 15.5857 14.3959C16.0596 13.6867 16.3125 12.8529 16.3125 12C16.311 10.8567 15.8562 9.76067 15.0478 8.95225C14.2393 8.14382 13.1433 7.68899 12 7.6875ZM12 15.1875C11.3696 15.1875 10.7533 15.0006 10.2291 14.6503C9.70494 14.3001 9.29639 13.8022 9.05513 13.2198C8.81388 12.6374 8.75076 11.9965 8.87375 11.3781C8.99674 10.7598 9.30032 10.1919 9.7461 9.7461C10.1919 9.30032 10.7598 8.99674 11.3781 8.87375C11.9965 8.75076 12.6374 8.81388 13.2198 9.05513C13.8022 9.29639 14.3001 9.70494 14.6503 10.2291C15.0006 10.7533 15.1875 11.3696 15.1875 12C15.1875 12.8454 14.8517 13.6561 14.2539 14.2539C13.6561 14.8517 12.8454 15.1875 12 15.1875ZM16.5 2.4375H7.5C6.1578 2.43899 4.871 2.97284 3.92192 3.92192C2.97284 4.871 2.43899 6.1578 2.4375 7.5V16.5C2.43899 17.8422 2.97284 19.129 3.92192 20.0781C4.871 21.0272 6.1578 21.561 7.5 21.5625H16.5C17.8422 21.561 19.129 21.0272 20.0781 20.0781C21.0272 19.129 21.561 17.8422 21.5625 16.5V7.5C21.561 6.1578 21.0272 4.871 20.0781 3.92192C19.129 2.97284 17.8422 2.43899 16.5 2.4375ZM20.4375 16.5C20.4375 17.5443 20.0227 18.5458 19.2842 19.2842C18.5458 20.0227 17.5443 20.4375 16.5 20.4375H7.5C6.45571 20.4375 5.45419 20.0227 4.71577 19.2842C3.97734 18.5458 3.5625 17.5443 3.5625 16.5V7.5C3.5625 6.45571 3.97734 5.45419 4.71577 4.71577C5.45419 3.97734 6.45571 3.5625 7.5 3.5625H16.5C17.5443 3.5625 18.5458 3.97734 19.2842 4.71577C20.0227 5.45419 20.4375 6.45571 20.4375 7.5V16.5ZM17.8125 7.125C17.8125 7.31042 17.7575 7.49168 17.6545 7.64585C17.5515 7.80002 17.4051 7.92018 17.2338 7.99114C17.0625 8.06209 16.874 8.08066 16.6921 8.04449C16.5102 8.00831 16.3432 7.91902 16.2121 7.78791C16.081 7.6568 15.9917 7.48975 15.9555 7.3079C15.9193 7.12604 15.9379 6.93754 16.0089 6.76623C16.0798 6.59493 16.2 6.44851 16.3542 6.3455C16.5083 6.24248 16.6896 6.1875 16.875 6.1875C17.1236 6.1875 17.3621 6.28627 17.5379 6.46209C17.7137 6.6379 17.8125 6.87636 17.8125 7.125Z" />
          </svg>
        </Insta>
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
  z-index: 100;
  background-color: #2f3334;
  ${contentPadding("m")}
  padding-top: 1.6vw;
  padding-bottom: 1.8vw;

  > *:hover {
    text-decoration: underline;
  }
  a > {
    border: 1px solid red;
  }
`;
const Insta = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    fill: #87a687;
    stroke-width: 0;
  }
`;
const StyledLink = styled.span<{ active: boolean }>`
  text-decoration: ${({ active }) => (active ? "underline" : "none")};
`;
