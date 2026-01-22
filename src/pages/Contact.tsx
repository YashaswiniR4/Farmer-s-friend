import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock,
  Sprout
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 1800-XXX-XXXX", "Mon-Sat, 9 AM - 6 PM"],
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@krushimitra.com", "We reply within 24 hours"],
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["AgriTech Park, Sector 42", "Gurugram, Haryana 122001"],
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Monday - Saturday", "9:00 AM - 6:00 PM IST"],
      color: "bg-purple-100 text-purple-600"
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
                <span className="text-sm font-medium">Contact Us</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                We're Here to Help
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions about Krushi Mitra? Need help with your account? Our team is ready to assist you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="card-elevated text-center">
                  <CardContent className="pt-6 pb-4">
                    <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <info.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif font-bold text-foreground mb-2">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
              {/* Form */}
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-serif">Send us a Message</CardTitle>
                      <CardDescription>Fill out the form and we'll respond shortly</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input 
                          id="phone" 
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Preview */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Quick answers to common questions.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Card className="card-elevated">
                    <CardContent className="pt-4 pb-3">
                      <h4 className="font-medium text-foreground mb-1">Is Krushi Mitra free to use?</h4>
                      <p className="text-sm text-muted-foreground">Yes! Basic features are free. Premium features are available with our subscription plans.</p>
                    </CardContent>
                  </Card>
                  <Card className="card-elevated">
                    <CardContent className="pt-4 pb-3">
                      <h4 className="font-medium text-foreground mb-1">How accurate is the disease detection?</h4>
                      <p className="text-sm text-muted-foreground">Our AI achieves 95%+ accuracy, trained on millions of crop images.</p>
                    </CardContent>
                  </Card>
                  <Card className="card-elevated">
                    <CardContent className="pt-4 pb-3">
                      <h4 className="font-medium text-foreground mb-1">Which crops are supported?</h4>
                      <p className="text-sm text-muted-foreground">We support major crops including rice, wheat, cotton, maize, tomato, and many more.</p>
                    </CardContent>
                  </Card>
                  <Card className="card-elevated">
                    <CardContent className="pt-4 pb-3">
                      <h4 className="font-medium text-foreground mb-1">Can I use it offline?</h4>
                      <p className="text-sm text-muted-foreground">The app requires internet for AI analysis. We're working on offline capabilities.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
