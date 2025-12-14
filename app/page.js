import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import HowItWorks from './components/HowItWorks';
import FeaturesGrid from './components/FeaturesGrid';
import VisualDemo from './components/VisualDemo';
import IncentiveSection from './components/IncentiveSection';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <FeaturesGrid />
      <VisualDemo />
      <IncentiveSection />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
