import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Doctors from '@/components/Doctors';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <About />
        <Doctors />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
