import React from 'react';
import Carousel from '@/components/carousel';
import { listMoviesRef, OrderDirection } from '@/lib/dataconnect-sdk';
import { useDataConnectQuery } from '@tanstack-query-firebase/react/data-connect';

const ConditionalRender = ({ condition, preferred, alternate }: { condition: boolean, preferred: React.ReactNode, alternate: React.ReactNode }) => (
  condition ? preferred : alternate
)

const PlaceholderMessage = () => (
  <div className="min-h-screen flex items-center justify-center text-center text-white">
    <div className="px-4">
      <h1 className="text-4xl">To get Started with Firebase Data Connect:</h1>
      <ol className="list-decimal">
        {window.location.hostname != "localhost" && (
          <li>
            Add {window.location.host}
            <a
              target="_blank"
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              href="https://console.firebase.google.com/project/_/authentication/settings"
            >
              {" "}
              to your list of domains
            </a>
          </li>
        )}
        <li>Open app/src/lib/firebase.tsx and replace the firebaseConfig </li>
        <li>Open the Firebase Data Connect Extension</li>
        <li>Select your project</li>
        <li>Click "Start Emulators"</li>
        <li>Open dataconnect/moviedata_insert.gql</li>
        <li>Click Run (Local)</li>
      </ol>
    </div>
  </div>
);

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
