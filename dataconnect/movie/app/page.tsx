"use client";
import { useEffect, useState } from "react";
import Carousel from "../components/carousel";
import {
  moviesTop10,
  moviesRecentlyReleased,
  MoviesRecentlyReleasedResponse,
  MoviesTop10Response,
} from "../lib/dataconnect-sdk";

const Page = () => {
  const [topMovies, setTopMovies] = useState<MoviesTop10Response["movies"]>([]);
  const [latestMovies, setLatestMovies] = useState<
    MoviesRecentlyReleasedResponse["movies"]
  >([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const topMoviesResponse = await moviesTop10();
        const latestMoviesResponse = await moviesRecentlyReleased();

        setTopMovies(topMoviesResponse.data.movies);
        setLatestMovies(latestMoviesResponse.data.movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white shadow-md min-h-screen">
      <Carousel title="Top 10 Movies" movies={topMovies} />
      <Carousel title="Latest Movies" movies={latestMovies.slice(0, 10)} />
    </div>
  );
};

export default Page;
