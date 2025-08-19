import { Container } from "./Loader.styled";
import { useState, useEffect } from "react";

const CatLoader: React.FC = () => {
  const catGifs = [
    "/cat-dancing.gif",
    "/catjam.gif",
    "besos-gif.gif",
    "huh-cat.gif",
  ];

  const [randomCatGif, setRandomCatGif] = useState(
    catGifs[Math.floor(Math.random() * catGifs.length)]
  );
  const [width, setWidth] = useState(50);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    setRandomCatGif(catGifs[Math.floor(Math.random() * catGifs.length)]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setWidth((prevWidth) => Math.min(prevWidth + 20, 400));
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setWidth((prevWidth) => Math.max(prevWidth - 20, 50));
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <img
        src={randomCatGif}
        alt="Loading cat"
        style={{
          width: `${width}px`,
        }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
      />
      <span
        style={{
          fontSize: "16px",
          fontWeight: 500,
          color: "#d4d4d4",
          fontFamily: "sans-serif",
          animation: "fadeIn 1s ease-in-out infinite alternate",
        }}
      >
        Loading{dots}
      </span>
    </Container>
  );
};

export default CatLoader;
