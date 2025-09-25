import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechFlow",
    content:
      "StreamLine transformed our operations completely. We've reduced manual work by 80% and our team is more productive than ever.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Operations Director, GrowthCorp",
    content:
      "The automation features are incredible. What used to take us days now happens in minutes. Best investment we've made.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Founder, StartupLab",
    content:
      "As a growing startup, StreamLine gave us enterprise-level capabilities without the complexity. Highly recommended!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Trusted by <span className="text-accent">thousands of teams</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            See what our customers have to say about their experience with StreamLine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
