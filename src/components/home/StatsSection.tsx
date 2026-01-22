import { Users, Scan, FileCheck, MapPin } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Farmers Served",
    description: "Active farmers using our platform",
  },
  {
    icon: Scan,
    value: "50,000+",
    label: "Crop Scans",
    description: "AI disease detections performed",
  },
  {
    icon: FileCheck,
    value: "25,000+",
    label: "Reports Generated",
    description: "Official farmer service reports",
  },
  {
    icon: MapPin,
    value: "500+",
    label: "Villages Covered",
    description: "Communities we've reached",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-harvest/20 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-harvest" />
              </div>
              <div className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-white/90 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-white/60">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
