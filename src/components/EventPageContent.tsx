import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, Handshake, TrendingUp, Network, Award, Megaphone, UserCheck, BookOpen, Zap, Car, Wifi, Armchair, Presentation, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import venueNetworkingEvent from "@/assets/venue-networking.jpg";
import venueConference from "@/assets/venue-conference.jpg";
import justiceAndersonPhoto from "@/assets/justice-anderson.png";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useState } from "react";

interface EventPageContentProps {
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    website: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const EventPageContent = ({ onSubmit, isSubmitting }: EventPageContentProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      website: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="text-muted-foreground">High-Ticket</span>
                <br />
                <span className="text-foreground">Referral Partner</span>
                <br />
                <span className="text-primary">Network</span>
              </h1>
              
              <div className="flex items-start gap-3 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-lg sm:text-xl leading-relaxed">
                  Connect with elite professionals in Real Estate and Construction
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground pt-4">
                <p>November 6, 2025 • 10:15 AM - 1:45 PM</p>
                <p>1602 Thousand Oaks Dr, San Antonio, TX</p>
              </div>
            </div>

            {/* Right Side - Event Card */}
            <div className="relative">
              <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-primary via-primary/50 to-transparent">
                <div className="bg-card rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Exclusive Mixer Event</h3>
                      <p className="text-sm text-muted-foreground">In-Person Networking</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center">Event starts in</p>
                    <CountdownTimer />
                  </div>

                  <div className="space-y-3 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="w-full text-base">
                          Register Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Event Registration</DialogTitle>
                          <DialogDescription>
                            Fill out the form below to secure your spot at this exclusive networking event.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Cell Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company Name</Label>
                            <Input
                              id="company"
                              required
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website or Social Profile</Label>
                            <Input
                              id="website"
                              value={formData.website}
                              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Complete Registration"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="lg" className="w-full text-base">
                      Become a Sponsor
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground pt-2">
                    Free RSVP • Limited spots available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold">
              Are you<br />
              <span className="text-4xl sm:text-6xl">Sick of getting lost in the crowd?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're designing a network to recognize members' strengths and keep them connected long after the event.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-border bg-card/50 hover:bg-card transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="w-9 h-9 text-primary" />
                </div>
                <CardTitle className="text-xl">Sponsorship Events</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Host spotlight sessions to elevate your brand
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50 hover:bg-card transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-9 h-9 text-primary" />
                </div>
                <CardTitle className="text-xl">Strategic Matchmaking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Warm intros curated by goals and sector
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50 hover:bg-card transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-9 h-9 text-primary" />
                </div>
                <CardTitle className="text-xl">Business Directory</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Searchable member profiles and company database
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50 hover:bg-card transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-9 h-9 text-primary" />
                </div>
                <CardTitle className="text-xl">Rapid Fire Intros</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Dedicated calls to let our group know what you do, and who you're looking for
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Event Agenda Section */}
      <section id="agenda" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">Event Agenda</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-2">
              November 6th, 2025 • In-Person Mixer • 10:30 AM – 1:30 PM
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground italic">(Times are estimates and may vary)</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-fuchsia-600 via-violet-600 to-indigo-600"></div>
              
