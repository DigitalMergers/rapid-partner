import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const Event = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Annual Tech Summit 2025
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join us for an unforgettable experience of innovation, networking, and growth
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="gap-2">
                Register Now
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-panel hover-lift">
              <CardHeader>
                <Calendar className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">March 15-17, 2025</p>
              </CardContent>
            </Card>

            <Card className="glass-panel hover-lift">
              <CardHeader>
                <Clock className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">9:00 AM - 6:00 PM</p>
              </CardContent>
            </Card>

            <Card className="glass-panel hover-lift">
              <CardHeader>
                <MapPin className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">San Francisco, CA</p>
              </CardContent>
            </Card>

            <Card className="glass-panel hover-lift">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">500+ Expected</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About the Event */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">About the Event</h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              The Annual Tech Summit brings together industry leaders, innovators, and technology enthusiasts 
              for three days of inspiring talks, hands-on workshops, and valuable networking opportunities.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you're a startup founder, developer, or enterprise leader, you'll find sessions tailored 
              to your interests and career stage. Connect with peers, learn from experts, and discover the 
              latest trends shaping the future of technology.
            </p>
          </div>
        </div>
      </section>

      {/* Speakers/Agenda Placeholder */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Speakers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-panel hover-lift">
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4" />
                  <CardTitle className="text-center">Speaker {i}</CardTitle>
                  <CardDescription className="text-center">Industry Expert</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Renowned expert in technology and innovation with 15+ years of experience.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Don't Miss Out!</h2>
          <p className="text-xl text-muted-foreground">
            Secure your spot at the most anticipated tech event of the year
          </p>
          <Button size="lg" className="gap-2">
            Register Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Event;
