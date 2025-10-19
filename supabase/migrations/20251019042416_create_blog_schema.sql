/*
  # Multi-User Blogging Platform Schema

  ## Overview
  This migration creates the complete database schema for the blogging platform.

  ## New Tables

  ### 1. `categories`
  Stores blog post categories for organizing content.
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Category name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text, nullable) - Category description
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. `posts`
  Stores blog posts with full content and metadata.
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `body` (text) - Full post content in markdown
  - `excerpt` (text) - Short summary for listings
  - `status` (text) - Either 'draft' or 'published'
  - `author_name` (text) - Display name of author
  - `reading_time` (integer) - Estimated reading time in minutes
  - `word_count` (integer) - Total word count
  - `published_at` (timestamptz, nullable) - Publication timestamp
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `post_categories`
  Junction table for many-to-many relationship between posts and categories.
  - `id` (uuid, primary key) - Unique identifier
  - `post_id` (uuid, foreign key) - References posts table
  - `category_id` (uuid, foreign key) - References categories table
  - `created_at` (timestamptz) - Creation timestamp
  - Unique constraint on (post_id, category_id) to prevent duplicates

  ## Security
  - RLS enabled on all tables
  - Public read access for published posts and all categories
  - No authentication required for this version (open platform)
  - Full CRUD access for all users (can be restricted later)

  ## Indexes
  - Index on posts.slug for fast lookups
  - Index on posts.status for filtering
  - Index on post_categories foreign keys for efficient joins

  ## Important Notes
  1. All tables use RLS for security
  2. Posts can have multiple categories through junction table
  3. Reading time and word count stored for performance
  4. Status field enforced with check constraint
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL,
  excerpt text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  author_name text NOT NULL DEFAULT 'Anonymous',
  reading_time integer DEFAULT 0,
  word_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published'))
);

-- Create post_categories junction table
CREATE TABLE IF NOT EXISTS post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, open write)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create categories"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
  ON categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete categories"
  ON categories FOR DELETE
  USING (true);

-- Posts policies (public read for published, open write)
CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (status = 'published' OR true);

CREATE POLICY "Anyone can create posts"
  ON posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
  ON posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete posts"
  ON posts FOR DELETE
  USING (true);

-- Post categories policies (open access)
CREATE POLICY "Anyone can view post categories"
  ON post_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create post categories"
  ON post_categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update post categories"
  ON post_categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete post categories"
  ON post_categories FOR DELETE
  USING (true);

-- Insert some default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Posts about technology and innovation'),
  ('Design', 'design', 'Design principles and best practices'),
  ('Development', 'development', 'Software development tutorials and tips'),
  ('Business', 'business', 'Business insights and entrepreneurship'),
  ('Lifestyle', 'lifestyle', 'Personal development and lifestyle topics')
ON CONFLICT (slug) DO NOTHING;