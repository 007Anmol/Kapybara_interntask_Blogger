"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { ArrowLeft, Calendar, Clock, User, BookOpen } from 'lucide-react'
import { format } from 'date-fns'

type Post = Database['public']['Tables']['posts']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface PostWithCategories extends Post {
  categories: Category[]
}

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<PostWithCategories | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  async function fetchPost() {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            category_id,
            categories (*)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()

      if (error) throw error

      if (!data) {
        setError('Post not found')
        return
      }

      const postData: any = data

      const postWithCategories: PostWithCategories = {
        id: postData.id,
        title: postData.title,
        slug: postData.slug,
        body: postData.body,
        excerpt: postData.excerpt,
        status: postData.status,
        author_name: postData.author_name,
        reading_time: postData.reading_time,
        word_count: postData.word_count,
        published_at: postData.published_at,
        created_at: postData.created_at,
        updated_at: postData.updated_at,
        categories: postData.post_categories?.map((pc: any) => pc.categories).filter(Boolean) || []
      }

      setPost(postWithCategories)
    } catch (err) {
      setError('Failed to load post')
      console.error('Error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {loading ? (
            <div className="space-y-8">
              <div>
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive text-lg mb-4">{error}</p>
              <Button asChild>
                <Link href="/blog">Return to Blog</Link>
              </Button>
            </div>
          ) : post ? (
            <article className="space-y-8">
              <header className="space-y-6">
                {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{post.author_name}</span>
                  </div>
                  {post.published_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{post.word_count.toLocaleString()} words</span>
                  </div>
                </div>

                <div className="h-px bg-border" />
              </header>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {post.body}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Posts
                  </Link>
                </Button>
              </div>
            </article>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}
