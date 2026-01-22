import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, Users, Target, Heart, Award, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Farmer First",
      description: "Every decision we make puts the welfare of farmers at the center."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We leverage cutting-edge AI to solve real agricultural challenges."
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Building technology that promotes eco-friendly farming practices."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering accurate, reliable, and actionable insights."
    }
  ];

  const team = [
    { name: "Dr. Rajesh Kumar", role: "Founder & CEO", image: "👨‍💼" },
    { name: "Priya Sharma", role: "Chief Technology Officer", image: "👩‍💻" },
    { name: "Amit Patel", role: "Head of AI Research", image: "👨‍🔬" },
    { name: "Sunita Devi", role: "Agricultural Expert", image: "👩‍🌾" },
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
                <span className="text-sm font-medium">About Krushi Mitra</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                Empowering Farmers with AI Technology
              </h1>
              <p className="text-lg text-muted-foreground">
                Krushi Mitra was born from a simple vision: to bridge the gap between traditional farming wisdom and modern technology, ensuring every farmer has access to expert-level agricultural insights.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2024, Krushi Mitra emerged from witnessing firsthand the challenges faced by Indian farmers. Crop diseases, unpredictable weather, and lack of timely information were causing devastating losses.
                  </p>
                  <p>
                    Our team of agricultural scientists, AI researchers, and passionate developers came together with a mission: democratize access to agricultural expertise through artificial intelligence.
                  </p>
                  <p>
                    Today, Krushi Mitra serves thousands of farmers across India, providing instant disease detection, soil analysis, and yield predictions—all from a simple smartphone.
                  </p>
                </div>
              </div>
              <div className="bg-primary/5 rounded-2xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-serif font-bold text-primary">10K+</p>
                    <p className="text-sm text-muted-foreground mt-1">Farmers Helped</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-serif font-bold text-primary">50K+</p>
                    <p className="text-sm text-muted-foreground mt-1">Scans Performed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-serif font-bold text-primary">95%</p>
                    <p className="text-sm text-muted-foreground mt-1">Accuracy Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-serif font-bold text-primary">15+</p>
                    <p className="text-sm text-muted-foreground mt-1">States Covered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
                Our Core Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at Krushi Mitra.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="card-elevated text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A passionate group of experts dedicated to transforming Indian agriculture.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="card-elevated text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="text-5xl mb-4">{member.image}</div>
                    <h3 className="font-serif font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
