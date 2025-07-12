import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SkillGrid } from '@/components/SkillGrid';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SkillGrid />
      <Footer />
    </div>
  );
};

export default Index;
