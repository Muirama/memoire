import Intro from "../components/Intro";
import Carousel from "../components/Carousel";
import PreviewProducts from "../components/PreviewProducts";
import About from "../components/About";
import PlayersCountriesMap from "../components/PlayersCountriesMap";
import PoweredByOrange from "../components/PoweredByOrange";
import BronzeSponsorLoaline from "../components/BronzeSponsorLoaline";
import PreviewNews from "../components/PreviewNews";
import SponsorsPartnersBanner from "../components/SponsorsPartnersBanner";

export default function HomePage() {
  return (
    <>
      <Intro />
      <PoweredByOrange />
      <PreviewNews />
      <About />
      <BronzeSponsorLoaline />
      <PlayersCountriesMap />
      <PreviewProducts />
      <SponsorsPartnersBanner />
      <Carousel />
    </>
  );
}
