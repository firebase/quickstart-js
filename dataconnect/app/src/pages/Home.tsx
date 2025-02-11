import React, { useEffect, useState } from 'react';
import Carousel from '@/components/carousel';
import { handleGetTopMovies, handleGetLatestMovies } from '@/lib/MovieService';

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
