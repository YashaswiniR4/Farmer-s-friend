import { Target, Eye, Heart, CheckCircle2 } from "lucide-react";

const MissionSection = () => {
  const principles = [
    "Transparent and accountable record-keeping",
    "AI-powered insights backed by scientific research",
    "Accessible technology for all farmers",
    "Community-focused agricultural development",
    "Secure and tamper-proof data management",
    "Continuous support and expert guidance",
  ];

  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Purpose
            </span>
            <h2 className="heading-section text-foreground mb-6">
              Faith, Science & Integrity in Every Service
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Krushi Mitra is built on the foundation of serving farmers with unwavering commitment. 
              Like trusted stewards, we ensure every record is accurate, every recommendation is sound, 
              and every interaction builds trust.
            </p>

            {/* Principles List */}
            <ul className="space-y-3">
              {principles.map((principle) => (
                <li key={principle} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-harvest mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mission/Vision/Values Cards */}
          <div className="space-y-6">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "To empower every farmer with AI-powered tools and transparent services that enhance productivity, protect crops, and ensure sustainable agricultural practices.",
                color: "bg-primary",
              },
              {
                icon: Eye,
                title: "Our Vision",
                description: "A future where every farmer, regardless of farm size, has access to cutting-edge agricultural technology and expert guidance to achieve prosperity.",
                color: "bg-harvest",
              },
              {
                icon: Heart,
                title: "Our Values",
                description: "Integrity in every record, transparency in every transaction, and compassion in every interaction. We serve farmers with the dedication they deserve.",
                color: "bg-earth",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="flex gap-5 p-6 bg-card rounded-xl border border-border shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
