import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { MdStar } from 'react-icons/md';
import { searchAll } from '@movie/dataconnect';

const genres = ['', 'action', 'crime', 'drama', 'sci-fi', 'thriller', 'adventure'];

export default function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [releaseYearRange, setReleaseYearRange] = useState({ min: 1900, max: 2030 });
  const [genre, setGenre] = useState('');
  const [ratingRange, setRatingRange] = useState({ min: 1, max: 10 });
  const [results, setResults] = useState({
    moviesMatchingTitle: [],
    moviesMatchingDescription: [],
    actors: [],
    reviews: [],
  });

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await searchAll({
        input: searchQuery,
        minYear: releaseYearRange.min,
        maxYear: releaseYearRange.max,
        minRating: ratingRange.min,
        maxRating: ratingRange.max,
        genre,
      });
      setResults({
        moviesMatchingTitle: response.data.moviesMatchingTitle,
        moviesMatchingDescription: response.data.moviesMatchingDescription,
        actors: response.data.actorsMatchingName,
        reviews: response.data.reviewsMatchingText,
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-4">Advanced Search</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex items-center mb-4">
          <label htmlFor="searchQuery" className="sr-only">Search</label>
          <input
            id="searchQuery"
            type="text"
            placeholder="Search for movies, actors, or reviews..."
            className="w-full p-4 rounded bg-gray-800 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 p-4 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <FaSearch />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="minYear" className="block mb-2">Release Year From</label>
            <input
              id="minYear"
              type="number"
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={releaseYearRange.min}
              onChange={(e) => setReleaseYearRange({ ...releaseYearRange, min: Number(e.target.value) })}
              min="1900"
              max="2030"
            />
            <label htmlFor="maxYear" className="block mb-2 mt-2">Release Year To</label>
            <input
              id="maxYear"
              type="number"
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={releaseYearRange.max}
              onChange={(e) => setReleaseYearRange({ ...releaseYearRange, max: Number(e.target.value) })}
              min="1900"
              max="2030"
            />
          </div>
          <div>
            <label htmlFor="genre" className="block mb-2">Genre</label>
            <select
              id="genre"
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="minRating" className="block mb-2">Rating From</label>
            <input
              id="minRating"
              type="number"
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={ratingRange.min}
              onChange={(e) => setRatingRange({ ...ratingRange, min: Number(e.target.value) })}
              min="1"
              max="10"
            />
            <label htmlFor="maxRating" className="block mb-2 mt-2">Rating To</label>
            <input
              id="maxRating"
              type="number"
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={ratingRange.max}
              onChange={(e) => setRatingRange({ ...ratingRange, max: Number(e.target.value) })}
              min="1"
              max="10"
            />
          </div>
        </div>
      </form>
      <div className="results">
        <h2 className="text-2xl font-bold mb-4">Results</h2>
        <div>
          <h3 className="text-xl font-bold mb-2">Movies Matching Title</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.moviesMatchingTitle?.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <img className="w-full h-64 object-cover" src={movie.imageUrl} alt={movie.title} />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-white">{movie.title}</h3>
                    <div className="flex items-center text-yellow-500">
                      <MdStar className="text-yellow-500" size={20} />
                      <span className="ml-1 text-gray-400">{movie.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie?.tags?.map((tag, index) => (
                        <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Movies Matching Description</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.moviesMatchingDescription?.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <img className="w-full h-64 object-cover" src={movie.imageUrl} alt={movie.title} />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-white">{movie.title}</h3>
                    <div className="flex items-center text-yellow-500">
                      <MdStar className="text-yellow-500" size={20} />
                      <span className="ml-1 text-gray-400">{movie.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie?.tags?.map((tag, index) => (
                        <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Actors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.actors?.map((actor) => (
              <Link key={actor.id} to={`/actor/${actor.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <img className="w-full h-64 object-cover" src={actor.imageUrl} alt={actor.name} />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-white">{actor.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Reviews</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results?.reviews?.map((review) => (
              <div
                key={review.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 p-4"
              >
                <p className="font-bold text-white">{review?.user?.username}</p>
                <p className="text-sm text-gray-400">{review.reviewDate}</p>
                <p className="mt-2 text-white">{review.reviewText}</p>
                <div className="flex items-center text-yellow-500 mt-2">
                  <MdStar className="text-yellow-500" size={20} />
                  <span className="ml-1 text-gray-400">{review.rating}</span>
                </div>
                <Link to={`/movie/${review.movie.id}`} className="mt-2 text-blue-500 hover:text-blue-400 transition-colors">
                  {review?.movie?.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
