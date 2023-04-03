import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
*{
  box-sizing:border-box;
}
html{
  background-color: black;
  font-family: 'Source Sans Pro', sans-serif;
  font-family: monospace;
  font-weight:200;
  scroll-behavior:smooth

}
  html, body, #__next{
    height:100%;
    margin:0;
  }
  h1,h2,h3,h4,h5,h6{
    margin:0;
    font-size:1em;
    font-weight:inherit;
  }
  a{
    color:inherit;
    text-decoration:none;
  }

`;
