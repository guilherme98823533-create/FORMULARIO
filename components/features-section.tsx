import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, BarChart3, Users } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Automation",
    description:
      "Automate repetitive tasks and workflows with our intelligent automation engine. Save hours every day and focus on what matters most.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with end-to-end encryption, SSO integration, and compliance with SOC 2, GDPR, and HIPAA standards.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Get deep insights into your business operations with real-time dashboards, custom reports, and predictive analytics.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Seamless collaboration tools that keep your team aligned and productive, no matter where they work from.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Everything you need to <span className="text-accent">scale your business</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Powerful features designed to streamline your operations and accelerate growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border/40 hover:border-accent/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
