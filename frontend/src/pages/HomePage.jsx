import Intro from "../components/Intro";
import About from "../components/About";
import Carousel from "../components/Carousel";
import PreviewProducts from "../components/PreviewProducts";

export default function HomePage() {
  return (
    <>
      <Intro />
      <PreviewProducts />
      <About />
      <Carousel />
    </>
  );
}