              <div className="space-y-8">
                {/* 10:15 - 10:40 AM */}
                <motion.div className="relative flex items-center" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-fuchsia-600 rounded-full border-4 border-background shadow-lg"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                    <Card className="rounded-2xl bg-gradient-to-br from-fuchsia-600/5 to-transparent backdrop-blur border-fuchsia-600/20 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-fuchsia-400" />
                          <span className="font-semibold text-fuchsia-400">10:15 – 10:40 AM</span>
                        </div>
                        <h3 className="font-semibold mb-2">Early Arrival & Check-in</h3>
                        <p className="text-muted-foreground text-sm">Arrive early, check in, and get your name tag. Light mingling and coffee.</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* 10:45 - 12:00 PM */}
                <motion.div className="relative flex items-center md:justify-end" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-violet-600 rounded-full border-4 border-background shadow-lg"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                    <Card className="rounded-2xl bg-gradient-to-br from-violet-600/5 to-transparent backdrop-blur border-violet-600/20 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-violet-400" />
                          <span className="font-semibold text-violet-400">10:45 – 12:00 PM</span>
                        </div>
                        <h3 className="font-semibold mb-2">Welcome & AI Insights</h3>
                        <p className="text-muted-foreground text-sm">Brief talk: welcome, quick sponsor intros, and where AI is heading + Sponsors on Business growth and Investing</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* 12:00 - 12:20 PM */}
                <motion.div className="relative flex items-center" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-background shadow-lg"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                    <Card className="rounded-2xl bg-gradient-to-br from-indigo-600/5 to-transparent backdrop-blur border-indigo-600/20 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-indigo-400" />
                          <span className="font-semibold text-indigo-400">12:00 – 12:20 PM</span>
                        </div>
                        <h3 className="font-semibold mb-2">Rapid Fire Intros</h3>
                        <p className="text-muted-foreground text-sm">Quick 60-second pitches so everyone knows who you are and what you're looking for.</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* 12:20 - 1:30 PM */}
                <motion.div className="relative flex items-center md:justify-end" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-background shadow-lg"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                    <Card className="rounded-2xl bg-gradient-to-br from-blue-600/5 to-transparent backdrop-blur border-blue-600/20 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="font-semibold text-blue-400">12:20 – 1:30 PM</span>
                        </div>
                        <h3 className="font-semibold mb-2">Open Networking & Lunch</h3>
                        <p className="text-muted-foreground text-sm">Enjoy lunch, exchange contacts, and build relationships in a relaxed setting.</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* 1:30 - 1:45 PM */}
                <motion.div className="relative flex items-center" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-cyan-600 rounded-full border-4 border-background shadow-lg"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                    <Card className="rounded-2xl bg-gradient-to-br from-cyan-600/5 to-transparent backdrop-blur border-cyan-600/20 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="font-semibold text-cyan-400">1:30 – 1:45 PM</span>
                        </div>
                        <h3 className="font-semibold mb-2">Closing & Next Steps</h3>
                        <p className="text-muted-foreground text-sm">Wrap-up, thank sponsors, and preview upcoming network opportunities.</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Highlights Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">World-Class Venue</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Located in the heart of San Antonio, our venue offers the perfect blend of sophistication and comfort
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  <CarouselItem>
                    <img 
                      src={venueNetworkingEvent} 
                      alt="Networking space" 
                      className="rounded-lg w-full h-[400px] object-cover"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src={venueConference} 
                      alt="Conference area" 
                      className="rounded-lg w-full h-[400px] object-cover"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Prime Location</h3>
                  <p className="text-muted-foreground">
                    1602 Thousand Oaks Dr, San Antonio, TX 78232
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="text-sm">Free Parking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-primary" />
                  <span className="text-sm">High-Speed WiFi</span>
                </div>
                <div className="flex items-center gap-3">
                  <Armchair className="w-5 h-5 text-primary" />
                  <span className="text-sm">Comfortable Seating</span>
                </div>
                <div className="flex items-center gap-3">
                  <Presentation className="w-5 h-5 text-primary" />
                  <span className="text-sm">AV Equipment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-primary" />
                  <span className="text-sm">Catering</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm">Networking Areas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speaker Lineup Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Speakers</h2>
            <p className="text-lg text-muted-foreground">
              Learn from industry leaders and innovators
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                      <img 
                        src={justiceAndersonPhoto} 
                        alt="Justice Anderson" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">Justice Anderson</h3>
                    <p className="text-sm text-primary mb-2">Co-Founder & CEO</p>
                    <p className="text-sm text-muted-foreground">Building Agent AI</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Justice Anderson</DialogTitle>
                  <DialogDescription className="text-base">
                    Co-Founder & CEO at Building Agent AI
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-full overflow-hidden border-4 border-primary/20">
                      <img 
                        src={justiceAndersonPhoto} 
                        alt="Justice Anderson" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">About</h4>
                      <p className="text-sm text-muted-foreground">
                        Justice Anderson is revolutionizing the construction industry through AI-powered solutions. 
                        With over 15 years of experience in technology and construction, he's leading Building Agent AI 
                        to transform how construction projects are managed and executed.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Talk: "AI in Construction - The Future is Now"</h4>
                    <p className="text-sm text-muted-foreground">
                      Discover how artificial intelligence is reshaping the construction landscape, from project planning 
                      to execution. Justice will share real-world examples and actionable insights on leveraging AI to 
                      increase efficiency, reduce costs, and improve project outcomes.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Card className="border-dashed bg-muted/30">
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-xl mb-2">More Speakers</h3>
                <p className="text-sm text-muted-foreground">
                  Additional speakers to be announced soon
                </p>
              </CardContent>
            </Card>

            <Card className="border-dashed bg-muted/30">
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Award className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Sponsor Speaker Slot</h3>
                <p className="text-sm text-muted-foreground">
                  Become a sponsor to secure your speaking opportunity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Join This Event?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Network className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">High-Value Connections</h3>
                    <p className="text-sm text-muted-foreground">
                      Meet decision-makers and industry leaders who can transform your business
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Growth Opportunities</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover partnership and collaboration opportunities that drive revenue
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Handshake className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Curated Networking</h3>
                    <p className="text-sm text-muted-foreground">
                      We pre-qualify attendees to ensure you're connecting with the right people
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-3xl"></div>
              <Card className="relative border-2">
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold">Limited Spots Available</h3>
                  <p className="text-muted-foreground">
                    To maintain quality networking, we're limiting attendance to 50 qualified professionals.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        Secure Your Spot Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Event Registration</DialogTitle>
                        <DialogDescription>
                          Fill out the form below to secure your spot at this exclusive networking event.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName2">First Name</Label>
                            <Input
                              id="firstName2"
                              required
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName2">Last Name</Label>
                            <Input
                              id="lastName2"
                              required
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email2">Email</Label>
                          <Input
                            id="email2"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone2">Cell Phone</Label>
                          <Input
                            id="phone2"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company2">Company Name</Label>
                          <Input
                            id="company2"
                            required
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website2">Website or Social Profile</Label>
                          <Input
                            id="website2"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? "Submitting..." : "Complete Registration"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about the event
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                What is the dress code for the event?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Business casual attire is recommended. The event maintains a professional yet comfortable atmosphere.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                Is lunch provided?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, a catered lunch will be provided for all attendees. Please let us know of any dietary restrictions during registration.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                Can I bring guests?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Each registration is for one attendee. If you'd like to bring colleagues, please have them register separately to ensure we maintain our curated networking environment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                What if I need to cancel my registration?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Please notify us at least 48 hours in advance if you need to cancel. This allows us to offer your spot to someone on the waitlist.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                How can I become a sponsor?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer several sponsorship tiers with different benefits including speaking opportunities, branded materials, and dedicated networking time. Contact us for our sponsorship package details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the dress code for the event?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Business casual attire is recommended. The event maintains a professional yet comfortable atmosphere."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is lunch provided?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, a catered lunch will be provided for all attendees. Please let us know of any dietary restrictions during registration."
                  }
                }
              ]
            })}
          </script>
        </div>
      </section>
    </div>
  );
};
