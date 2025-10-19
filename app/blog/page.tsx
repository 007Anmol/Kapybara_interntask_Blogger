"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { Calendar, Clock, User } from 'lucide-react'
import { format } from 'date-fns'

type Post = Database['public']['Tables']['posts']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface PostWithCategories extends Post {
  categories: Category[]
}

export default function BlogPage() {
  const [posts, setPosts] = useState<PostWithCategories[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
    fetchPosts()
  }, [selectedCategories])

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  async function fetchPosts() {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            category_id,
            categories (*)
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      const postsWithCategories: PostWithCategories[] = (data || []).map((post: any) => ({
        ...post,
        categories: post.post_categories?.map((pc: any) => pc.categories).filter(Boolean) || []
      }))

      let filteredPosts = postsWithCategories

      if (selectedCategories.length > 0) {
        filteredPosts = postsWithCategories.filter(post =>
          post.categories.some(cat => selectedCategories.includes(cat.id))
        )
      }

      setPosts(filteredPosts)
    } catch (err) {
      setError('Failed to load posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  function toggleCategory(categoryId: string) {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Discover stories, insights, and perspectives from our community
            </p>
          </div>

          {categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                Filter by Category
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2 text-sm"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {selectedCategories.length > 0
                  ? 'No posts found in selected categories'
                  : 'No posts published yet'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category) => (
                          <Badge key={category.id} variant="secondary" className="text-xs">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 text-base leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{post.author_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{post.reading_time} min read</span>
                        </div>
                      </div>
                      {post.published_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
