import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Star, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Share Skills,
            </span>
            <br />
            <span className="text-foreground">
              Build Community
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with talented individuals, exchange knowledge, and grow together 
            in our vibrant skill-sharing community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="gradient" size="lg" className="shadow-glow">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg">
              Browse Skills
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">1,200+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            
            <div className="text-center animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Skills Shared</div>
            </div>
            
            <div className="text-center animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
    </section>
  );
}