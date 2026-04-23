import Intro from "../components/Intro";
import Carousel from "../components/Carousel";
import PreviewProducts from "../components/PreviewProducts";
import About from "../components/About";
import PlayersCountriesCarousel from "../components/PlayersCountriesCarousel";
import PoweredByOrange from "../components/PoweredByOrange";

export default function HomePage() {
  return (
    <>
      <Intro />
      <PoweredByOrange />
      <About />
      <PlayersCountriesCarousel />
      <PreviewProducts />
      <Carousel />
    </>
  );
}
