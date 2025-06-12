/*
  # Create saved movies table

  1. New Tables
    - `saved_movies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `movie_id` (integer, TMDB movie ID)
      - `title` (text, movie title)
      - `overview` (text, movie overview)
      - `poster_path` (text, poster image path)
      - `backdrop_path` (text, backdrop image path)
      - `release_date` (text, release date)
      - `vote_average` (numeric, rating)
      - `vote_count` (integer, vote count)
      - `original_language` (text, language code)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `saved_movies` table
    - Add policy for users to manage their own saved movies
*/

CREATE TABLE IF NOT EXISTS saved_movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id integer NOT NULL,
  title text NOT NULL,
  overview text,
  poster_path text,
  backdrop_path text,
  release_date text,
  vote_average numeric DEFAULT 0,
  vote_count integer DEFAULT 0,
  original_language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicate saves
CREATE UNIQUE INDEX IF NOT EXISTS saved_movies_user_movie_idx ON saved_movies(user_id, movie_id);

-- Enable RLS
ALTER TABLE saved_movies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own saved movies"
  ON saved_movies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved movies"
  ON saved_movies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved movies"
  ON saved_movies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);