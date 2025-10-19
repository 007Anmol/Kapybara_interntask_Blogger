"use client"

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PostForm } from '@/components/post-form'

export default function NewPostPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Post</h1>
            <p className="text-muted-foreground">Write and publish your blog post</p>
          </div>

          <PostForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
