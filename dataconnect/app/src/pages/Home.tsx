import React from 'react';
import Carousel from '@/components/carousel';
import { listMoviesRef, OrderDirection } from '@/lib/dataconnect-sdk';
import { useDataConnectQuery } from '@tanstack-query-firebase/react/data-connect';

const ConditionalRender = ({ condition, preferred, alternate }: { condition: boolean, preferred: React.ReactNode, alternate: React.ReactNode }) => (
  condition ? preferred : alternate
)

const PlaceholderMessage = () => (
  <div className="min-h-screen flex items-center justify-center text-center text-4xl text-white">
    Run the Firebase Data Connect Extension to get started.
  </div>
)

export default function HomePage() {
  const { data: topMovies,  isLoading: loadingTopMovies } = useDataConnectQuery(listMoviesRef({ limit: 10, orderByRating: OrderDirection.DESC }));
  const { data: latestMovies, isLoading: loadingLatestMovies } = useDataConnectQuery(listMoviesRef({ limit: 10, orderByReleaseYear: OrderDirection.DESC }));
  const shouldRunEmulators = loadingLatestMovies || loadingTopMovies || topMovies?.movies.length === 0 && latestMovies?.movies.length === 0;
  
  const carousels = (
    <>
      <Carousel title="Top 10 Movies" movies={topMovies?.movies} />
      <Carousel title="Latest Movies" movies={latestMovies?.movies} />
    </>
  )

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white shadow-md min-h-screen">
      <ConditionalRender 
        condition={!shouldRunEmulators} 
        preferred={carousels} 
        alternate={<PlaceholderMessage />} />
    </div>
  );
}
