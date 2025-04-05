import { useState } from "react";
import { Phone, Mail, Globe, MapPin, Clock, Check, Loader2, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MapComponent = () => {
  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
      {/* This would be replaced with an actual map integration in production */}
      <div className="absolute inset-0 bg-teal-50">
        <div className="w-full h-full grid place-items-center">
          <div className="text-center">
            <Navigation className="h-12 w-12 mx-auto mb-2 text-teal-500" />
            <p className="text-teal-700 font-medium">Interactive Map</p>
            <p className="text-gray-500 text-sm">Location: Colombo 03, Sri Lanka</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-teal-200 text-teal-600 hover:bg-teal-50"
              onClick={() => window.open("https://maps.google.com/?q=Colombo+03+Sri+Lanka", "_blank")}
            >
              Open in Google Maps
            </Button>
          </div>
        </div>
        
        {/* Map decoration elements */}
        <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-teal-300 opacity-50"></div>
        <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-teal-300 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-teal-100 to-transparent"></div>
        
        {/* Simulated map markers and elements */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-teal-500 rounded-full animate-ping"></div>
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-teal-600 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-400 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
        
        {/* Simulated roads */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-teal-200"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-teal-200"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-teal-200"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-teal-200"></div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormState((prev) => ({ ...prev, inquiryType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent Successfully",
      description: "Thank you for reaching out. Our team will contact you within 24-48 hours.",
      icon: <Check className="h-4 w-4" />
    });
    
    // Reset form
    setFormState({
      name: "",
      email: "",
      inquiryType: "",
      message: "",
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
              Get in Touch
            </span>{" "}
            with Our Team
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions about chemical risk assessment? Need technical support or 
            partnership inquiries? Our dedicated team is ready to assist you.
          </p>
        </header>

        <Tabs defaultValue="contact" className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg bg-white/90 backdrop-blur-sm p-8 border-teal-100">
                <h2 className="text-2xl font-semibold mb-6 text-teal-700">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                    <div className="text-gray-700">
                      <p className="font-medium">Phone</p>
                      <p>Tel: +94 11 2 437149</p>
                      <p>Fax: +94 11 2 437149</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <a href="mailto:info@nacwc.gov.lk" className="text-teal-600 hover:text-teal-700 hover:underline">
                        info@nacwc.gov.lk
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Address</p>
                      <address className="not-italic text-gray-600">
                        National Authority for the Implementation of Chemical Weapons Convention,<br />
                        "Lakshman Building" 6th Floor,<br />
                        No. 321, Galle Road,<br />
                        Colombo 03, Sri Lanka.
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Globe className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Website</p>
                      <a href="https://nacwc.gov.lk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 hover:underline">
                        www.nacwc.gov.lk
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Office Hours</p>
                      <p className="text-gray-600">Monday - Friday: 8:30 AM - 4:30 PM</p>
                      <p className="text-gray-600">Closed on Public Holidays</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-teal-100">
                  <h3 className="text-lg font-medium text-teal-700 mb-4">Find Us On Map</h3>
                  <MapComponent />
                </div>
              </Card>

              <Card className="shadow-lg bg-white/90 backdrop-blur-sm p-8 border-teal-100">
                <h2 className="text-2xl font-semibold mb-6 text-teal-700">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Enter your full name" 
                      className="border-teal-200 focus:border-teal-500"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="Enter your email address" 
                      className="border-teal-200 focus:border-teal-500"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select 
                      value={formState.inquiryType} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger id="inquiryType" className="border-teal-200 focus:border-teal-500">
                        <SelectValue placeholder="Select your inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="consultation">Chemical Assessment Consultation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Please describe your inquiry in detail..." 
                      className="min-h-[150px] border-teal-200 focus:border-teal-500"
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    We typically respond within 24-48 business hours
                  </p>
                </form>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card className="shadow-lg bg-white/90 backdrop-blur-sm p-8 border-teal-100">
              <h2 className="text-2xl font-semibold mb-6 text-teal-700">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "What services does the National Authority for the Implementation of Chemical Weapons Convention provide?",
                    answer: "We provide regulatory oversight, technical guidance, chemical risk assessment, training programs, and international cooperation services related to the implementation of the Chemical Weapons Convention in Sri Lanka."
                  },
                  {
                    question: "How can I request a chemical risk assessment?",
                    answer: "You can request a chemical risk assessment by contacting us through this form, selecting 'Chemical Assessment Consultation' as your inquiry type, or by directly emailing us at info@nacwc.gov.lk with your requirements."
                  },
                  {
                    question: "What are the response times for inquiries?",
                    answer: "We typically respond to all inquiries within 24-48 business hours. Technical consultations may require additional time for our experts to provide comprehensive answers."
                  },
                  {
                    question: "Does the Authority provide training programs?",
                    answer: "Yes, we conduct regular training programs on chemical safety, risk assessment, and regulatory compliance. Contact us for upcoming training schedules or to arrange customized training for your organization."
                  },
                  {
                    question: "How can organizations partner with NACWC?",
                    answer: "We welcome partnerships with academic institutions, industry associations, and international organizations. Please select 'Partnership Opportunity' in your inquiry to discuss potential collaboration areas."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-teal-100 pb-4 last:border-0">
                    <h3 className="font-medium text-teal-700 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Contact;
