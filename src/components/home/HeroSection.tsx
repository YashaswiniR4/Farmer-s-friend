import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Leaf, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Indian farmers in lush green fields"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-32 md:py-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-harvest/20 border border-harvest/30 text-harvest mb-6 animate-fade-in">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Agricultural Solutions</span>
          </div>

          {/* Heading */}
          <h1 className="heading-hero text-white mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Krushi Mitra
            <span className="block text-harvest">AI Smart Farming & Stewardship</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Serving farmers with <strong className="text-harvest">faith, science & integrity</strong>. 
            Get AI-powered crop disease detection, soil analysis, and yield predictions — 
            all with transparent, accountable record-keeping.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/register">
              <Button variant="gold" size="xl">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline-light" size="xl">
                Explore Services
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 md:gap-10 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: Shield, label: "Secure & Traceable" },
              { icon: Leaf, label: "AI Disease Detection" },
              { icon: BarChart3, label: "Yield Analytics" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-harvest" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
