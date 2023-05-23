import type { AppProps } from "next/app";
import { Source_Sans_Pro } from "next/font/google";
import Head from "next/head";
import styled from "styled-components";
import MainNav from "../components/MainNav";
import { GlobalStyles } from "../styles/GlobalStyles";

const inter = Source_Sans_Pro({
  weight: ["200", "400", "700"],
  subsets: ["latin"],
});
export default function App({ Component, pageProps, router }: AppProps) {
  const isNotLandingPage = router.route !== "/";
  return (
    <Main className={inter.className} applyPadding={isNotLandingPage}>
      <Head>
        <title>Lukas Taido</title>
        <meta
          name="description"
          content="Music / Audiovisual Concept Art / Immersive Audio"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyles />
      {isNotLandingPage && <MainNav id="nav" />}
      <Component {...pageProps} />
    </Main>
  );
}

const Main = styled.main<{ applyPadding: boolean }>`
  min-height: 100vh;
  width: 100%;
  background-color: #2f3334;
  display: flex;
  flex-direction: column;
  > :not(#nav) {
    flex: 1;
  }
`;
