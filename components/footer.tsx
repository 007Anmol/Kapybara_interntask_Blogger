import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">BlogHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A modern blogging platform for content creators and readers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Blog
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Documentation</span>
              </li>
              <li>
                <span className="text-muted-foreground">API</span>
              </li>
              <li>
                <span className="text-muted-foreground">Support</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">About</span>
              </li>
              <li>
                <span className="text-muted-foreground">Privacy</span>
              </li>
              <li>
                <span className="text-muted-foreground">Terms</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} BlogHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
