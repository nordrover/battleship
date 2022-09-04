import { getElById } from "./utils.js";

const settings = {
  COLS: 8,
  ROWS: 8,
  SHIPS: 5,
  SHIPSWIDTH: 4,
};

const elements = {
  BOARD: getElById("board"),
  COLSHEAD: getElById("cols-head"),
  MESSAGEBOX: getElById("message-box"),
  MESSAGEBTN: getElById("message-btn"),
  RESTARTBTN: getElById("restart-btn"),
  ROWSHEAD: getElById("rows-head"),
  SHIPCOUNTER: getElById("ship-counter"),
  SHOTCOUNTER: getElById("shot-counter"),
};

const messages = {
  lost: {
    sign: "!",
    title: "You lost",
    text: "You were able to sink <$ships$> ship(s).",
  },
  won: {
    sign: "&#10003;",
    title: "You won",
    text: "It took <$shots$> shots to sink each ship.",
  }
}

export default settings;
export { elements, messages };
