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
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CountdownTimer } from "@/components/CountdownTimer";

const Event = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        website: formData.website,
        code: "event-registration",
        affiliate_id: "00000000-0000-0000-0000-000000000000",
        consented: true
      });

      if (error) throw error;

      toast.success("Registration successful! We'll be in touch soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        website: ""
      });
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                <motion.div className="relative flex items-center" initial={{
                  opacity: 0,
                  x: -20
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.5
                }}>
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
                <motion.div className="relative flex items-center md:justify-end" initial={{
                  opacity: 0,
                  x: 20
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.5,
                  delay: 0.1
                }}>
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
                <motion.div className="relative flex items-center" initial={{
                  opacity: 0,
                  x: -20
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.5,
                  delay: 0.2
                }}>
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-background shadow-lg"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                    <Card className="rounded-2xl bg-gradient-to-br from-indigo-600/5 to-transparent backdrop-blur border-indigo-600/20 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-indigo-400" />
                          <span className="font-semibold text-indigo-400">12:00 – 12:20 PM</span>
                        </div>
                        <h3 className="font-semibold mb-2">Rapid Fire Intros</h3>
                        <p className="text-muted-foreground text-sm">Quick introductions to get to know each other and discover opportunities.</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

                {/* 12:20 PM - 1:45 PM */}
                <motion.div className="relative flex items-center md:justify-end" initial={{
                  opacity: 0,
                  x: 20
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.5,
                  delay: 0.3
                }}>
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-cyan-600 rounded-full border-4 border-background shadow-lg"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                    <Card className="rounded-2xl bg-gradient-to-br from-cyan-600/5 to-transparent backdrop-blur border-cyan-600/20 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="font-semibold text-cyan-400">12:20 PM – 1:45 PM</span>
                        </div>
                        <h3 className="font-semibold mb-2">Open Networking</h3>
                        <p className="text-muted-foreground text-sm">Open networking and conversations. Connect with fellow attendees and build valuable relationships.</p>
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
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Venue Highlights</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A premium location designed for meaningful connections and professional networking
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-fuchsia-600/20 via-violet-600/20 to-indigo-600/20 blur-2xl rounded-3xl" />
              <Carousel className="relative rounded-3xl overflow-hidden" opts={{ loop: true }}>
                <CarouselContent>
                  <CarouselItem>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                      <img 
                        src={venueNetworkingEvent} 
                        alt="AI and M&A networking event in San Antonio with attendees"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                      <img 
                        src={venueConference} 
                        alt="Conference room with presentation setup and modern lighting"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </motion.div>

            {/* Amenities List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-600/10 to-violet-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-fuchsia-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Prime Location</h4>
                  <p className="text-sm text-muted-foreground">1602 Thousand Oaks Dr, San Antonio, TX 78232</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Car className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ample Parking</h4>
                  <p className="text-sm text-muted-foreground">Free parking available for all attendees</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-cyan-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Wifi className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">High-Speed WiFi</h4>
                  <p className="text-sm text-muted-foreground">Reliable connectivity throughout the venue</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600/10 to-fuchsia-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Armchair className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Tables and Chairs Included</h4>
                  <p className="text-sm text-muted-foreground">Comfortable seating arrangements provided</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Presentation className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">AV Equipment</h4>
                  <p className="text-sm text-muted-foreground">Professional presentation setup included</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-violet-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Coffee className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Coffee Bar</h4>
                  <p className="text-sm text-muted-foreground">Premium coffee and beverages available</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Speaker Lineup Section */}
      <section id="speakers" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">Speaker Lineup</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Meet the industry leaders and experts sharing insights at our upcoming event.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full" opts={{
              align: "start",
              loop: true
            }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {/* Justice Anderson - Featured Speaker */}
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="h-full"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="rounded-3xl bg-gradient-to-br from-fuchsia-600/5 via-violet-600/5 to-indigo-600/5 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md border border-fuchsia-600/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 h-full overflow-hidden">
                          <CardContent className="p-0 text-center h-full flex flex-col">
                            <div className="w-full h-64 bg-gradient-to-br from-fuchsia-600 to-violet-600 flex items-center justify-center shadow-lg overflow-hidden">
                              <img src={justiceAndersonPhoto} alt="Justice Anderson" className="w-full h-full object-cover object-center" />
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-semibold mb-2">Justice Anderson</h3>
                              <p className="text-sm text-fuchsia-400 font-medium mb-3">Founder of the Strategic Partner Network</p>
                              <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">Learn More →</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-center">Justice Anderson</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                          <div className="w-32 h-32 bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                            <img src={justiceAndersonPhoto} alt="Justice Anderson" className="w-full h-full object-cover object-center" />
                          </div>
                          <p className="text-sm text-fuchsia-400 font-medium">Founder of the Strategic Partner Network</p>
                          <p className="text-sm text-muted-foreground text-center">
                            Justice is an Investor in the M&A and Real Estate space that has completed 430+ Transactions. 
                            His main focus now is trying to help integrate AI solutions into as many businesses as he can to assist in the adoption of the overwhelming technology.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                </CarouselItem>

                {/* John Thornton - Featured Speaker */}
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.1 }} 
                    className="h-full"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="rounded-3xl bg-gradient-to-br from-fuchsia-600/5 via-violet-600/5 to-indigo-600/5 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md border border-violet-600/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 h-full overflow-hidden">
                          <CardContent className="p-0 text-center h-full flex flex-col">
                            <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-lg overflow-hidden">
                              <img src="/lovable-uploads/speaker-professional.png" alt="Featured Speaker" className="w-full h-full object-cover object-center" />
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-semibold mb-2">John Thornton</h3>
                              <p className="text-sm text-violet-400 font-medium mb-3">Business Developer of BookkeeperSA</p>
                              <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">Learn More →</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-center">John Thornton</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                          <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                            <img src="/lovable-uploads/speaker-professional.png" alt="Featured Speaker" className="w-full h-full object-cover object-center" />
                          </div>
                          <p className="text-sm text-violet-400 font-medium">Business Developer of BookkeeperSA</p>
                          <p className="text-sm text-muted-foreground text-center">
                            John Thornton has extensive experience in bookkeeping, payroll, tax preparation, and financial analysis—helping businesses stay organized and financially strong. As head of business development at BookkeeperSA, he creates strategies that simplify operations and drive growth for entrepreneurs.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                </CarouselItem>

                {/* TBD Speakers - Placeholder Cards */}
                {[1, 2, 3, 4].map(index => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                    >
                      <Card className="h-full rounded-3xl bg-gradient-to-br from-slate-800/50 via-slate-700/50 to-slate-600/50 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md border border-slate-600/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-0 text-center h-full flex flex-col">
                          <div className="w-full h-64 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg overflow-hidden">
                            <span className="text-6xl font-bold text-slate-300">?</span>
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold mb-2 text-slate-300">Speaker {index + 1}</h3>
                            <p className="text-sm text-slate-400 mb-3 font-medium">TBD</p>
                            <p className="text-sm text-slate-500 flex-grow">
                              More speakers to be announced soon. Stay tuned for exciting updates on industry experts joining our lineup.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Attend This Exclusive Mixer?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build valuable relationships with verified high-ticket professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">High-Ticket Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with professionals handling $100K+ deals in real estate development, commercial construction, and luxury residential projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Network className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Curated Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Meet vetted real estate agents, brokers, general contractors, developers, and construction executives actively seeking referral partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Handshake className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Strategic Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build long-term referral relationships that generate consistent, high-value opportunities for your business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/20 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzR6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTAtNGgydjJoLTJ6bTItMTZ2MmgtMnYtMnptLTIgMGgtMnYyaDJ6bS00IDBoLTJ2Mmgyem0tNCAwdi0yaC0ydjJ6bS00IDBoLTJ2Mmgyem0tNCAwaC0ydjJoMnptLTQgMGgtMnYyaDJ6bS00IDBoLTJ2Mmgyem0tMiAydi0yaC0ydjJ6bS0yIDBoLTJ2MmgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <h2 className="text-3xl sm:text-5xl font-bold">Ready to Grow Your Network?</h2>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Limited spots available - Reserve yours today
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                Register Now
                <Users className="w-5 h-5" />
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
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Common questions about registering for our investor network.</p>
          </div>

          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>What kind of events will you host?</AccordionTrigger>
              <AccordionContent>
                We plan to host investor mixers, sponsor showcases, and themed sessions like "AI Workshop." Register to be notified when dates and locations are announced.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Who should attend?</AccordionTrigger>
              <AccordionContent>
                Founders, investors, operators, and service sponsors looking for strategic partnerships and deal flow.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I become a sponsor?</AccordionTrigger>
              <AccordionContent>
                Visit the Sponsors section to see options and apply. You can also use the "Become a Sponsor" button.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is registration free?</AccordionTrigger>
              <AccordionContent>
                Yes, registration is completely free. You'll be the first to know about upcoming events and have early access to registration.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">When will events be announced?</AccordionTrigger>
              <AccordionContent>
                We're planning our first events for 2025. Registered members will receive early notification with dates, locations, and registration details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>How do I register?</AccordionTrigger>
              <AccordionContent>
                Simply click any "Register Now" button on this page to get started. We'll keep you updated on all upcoming events and opportunities.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* SEO Schema Markup for FAQPage */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "What is the format of the events?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Mixers/Sponsor showcases and themed sessions like 'AI Workshop.' Dates, times, and locations are TBD."
                }
              }, {
                "@type": "Question",
                "name": "Who should attend?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Founders, investors, operators, and service sponsors looking for strategic partnerships and deal flow."
                }
              }, {
                "@type": "Question",
                "name": "How do I become a sponsor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Visit the Sponsors section to see options and apply, or use the 'Become a Sponsor' button."
                }
              }, {
                "@type": "Question",
                "name": "Is there a refund policy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes—sponsor passes are refundable up to 1 week before the event. Member RSVP is free."
                }
              }, {
                "@type": "Question",
                "name": "How can I get notified about future events?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use the 'Get Notified' buttons in the Agenda section or join free at the top of this page."
                }
              }, {
                "@type": "Question",
                "name": "How do I get started?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Just talk to the team, sign the agreement, and secure your booth."
                }
              }]
            })
          }} />
        </div>
      </section>
    </div>
  );
};

export default Event;
