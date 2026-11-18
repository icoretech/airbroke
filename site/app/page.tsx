import Agents from "@/components/Agents";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import How from "@/components/How";
import Nav from "@/components/Nav";
import Replay from "@/components/Replay";
import Screens from "@/components/Screens";
import SelfHost from "@/components/SelfHost";
import { Seam } from "@/components/Ticket";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main" className="roll">
        <Hero />
        <Seam from="coral" to="white" />
        <How />
        <Seam from="white" to="ink" />
        <Screens />
        <Seam from="ink" to="coral" />
        <Replay />
        <Seam from="coral" to="lilac" />
        <Agents />
        <Seam from="lilac" to="white" />
        <SelfHost />
        <Seam from="white" to="lilac" />
        <Faq />
        <Seam from="lilac" to="coral" />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
