import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-harvest rounded-xl flex items-center justify-center">
                <Sprout className="w-7 h-7 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold">Krushi Mitra</span>
                <span className="text-xs text-primary-foreground/70">AI Smart Farming</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Serving farmers with faith, science & integrity. Empowering agricultural communities through AI-powered insights and transparent stewardship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/80 hover:text-harvest transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                "Crop Disease Detection",
                "Soil Quality Analysis",
                "Yield Prediction",
                "Farm Record Keeping",
                "Expert Consultation",
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-primary-foreground/80">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-harvest" />
                <span className="text-sm text-primary-foreground/80">
                  Agricultural Innovation Center<br />
                  Rural Development Block, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-harvest" />
                <span className="text-sm text-primary-foreground/80">
                  +91 1800-XXX-XXXX
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-harvest" />
                <span className="text-sm text-primary-foreground/80">
                  support@krushimitra.in
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/70">
              © {new Date().getFullYear()} Krushi Mitra. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-primary-foreground/70 hover:text-harvest transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-primary-foreground/70 hover:text-harvest transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
