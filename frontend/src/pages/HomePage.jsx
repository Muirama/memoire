import Intro from "../components/Intro";
import Carousel from "../components/Carousel";
import PreviewProducts from "../components/PreviewProducts";
import About from "../components/About";

export default function HomePage() {
  return (
    <>
      <Intro />
      <About />
      <PreviewProducts />
      <Carousel />
    </>
  );
}
