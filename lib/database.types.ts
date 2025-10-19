export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          body: string
          excerpt: string
          status: 'draft' | 'published'
          author_name: string
          reading_time: number
          word_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          body: string
          excerpt: string
          status?: 'draft' | 'published'
          author_name?: string
          reading_time?: number
          word_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          body?: string
          excerpt?: string
          status?: 'draft' | 'published'
          author_name?: string
          reading_time?: number
          word_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      post_categories: {
        Row: {
          id: string
          post_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          category_id?: string
          created_at?: string
        }
      }
    }
  }
}
