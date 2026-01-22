import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 md:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-harvest/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div className="relative text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 mb-6">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Join the Agricultural Revolution</span>
            </div>

            <h2 className="heading-section text-white mb-6">
              Ready to Transform Your Farming Journey?
            </h2>

            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Join thousands of farmers who trust Krushi Mitra for AI-powered crop analysis, 
              soil insights, and expert guidance. Start your journey toward smarter, 
              more productive farming today.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button variant="gold" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-light" size="xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
