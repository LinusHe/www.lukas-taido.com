import styled from "styled-components";
import SlateContent from "../components/SlateContent";

interface Props {
  contact: any;
}
export default function ContactPage({ contact }: Props) {
  return <Wrapper content={contact} />;
}
const Wrapper = styled(SlateContent)`
  color: white;
`;
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

export async function getServerSideProps() {
  const url = `${CMS_URL}/api/globals/global`;
  const res = await fetch(url);
  const { contact } = await res.json();
  return { props: { contact } };
}
