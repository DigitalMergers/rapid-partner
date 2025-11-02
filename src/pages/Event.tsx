import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, Handshake, TrendingUp, Network, Award, Megaphone, UserCheck, BookOpen, Zap } from "lucide-react";
import { motion } from "framer-motion";
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
    </div>
  );
};

export default Event;
