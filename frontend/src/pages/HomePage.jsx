import Intro from "../components/Intro";
import Carousel from "../components/Carousel";
import PreviewProducts from "../components/PreviewProducts";
import About from "../components/About";
import PlayersCountriesCarousel from "../components/PlayersCountriesCarousel";
import PoweredByOrange from "../components/PoweredByOrange";
import BronzeSponsorLoaline from "../components/BronzeSponsorLoaline";

export default function HomePage() {
  return (
    <>
      <Intro />
      <PoweredByOrange />
      <BronzeSponsorLoaline />
      <About />
      <PlayersCountriesCarousel />
      <PreviewProducts />
      <Carousel />
    </>
  );
}
