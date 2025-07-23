import { Container } from "./Loader.styled";

const CatLoader: React.FC = () => {
  const catGifs = ["/cat-dancing.gif", "/catjam.gif", "besos-gif.gif", "huh-cat.gif"];

  const randomCatGif = catGifs[Math.floor(Math.random() * catGifs.length)];
  return (
    <Container>
      <img
        src={randomCatGif}
        alt="Loading cat"
        style={{
          width: 50,
        }}
      />
    </Container>
  );
};

export default CatLoader;
