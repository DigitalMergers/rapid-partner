import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, MapPin, Users, Target, Trophy, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CountdownTimer } from "@/components/CountdownTimer";

const AffiliateEventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    consented: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        // Fetch affiliate data
        const { data: affiliateData, error: affiliateError } = await supabase
          .from("affiliates")
          .select("*")
          .eq("slug", slug)
          .eq("status", "active")
          .maybeSingle();

        if (affiliateError) throw affiliateError;
        if (!affiliateData) {
          navigate("/404");
          return;
        }

        setAffiliate(affiliateData);

        // Track click
        await supabase.from("clicks").insert({
          affiliate_id: affiliateData.id,
          code: affiliateData.code,
          path: window.location.pathname,
          ua: navigator.userAgent,
        });

        // Fetch master event template
        const { data: templateData, error: templateError } = await supabase
          .from("landing_pages")
          .select("*")
          .eq("is_template", true)
          .eq("name", "Master Event Template")
          .maybeSingle();

        if (templateError) throw templateError;
        if (!templateData) {
          toast.error("Event template not found");
          navigate("/404");
          return;
        }

        const blocks = templateData.blocks as any;
        setEventData(blocks);
        document.title = `${blocks.hero?.title || "Event"} - ${affiliateData.first_name} ${affiliateData.last_name}`;
      } catch (error: any) {
        console.error("Error:", error);
        toast.error("Failed to load event page");
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consented) {
      toast.error("Please agree to be contacted");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        website: formData.website || null,
        consented: formData.consented,
        affiliate_id: affiliate.id,
        code: affiliate.code,
      });

      if (error) throw error;

      toast.success("Registration successful! We'll be in touch soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        website: "",
        consented: false,
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!eventData) return null;

  const hero = eventData.hero || {};
  const speakers = eventData.speakers || [];
  const venue = eventData.venue || {};
  const schedule = eventData.schedule || [];
  const benefits = eventData.benefits || [];
  const faqs = eventData.faqs || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Invited by {affiliate.first_name} {affiliate.last_name}
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            {hero.title}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {hero.subtitle}
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-foreground">November 6, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-foreground">10:15 AM - 4:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-foreground">{hero.location}</span>
            </div>
          </div>
          <div className="mb-8">
            <CountdownTimer />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg">
                Register Now
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register for the Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consented}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, consented: checked as boolean })
                    }
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground">
                    I agree to be contacted regarding this event and related opportunities *
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Complete Registration"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Benefits Section */}
      {benefits.length > 0 && (
        <section className="bg-muted/50 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Why Attend?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {benefits.map((benefit: any, index: number) => (
                <div key={index} className="text-center">
                  {benefit.icon === "users" && <Users className="mx-auto mb-4 h-12 w-12 text-primary" />}
                  {benefit.icon === "target" && <Target className="mx-auto mb-4 h-12 w-12 text-primary" />}
                  {benefit.icon === "trophy" && <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" />}
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schedule Section */}
      {schedule.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Event Agenda</h2>
            <div className="mx-auto max-w-3xl space-y-4">
              {schedule.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-4 rounded-lg border border-border bg-card p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{item.time}</div>
                    <div className="text-foreground">{item.activity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Speakers Section */}
      {speakers.length > 0 && (
        <section className="bg-muted/50 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Featured Speakers</h2>
            <Carousel className="mx-auto max-w-5xl">
              <CarouselContent>
                {speakers.map((speaker: any, index: number) => (
                  <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg">
                          <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
                            <img
                              src={speaker.photo}
                              alt={speaker.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <h3 className="mb-1 font-semibold text-foreground">{speaker.name}</h3>
                          <p className="mb-1 text-sm text-primary">{speaker.title}</p>
                          <p className="text-sm text-muted-foreground">{speaker.company}</p>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{speaker.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={speaker.photo}
                              alt={speaker.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-primary">{speaker.title}</p>
                            <p className="text-sm text-muted-foreground">{speaker.company}</p>
                          </div>
                          <p className="text-sm text-foreground">{speaker.bio}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      )}

      {/* Venue Section */}
      {venue.name && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Venue</h2>
            <div className="mx-auto max-w-4xl">
              {venue.images && venue.images.length > 0 && (
                <Carousel className="mb-8">
                  <CarouselContent>
                    {venue.images.map((image: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img src={image} alt={`Venue ${index + 1}`} className="h-full w-full object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
              <div className="text-center">
                <h3 className="mb-2 text-2xl font-semibold text-foreground">{venue.name}</h3>
                <p className="mb-6 text-muted-foreground">{venue.address}</p>
                {venue.amenities && venue.amenities.length > 0 && (
                  <div className="grid gap-2 text-left md:grid-cols-2">
                    {venue.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm text-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="bg-muted/50 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="mx-auto max-w-3xl">
              {faqs.map((faq: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-foreground">Ready to Join Us?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Secure your spot at this exclusive networking event. Registration is limited.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg">
                Register Now
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register for the Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName2">First Name *</Label>
                    <Input
                      id="firstName2"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName2">Last Name *</Label>
                    <Input
                      id="lastName2"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email2">Email *</Label>
                  <Input
                    id="email2"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone2">Phone</Label>
                  <Input
                    id="phone2"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company2">Company</Label>
                  <Input
                    id="company2"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website2">Website</Label>
                  <Input
                    id="website2"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent2"
                    checked={formData.consented}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, consented: checked as boolean })
                    }
                  />
                  <label htmlFor="consent2" className="text-sm text-muted-foreground">
                    I agree to be contacted regarding this event and related opportunities *
                  </label>
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

export default AffiliateEventPage;
