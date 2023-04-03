import { css } from "styled-components";
const padding = {
  s: "3vw",
  m: "6vw",
  l: "9vw",
};
export const contentPadding = (type: "s" | "m" | "l" = "m") => css`
  padding-left: ${padding[type || "m"]};
  padding-right: ${padding[type || "m"]};
  @media only screen and (min-width: 551px) {
    padding-left: calc(2vw + 16px);
    padding-right: calc(2vw + 16px);
  }
`;
