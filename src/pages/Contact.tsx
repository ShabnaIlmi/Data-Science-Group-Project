
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!"
    });
  };

  return <div className="hero-gradient min-h-screen py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Get in Touch</span> with Us
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions about chemical risk assessment? Need technical support or partnership inquiries? Reach out to our team, and we'll be happy to assist you.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="glass-card p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-500" />
                <div className="text-gray-600">
                  <p>Tel: +94 11 2 437149</p>
                  <p>Fax: +94 11 2 437149</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-500" />
                <a href="mailto:info@nacwc.gov.lk" className="text-gray-600 hover:text-teal-500">
                  info@nacwc.gov.lk
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-teal-500" />
                <span className="text-gray-600">
                  National Authority for the Implementation of Chemical Weapons Convention,<br />
                  "Lakshman Building" 6th Floor,<br />
                  No. 321, Galle Road,<br />
                  Colombo 03, Sri Lanka.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-teal-500" />
                <a href="https://nacwc.gov.lk" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-teal-500">
                  www.nacwc.gov.lk
                </a>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input placeholder="Your Name" required />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" required />
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Inquiry Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Textarea placeholder="Your Message" className="min-h-[150px]" required />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-teal-500">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>;
};

export default Contact;
