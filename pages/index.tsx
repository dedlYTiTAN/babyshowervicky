import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { config } from "../config/babyShowerConfig";
import NavBar              from "../components/NavBar";
import HeroSection         from "../components/HeroSection";
import DetailsSection      from "../components/DetailsSection";
import GenderRevealSection from "../components/GenderRevealSection";
import GamesSection        from "../components/GamesSection";
import CountersSection     from "../components/CountersSection";
import FooterSection       from "../components/FooterSection";

// Dynamically imported with ssr:false — video element must only render in browser
const IntroVideo = dynamic(() => import("../components/IntroVideo"), { ssr: false });

const Home: NextPage = () => {
  const { parents, event, taglines } = config;

  return (
    <>
      <Head>
        <title>{`Baby Shower — ${parents.partner1} & ${parents.partner2}`}</title>
        <meta
          name="description"
          content={`You're invited to celebrate the baby shower of ${parents.partner1} & ${parents.partner2} on ${event.date}. ${taglines.main}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Intro video plays first — dismissed on end or skip click */}
      <IntroVideo />

      <NavBar />

      <main>
        <HeroSection />
        <DetailsSection />
        <GenderRevealSection />
        <GamesSection />
        <CountersSection />
      </main>

      <FooterSection />
    </>
  );
};

export default Home;
