/*
  # Create movie comments table

  1. New Tables
    - `movie_comments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `movie_id` (integer, TMDB movie ID)
      - `content` (text, comment content)
      - `user_name` (text, user display name)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `movie_comments` table
    - Add policies for users to manage their own comments
    - Add policies for public read access to comments
*/

CREATE TABLE IF NOT EXISTS movie_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id integer NOT NULL,
  content text NOT NULL,
  user_name text NOT NULL DEFAULT 'Anonymous',
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient movie comments queries
CREATE INDEX IF NOT EXISTS movie_comments_movie_id_idx ON movie_comments(movie_id);
CREATE INDEX IF NOT EXISTS movie_comments_created_at_idx ON movie_comments(created_at);

-- Enable RLS
ALTER TABLE movie_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view movie comments"
  ON movie_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own comments"
  ON movie_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON movie_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON movie_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);