import { BookingSection } from "@/components/booking/BookingSection";
import { SiteNav } from "@/components/nav/SiteNav";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { RevealObserver } from "@/components/ui/RevealObserver";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="tartalom">
        <Hero />
        <Services />
        <About />
        <Approach />
        <BookingSection />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
