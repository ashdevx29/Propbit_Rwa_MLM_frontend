import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import S1Hero from "../Components/S1Hero.jsx"
import S2HowWorks from "../Components/S2HowWorks.jsx";
// import S3WhyChoose from "../Components/S3WhyChoose.jsx";
import S4About from "../Components/S4About.jsx";
import S5Portfolio from "../Components/S5Portfolio.jsx";
import S6HowMoney from "../Components/S6HowMoney.jsx";
import S7RegulationSection from "../Components/S7RegulationSection.jsx";
import S1Secondsection from "../Components/S1Secondsection.jsx";
import Header from "../Directives/Header.jsx"
import Footer from "../Directives/Footer.jsx"
import "../Styles/IndexGgl.css";
import TopStats from "../Components/TopStats.jsx"
import Calculator from "../Components/Calculator.jsx"
import Downloadapp from "../Components/Downloadapp.jsx"
// import Login from "../Login/Login.jsx"
// Directive Components



function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const { search } = location;
    const params = new URLSearchParams(search);
    const scrollToId = params.get("section");

    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        // Adding a slight timeout ensures the DOM is fully rendered before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
    <TopStats/>
    <Header/>
      <section id="home">
        <S1Hero />
      </section>
 <section id="secondsection">
        <S1Secondsection />
      </section>
      <section id="how-works">
        <S2HowWorks />
      </section>
      


     <section id="about-us">
        <S4About />
      </section>

        <section id="portfolio">
        <S5Portfolio />
      </section>


<Calculator/>
      
         <section id="regulation-section">
        <S7RegulationSection />
      </section>
         <section id="howtomakemoney">
        <S6HowMoney />
      </section>
      <Downloadapp/> 
<Footer/>
    </>
  );
}

export default HomePage;
