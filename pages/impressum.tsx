import styled from "styled-components";
import SlateContent from "../components/SlateContent";
import { contentPadding } from "../styles/contentPadding";
import { pagePaddingBottom } from "../styles/pagePadding";

interface Props {
  content: any;
}
export default function ImpressumPage({ content }: Props) {
  return <Wrapper content={content} />;
}
const Wrapper = styled(SlateContent)`
  color: white;
  ${contentPadding("m")}
  ${pagePaddingBottom}
`;
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

export async function getServerSideProps() {
  const url = `${CMS_URL}/api/globals/impressum`;
  const res = await fetch(url);
  const { content } = await res.json();
  return { props: { content } };
}
