import { Container } from "./Loader.styled";
import { useState, useEffect } from "react";

const CatLoader: React.FC = () => {
  const catGifs = ["/cat-dancing.gif", "/catjam.gif", "besos-gif.gif", "huh-cat.gif"];

  const [randomCatGif, setRandomCatGif] = useState(catGifs[Math.floor(Math.random() * catGifs.length)]);
  const [width, setWidth] = useState(50);

  useEffect(() => {
    setRandomCatGif(catGifs[Math.floor(Math.random() * catGifs.length)]);
  }, []);

  const handleClick = () => {
    setWidth((prevWidth) => Math.min(prevWidth + 20, 400));
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setWidth((prevWidth) => Math.max(prevWidth - 20, 50));
  };

  return (
    <Container>
      <img
        src={randomCatGif}
        alt="Loading cat"
        style={{
          width: `${width}px`,
        }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
      />
    </Container>
  );
};

export default CatLoader;