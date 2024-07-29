import React, { useEffect, useState } from 'react';
import Carousel from '@/components/carousel';
import { listMovies, ListMoviesResponse } from '@movie/dataconnect';

export default function HomePage() {
  const [topMovies, setTopMovies] = useState<ListMoviesResponse["movies"]>([]);
  const [latestMovies, setLatestMovies] = useState<ListMoviesResponse["movies"]>([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const topMoviesResponse = await listMovies({ orderByRating: "DESC", limit: 10 });
        const latestMoviesResponse = await listMovies({ orderByReleaseYear: "DESC", limit: 10 });

        setTopMovies(topMoviesResponse.data.movies);
        setLatestMovies(latestMoviesResponse.data.movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white shadow-md min-h-screen">
      <Carousel title="Top 10 Movies" movies={topMovies} />
      <Carousel title="Latest Movies" movies={latestMovies} />
    </div>
  );
}
