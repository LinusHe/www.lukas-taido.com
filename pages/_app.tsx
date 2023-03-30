import type { AppProps } from "next/app";
import { Inter, Source_Sans_Pro } from "next/font/google";
import Head from "next/head";
import styled from "styled-components";
import MainNav from "../components/MainNav";
import { GlobalStyles } from "../styles/GlobalStyles";

const inter = Inter({
  subsets: ["latin"],
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Main className={inter.className}>
      <Head>
        <title>waveshaper</title>
        <meta name="description" content="Lukas Taido" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyles />
      <MainNav />
      <Component {...pageProps} />
    </Main>
  );
}

const Main = styled.main`
  min-height: 100vh;
  width: 100%;
  padding: 0 clamp(12px, 3.5vw, 40px) 20px;
`;
