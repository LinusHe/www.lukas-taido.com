import styled from "styled-components";
import SlateContent from "../components/SlateContent";
import { contentPadding } from "../styles/contentPadding";
import Footer from "../components/Footer";
import { pagePaddingBottom } from "../styles/pagePadding";

interface Props {
  contact: any;
}
export default function ContactPage({ contact }: Props) {
  return (
    <Wrapper>
      <SlateContent content={contact} />
      <Footer />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  color: white;
  ${contentPadding("m")}
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  ${pagePaddingBottom}
`;
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

export async function getServerSideProps() {
  const url = `${CMS_URL}/api/globals/global`;
  const res = await fetch(url);
  const { contact } = await res.json();
  return { props: { contact } };
}
