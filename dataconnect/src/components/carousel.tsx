import React from 'react';
import MovieCard from './moviecard';

interface CarouselProps {
  title: string;
  movies: {
    id: string;
    title?: string;
    imageUrl?: string;
    rating?: number;
    genre?: string;
    tags?: string[];
  }[];
}

const Carousel: React.FC<CarouselProps> = ({ title, movies }) => {
  return (
    <section className="carousel py-8">
      <h2 className="text-gray-200 text-2xl font-bold mb-4">{title}</h2>
      <div className="carousel__container flex overflow-x-auto space-x-4">
        {movies.map((movie) => (
          <div className="flex-shrink-0" key={movie.id}>
            <MovieCard
              id={movie.id}
              title={movie.title}
              imageUrl={movie.imageUrl}
              rating={movie.rating}
              genre={movie.genre}
              tags={movie.tags}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
