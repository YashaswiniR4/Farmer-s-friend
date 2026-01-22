import { Microscope, Droplets, TrendingUp, FileText, Camera, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Microscope,
    title: "Crop Disease Detection",
    description: "Upload crop images for instant AI analysis. Get accurate disease identification with confidence scores and treatment recommendations.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Droplets,
    title: "Soil Quality Analysis",
    description: "Input soil test data and receive comprehensive fertility assessments with personalized fertilizer recommendations.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "Yield Prediction",
    description: "AI-powered yield forecasting based on crop type, soil conditions, weather patterns, and farming practices.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: FileText,
    title: "Farm Record Keeping",
    description: "Maintain detailed, tamper-proof records of all farm activities, scans, and reports for complete accountability.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Camera,
    title: "AI Image Scanning",
    description: "Advanced CNN models analyze crop images in real-time to detect diseases, pests, and nutrient deficiencies.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Users,
    title: "Expert Consultation",
    description: "Connect with field officers and agricultural experts for personalized guidance and support.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="heading-section text-foreground mb-4">
            Comprehensive Agricultural Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From disease detection to yield prediction, we provide farmers with the tools and insights they need to thrive.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="card-elevated group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 md:p-8">
                <div className={`w-14 h-14 rounded-xl ${service.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <h3 className="font-serif font-bold text-xl text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
