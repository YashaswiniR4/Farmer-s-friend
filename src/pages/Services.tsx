import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Camera, 
  Droplets, 
  TrendingUp, 
  FileText, 
  Leaf, 
  CloudSun, 
  Bug, 
  Sprout,
  ArrowRight,
  Check
} from "lucide-react";

const Services = () => {
  const mainServices = [
    {
      icon: Camera,
      title: "AI Crop Disease Detection",
      description: "Upload a photo of your crop and get instant disease identification with treatment recommendations.",
      features: ["95% accuracy rate", "40+ diseases detected", "Instant results", "Treatment suggestions"],
      color: "bg-red-100 text-red-600",
      link: "/dashboard/scan"
    },
    {
      icon: Droplets,
      title: "Soil Health Analysis",
      description: "Enter your soil parameters to get comprehensive fertility analysis and fertilizer recommendations.",
      features: ["NPK analysis", "pH assessment", "Fertilizer plans", "Crop suitability"],
      color: "bg-blue-100 text-blue-600",
      link: "/dashboard/soil"
    },
    {
      icon: TrendingUp,
      title: "Yield Prediction",
      description: "AI-powered yield forecasting based on your crop, soil, and environmental conditions.",
      features: ["Accurate forecasts", "Risk assessment", "Market timing", "Historical trends"],
      color: "bg-green-100 text-green-600",
      link: "/dashboard/yield"
    },
  ];

  const additionalServices = [
    {
      icon: CloudSun,
      title: "Weather Integration",
      description: "Real-time weather updates and forecasts tailored for your farm location."
    },
    {
      icon: Bug,
      title: "Pest Alerts",
      description: "Get notified about pest outbreaks in your region before they affect your crops."
    },
    {
      icon: FileText,
      title: "Official Reports",
      description: "Generate government-ready reports for loans, insurance, and subsidies."
    },
    {
      icon: Leaf,
      title: "Crop Calendar",
      description: "Personalized sowing and harvesting schedules based on your crops and location."
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sprout className="w-4 h-4" />
                <span className="text-sm font-medium">Our Services</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                Complete AI Solutions for Modern Farming
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                From disease detection to yield prediction, Krushi Mitra provides all the tools you need to maximize your harvest and minimize losses.
              </p>
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
                Core AI Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powered by advanced machine learning trained on millions of agricultural data points.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {mainServices.map((service, index) => (
                <Card key={index} className="card-elevated hover:shadow-elevated transition-shadow">
                  <CardHeader>
                    <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                      <service.icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="font-serif text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={service.link}>
                      <Button variant="outline" className="w-full gap-2">
                        Try Now
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
                Additional Features
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything else you need for successful farming.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((service, index) => (
                <Card key={index} className="card-elevated text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-12 lg:py-16 text-center">
                <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
                  Ready to Transform Your Farm?
                </h2>
                <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of farmers already using Krushi Mitra to improve their yields and protect their crops.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="gap-2">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
