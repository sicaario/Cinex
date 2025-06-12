/*
  # Create movie ratings table

  1. New Tables
    - `movie_ratings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `movie_id` (integer, TMDB movie ID)
      - `rating` (integer, 1-5 stars)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `movie_ratings` table
    - Add policies for users to manage their own ratings
    - Add policies for public read access to aggregate ratings
*/

CREATE TABLE IF NOT EXISTS movie_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id integer NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicate ratings
CREATE UNIQUE INDEX IF NOT EXISTS movie_ratings_user_movie_idx ON movie_ratings(user_id, movie_id);

-- Create index for efficient movie rating queries
CREATE INDEX IF NOT EXISTS movie_ratings_movie_id_idx ON movie_ratings(movie_id);

-- Enable RLS
ALTER TABLE movie_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own ratings"
  ON movie_ratings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view movie ratings for aggregation"
  ON movie_ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own ratings"
  ON movie_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON movie_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON movie_ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);