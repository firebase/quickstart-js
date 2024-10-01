import React, { useEffect, useState } from 'react';
import Carousel from '@/components/carousel';
import { handleGetTopMovies, handleGetLatestMovies } from '@/lib/MovieService';

export default function HomePage() {
  const [topMovies, setTopMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      const topMoviesData = await handleGetTopMovies(10);
      const latestMoviesData = await handleGetLatestMovies(10);

      if (topMoviesData) setTopMovies(topMoviesData);
      if (latestMoviesData) setLatestMovies(latestMoviesData);
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
