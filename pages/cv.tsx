import Link from "next/link";
import { Fragment } from "react";
import styled from "styled-components";
import SlateContent from "../components/SlateContent";
import { contentPadding } from "../styles/contentPadding";
import { CVItem } from "../types";

interface Props {
  cv: CVItem[];
}
export default function CVPage({ cv }: Props) {
  return (
    <Wrapper>
      <Header>
        <h1>C.V. Lukas Taido</h1>
        <div id="index">
          {cv.map((item, index) => (
            <Link
              href={"#item" + index}
              key={index}
              style={{ display: "block" }}
              scroll={false}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </Header>
      {cv.map((item, index) => (
        <FullHeight id={`item${index}`} key={index}>
          <h2>{item.title}</h2>
          <SlateContent content={item.content} />
          <BackToTop onClick={() => scrollTo({ behavior: "smooth", top: 0 })}>
            top ↑
          </BackToTop>
        </FullHeight>
      ))}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  color: white;
  ${contentPadding("m")}
  padding-top:40px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;
const FullHeight = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 38px;
  h2 {
    font-weight: 400;
  }
`;
const Header = styled.div`
  font-size: 18px;
  font-weight: 400;
  min-height: 100vh;
  padding-top: 5vh;
  h1 {
    font-size: 18px;
    margin-bottom: 40px;
  }
  #index {
    display: flex;
    flex-direction: column;
    gap: 18px;
    color: #d0ebdc;
    > *:hover {
      text-decoration: underline;
    }
  }
`;

const BackToTop = styled.div`
  cursor: pointer;
  color: #d0ebdc;
  margin-top: 24px;
  :hover {
    text-decoration: underline;
  }
`;
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

export async function getServerSideProps() {
  const url = `${CMS_URL}/api/globals/global`;
  const res = await fetch(url);
  const { cv } = await res.json();
  return { props: { cv } };
}
