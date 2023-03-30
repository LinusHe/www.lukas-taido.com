import styled from "styled-components";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href={"/portfolio"}>
        <Wrapper>
          <h1>
            lukas taido - music_audiovisual concept art_soundsculptures_audio
            installations
          </h1>
          <div>click anywhere to enter</div>
        </Wrapper>
      </Link>
    </>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  h1 {
    color: #d0ebdc;
    font-size: 2em;
    line-height: 1.5em;
    font-weight: 200;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  }
`;
