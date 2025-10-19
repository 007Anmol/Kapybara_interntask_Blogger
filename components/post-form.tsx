"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { toast } from 'sonner'

type Post = Database['public']['Tables']['posts']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface PostFormProps {
  post?: Post
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    body: post?.body || '',
    excerpt: post?.excerpt || '',
    author_name: post?.author_name || '',
    status: post?.status || 'draft' as 'draft' | 'published',
  })

  useEffect(() => {
    fetchCategories()
    if (post) {
      fetchPostCategories()
    }
  }, [post])

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

  async function fetchPostCategories() {
    if (!post) return

    try {
      const { data, error } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', post.id)

      if (error) throw error
      setSelectedCategories(data?.map(pc => pc.category_id) || [])
    } catch (err) {
      console.error('Error fetching post categories:', err)
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function calculateReadingTime(text: string) {
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  function handleTitleChange(title: string) {
    setFormData(prev => ({
      ...prev,
      title,
      slug: post ? prev.slug : generateSlug(title)
    }))
  }

  function toggleCategory(categoryId: string) {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.title || !formData.slug || !formData.body) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!formData.author_name) {
      toast.error('Please enter an author name')
      return
    }

    try {
      setLoading(true)

      const words = formData.body.trim().split(/\s+/).length
      const readingTime = calculateReadingTime(formData.body)

      const postData = {
        ...formData,
        word_count: words,
        reading_time: readingTime,
        published_at: formData.status === 'published'
          ? (post?.published_at || new Date().toISOString())
          : null,
        updated_at: new Date().toISOString(),
      }

      let postId: string

      if (post) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id)

        if (error) throw error
        postId = post.id

        await supabase
          .from('post_categories')
          .delete()
          .eq('post_id', postId)
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert(postData)
          .select()
          .single()

        if (error) throw error
        postId = data.id
      }

      if (selectedCategories.length > 0) {
        const categoryInserts = selectedCategories.map(categoryId => ({
          post_id: postId,
          category_id: categoryId,
        }))

        const { error: categoryError } = await supabase
          .from('post_categories')
          .insert(categoryInserts)

        if (categoryError) throw categoryError
      }

      toast.success(post ? 'Post updated successfully' : 'Post created successfully')
      router.push('/dashboard')
    } catch (err) {
      toast.error(post ? 'Failed to update post' : 'Failed to create post')
      console.error('Error saving post:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-url-slug"
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">
                Author Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">
              Excerpt <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of the post"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">
              Body <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Write your post content in markdown..."
              rows={16}
              className="font-mono"
              required
            />
            <p className="text-sm text-muted-foreground">
              {formData.body.trim().split(/\s+/).filter(Boolean).length} words • {calculateReadingTime(formData.body)} min read
            </p>
          </div>

          {categories.length > 0 && (
            <div className="space-y-3">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{formData.title || 'Untitled Post'}</CardTitle>
              <div className="text-sm text-muted-foreground">
                By {formData.author_name || 'Anonymous'} • {calculateReadingTime(formData.body)} min read
              </div>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none">
              {formData.excerpt && (
                <p className="text-lg text-muted-foreground italic">
                  {formData.excerpt}
                </p>
              )}
              <div className="whitespace-pre-wrap">
                {formData.body || 'No content yet...'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
