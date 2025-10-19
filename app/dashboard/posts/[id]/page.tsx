"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PostForm } from '@/components/post-form'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { toast } from 'sonner'

type Post = Database['public']['Tables']['posts']['Row']

export default function EditPostPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  async function fetchPost() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        toast.error('Post not found')
        return
      }

      setPost(data)
    } catch (err) {
      toast.error('Failed to load post')
      console.error('Error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Edit Post</h1>
            <p className="text-muted-foreground">Update your blog post</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : post ? (
            <PostForm post={post} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Post not found</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
