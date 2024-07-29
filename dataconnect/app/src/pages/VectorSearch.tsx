import React, { useState } from 'react';
import { searchMovieDescriptionUsingL2similarity, SearchMovieDescriptionUsingL2similarityResponse } from '@movie/dataconnect';
import { FaSpinner } from 'react-icons/fa';

export default function VectorSearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchMovieDescriptionUsingL2similarityResponse['movies_descriptionEmbedding_similarity']>([]);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await searchMovieDescriptionUsingL2similarity({ query });
      setResults(response.data.movies_descriptionEmbedding_similarity);
    } catch (error) {
      console.error('Error fetching movie descriptions:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-4">Vector Movie Search</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <label htmlFor="query" className="block mb-2 text-xl">Enter your query</label>
        <div className="flex items-center">
          <input
            id="query"
            type="text"
            className="w-full p-4 rounded bg-gray-800 text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the kind of movie you're looking for..."
          />
          <button
            type="submit"
            className="ml-2 p-4 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="results">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((movie) => (
              <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <img className="w-full h-64 object-cover" src={movie.imageUrl} alt={movie.title} />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-white">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.description}</p>
                  <div className="flex items-center text-yellow-500 mt-2">
                    <span className="ml-1 text-gray-400">{movie.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie?.tags?.map((tag, index) => (
                      <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
