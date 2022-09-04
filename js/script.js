import settings, { elements, messages } from "./settings.js";
import { createEl, getRandomInt } from "./utils.js";

(() => {
  const {
    BOARD,
    COLSHEAD,
    MESSAGEBOX,
    MESSAGEBTN,
    RESTARTBTN,
    ROWSHEAD,
    SHIPCOUNTER,
    SHOTCOUNTER,
  } = elements;
  const { COLS, ROWS, SHIPS, SHIPSWIDTH } = settings;
  const BOARDCELLS = COLS * ROWS;
  const SHIPCELLS = SHIPSWIDTH * SHIPS;
  let boardMatrix = [];

  const generateBoardMatrix = () => {
    boardMatrix = Array(ROWS)
      .fill(0)
      .map((row) => Array(COLS).fill(0));
  };

  const generateShips = () => {
    let shipType = 0;

    while (shipType !== SHIPS) {
      const col = getRandomInt(COLS - 1);
      const row = getRandomInt(ROWS - 1);

      if (boardMatrix[row][col] !== 0) continue;

      if (col <= COLS - SHIPSWIDTH && isFreeSpace(col, row, true)) {
        shipType++;
        setShipType(col, row, shipType, true);
      } else if (row <= ROWS - SHIPSWIDTH && isFreeSpace(col, row, false)) {
        shipType++;
        setShipType(col, row, shipType, false);
      }
    }
  };

  const isFreeSpace = (col, row, isHorizontal) => {
    return getSpace(col, row, isHorizontal).every((el) => el === 0);
  };

  const getSpace = (col, row, isHorizontal) => {
    let space = [];

    for (let s = 0; s < SHIPSWIDTH; s++) {
      const y = isHorizontal ? row : row + s;
      const x = isHorizontal ? col + s : col;
      space.push(boardMatrix[y][x]);
    }

    return space;
  };

  const setShipType = (col, row, shipType, isHorizontal) => {
    for (let s = 0; s < SHIPSWIDTH; s++) {
      const y = isHorizontal ? row : row + s;
      const x = isHorizontal ? col + s : col;
      boardMatrix[y][x] = shipType;
    }
  };

  const drawHeader = (wrap, count) => {
    for (let i = 0; i < count; i++) {
      const el = createEl("div");
      wrap.appendChild(el);
      el.innerHTML = i + 1;
    }
  };

  const drawBoard = () => {
    for (let row = 0; row < ROWS; row++) {
      const rowEl = createEl("div");
      rowEl.setAttribute("class", "row");

      for (let col = 0; col < COLS; col++) {
        const cell = createEl("div");
        cell.setAttribute("class", "cell");
        cell.dataset.col = col;
        cell.dataset.row = row;
        rowEl.appendChild(cell);
      }

      BOARD.appendChild(rowEl);
    }
  };

  const addMarker = (col, row) => {
    const currentEl = `div[data-col="${col}"][data-row="${row}"]`;
    const selectedEl = document.querySelector(currentEl);
    const shipType = boardMatrix[row][col];
    let selectedCells = 0;
    let selectedShipCells = 0;

    selectedEl.classList.add("selected");

    if (shipType === 0) {
      selectedCells = document.querySelectorAll(".selected").length;
      selectedShipCells = document.querySelectorAll("[data-shiptype]").length;

      if (BOARDCELLS - selectedCells !== SHIPCELLS - selectedShipCells) return;
      showGameOver("lost");
    }

    selectedEl.dataset.shiptype = shipType;
    boardMatrix[row][col] = 0;
    setResult(shipType);
  };

  const setResult = (shipType) => {
    const rowEl = boardMatrix.findIndex((rowEl) => rowEl.includes(shipType));
    if (rowEl !== -1) return;

    setSunken(shipType);
    SHIPCOUNTER.value = parseInt(SHIPCOUNTER.value) + 1;
    parseInt(SHIPCOUNTER.value) === SHIPS && showGameOver("won");
  };

  const setSunken = (shipType) => {
    const sunkenShip = document.querySelectorAll(
      `div[data-shiptype="${shipType}"]`
    );
    sunkenShip.forEach((el) => el.classList.add("sunken"));
  };

  const showGameOver = (status) => {
    setTimeout(() => {
      setMessage(status);
      showMessageBox(true);
    }, 100);
  };

  const setMessage = (status) => {
    const { sign, text, title } = messages[status];
    const modifiedText = text
      .replace("<$ships$>", SHIPCOUNTER.value)
      .replace("<$shots$>", SHOTCOUNTER.value);
    MESSAGEBOX.dataset.type = status;
    MESSAGEBOX.querySelector("b").innerHTML = sign;
    MESSAGEBOX.querySelector("h3").innerHTML = title;
    MESSAGEBOX.querySelector("p").innerHTML = modifiedText;
  };

  const showMessageBox = (beActive) => {
    beActive
      ? MESSAGEBOX.classList.add("active")
      : MESSAGEBOX.classList.remove("active");
  };

  const clickHandler = (e) => {
    const { classList, dataset } = e.target;

    if (classList.contains("cell") && !classList.contains("selected")) {
      const col = dataset.col;
      const row = dataset.row;

      SHOTCOUNTER.value = parseInt(SHOTCOUNTER.value) + 1;
      addMarker(col, row);
    }
  };

  const restartHandler = () => {
    BOARD.innerHTML = "";
    COLSHEAD.innerHTML = "";
    ROWSHEAD.innerHTML = "";
    SHIPCOUNTER.value = 0;
    SHOTCOUNTER.value = 0;
    showMessageBox(false);
    start();
  };

  const restartInit = () => {
    MESSAGEBTN.addEventListener("click", restartHandler);
    RESTARTBTN.addEventListener("click", restartHandler);
  };

  const init = () => {
    generateBoardMatrix();
    generateShips();
    drawHeader(COLSHEAD, COLS);
    drawHeader(ROWSHEAD, ROWS);
    drawBoard();
    restartInit();
  };

  const start = () => {
    const initPromise = new Promise((resolve, reject) => {
      init();
      resolve(true);
    });

    initPromise.then((resolved) => {
      BOARD.removeEventListener("click", clickHandler);
      resolved && BOARD.addEventListener("click", clickHandler);
    });
  };

  start();
})();
