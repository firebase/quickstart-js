import React, { useEffect, useState } from 'react';
import Carousel from '@/components/carousel';
import { handleGetTopMovies, handleGetLatestMovies } from '@/lib/MovieService';

const ConditionalRender = ({ condition, preferred, alternate }: { condition: boolean, preferred: React.ReactNode, alternate: React.ReactNode }) => (
  condition ? preferred : alternate
)

const PlaceholderMessage = () => (
  <div className="min-h-screen flex items-center justify-center text-center text-4xl text-white">
    Run the Firebase Data Connect Extension to get started.
  </div>
)

export default function HomePage() {
  const [topMovies, setTopMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [needsToRunEmulators, setNeedsToRunEmulators] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      const topMoviesData = await handleGetTopMovies(10);
      const latestMoviesData = await handleGetLatestMovies(10);

      // Or seed data
      const shouldRunEmulators = topMoviesData.length === 0 && latestMoviesData.length === 0;
      setNeedsToRunEmulators(shouldRunEmulators);

      if (topMoviesData) setTopMovies(topMoviesData);
      if (latestMoviesData) setLatestMovies(latestMoviesData);
    }

    fetchMovies();
  }, []);

  const carousels = (
    <>
      <Carousel title="Top 10 Movies" movies={topMovies} />
      <Carousel title="Latest Movies" movies={latestMovies} />
    </>
  )

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white shadow-md min-h-screen">
      <ConditionalRender 
        condition={!needsToRunEmulators} 
        preferred={carousels} 
        alternate={<PlaceholderMessage />} />
    </div>
  );
}
