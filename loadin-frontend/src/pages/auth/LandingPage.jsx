import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/hero/Hero";
import HowItWorks from "../../components/home/HowItWorks";
import RouteAnimation from "../../components/home/RouteAnimation";
import Footer from "../../components/home/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <RouteAnimation />
      <Footer/>
    </>
  );
}