import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '@/components/moviecard';
import { ListMoviesByGenreResponse, listMoviesByGenre } from '@movie/dataconnect';

export default function GenrePage() {
  const { genre } = useParams<{ genre: string }>();
  const [mostPopular, setMostPopular] = useState<ListMoviesByGenreResponse['mostPopular']>([]);
  const [mostRecent, setMostRecent] = useState<ListMoviesByGenreResponse['mostRecent']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await listMoviesByGenre({ genre });
        setMostPopular(response.data.mostPopular);
        setMostRecent(response.data.mostRecent);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [genre]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4 capitalize">{genre} Movies</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Most Popular</h2>
        <div className="flex overflow-x-auto space-x-4">
          {mostPopular.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              imageUrl={movie.imageUrl}
              rating={movie.rating}
              tags={movie.tags}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Most Recent</h2>
        <div className="flex overflow-x-auto space-x-4">
          {mostRecent.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              imageUrl={movie.imageUrl}
              rating={movie.rating}
              tags={movie.tags}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
