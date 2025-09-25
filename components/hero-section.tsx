import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent/10 text-accent border border-accent/20">
              ✨ Now available for teams
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-balance mb-6">
            The complete platform to <span className="text-accent">streamline</span> your business.
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            Your team's toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best
            business operations with StreamLine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-accent/10 bg-transparent">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">50+ hours</div>
              <div className="text-sm text-muted-foreground">saved per month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">uptime guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">300%</div>
              <div className="text-sm text-muted-foreground">productivity boost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">10k+</div>
              <div className="text-sm text-muted-foreground">happy customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
