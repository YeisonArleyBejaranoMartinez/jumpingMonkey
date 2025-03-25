import React, { useEffect, useRef } from "react";
import { inicializarJuego } from "./juegoPhaser";
import "./css/JumpingMokey.css";

const JumpingMonkey = () => {
  const gameContainer = useRef(null);
  useEffect(() => {
    const game = inicializarJuego(gameContainer.current);
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div className="gameContainer" ref={gameContainer}></div>;
};

export default JumpingMonkey;
