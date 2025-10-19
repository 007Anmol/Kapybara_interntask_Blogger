import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BookOpen, PenTool, Users, Sparkles, TrendingUp, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Share Your Stories with the{' '}
                  <span className="text-primary">World</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  A modern blogging platform designed for creators who want to share their ideas,
                  connect with readers, and build their online presence.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-base">
                  <Link href="/blog">Explore Blog</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything You Need to Blog
              </h2>
              <p className="text-lg text-muted-foreground">
                Powerful features to help you create, manage, and share your content
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon={<PenTool className="h-8 w-8" />}
                title="Markdown Editor"
                description="Write with ease using our intuitive markdown editor with real-time preview"
              />
              <FeatureCard
                icon={<BookOpen className="h-8 w-8" />}
                title="Category Organization"
                description="Organize your content with flexible categories and make it easy to discover"
              />
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="Multi-Author Support"
                description="Collaborate with multiple authors and build your content team"
              />
              <FeatureCard
                icon={<Sparkles className="h-8 w-8" />}
                title="Beautiful Design"
                description="Stunning card-based layouts that make your content shine"
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8" />}
                title="Reading Stats"
                description="Track reading time and word count for better content planning"
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Draft Management"
                description="Work on drafts privately and publish when you're ready"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Start Blogging?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our community of writers and share your unique perspective with readers around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/dashboard">Create Your First Post</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/blog">Read Latest Posts</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative p-6 bg-card border rounded-lg hover:shadow-lg transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative space-y-4">
        <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
