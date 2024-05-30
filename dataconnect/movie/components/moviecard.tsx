import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdFavorite, MdFavoriteBorder, MdCheck, MdAdd, MdStar } from 'react-icons/md';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { addFavoritedMovie, deleteFavoritedMovie, addWatchedMovie, deleteWatchedMovie, getIfWatched, getIfFavoritedMovie } from '../lib/dataconnect-sdk';

interface MovieCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  rating?: number;
  genre?: string;
  tags?: string[];
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, imageUrl, rating, genre, tags }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkIfFavorited(user.uid);
        checkIfWatched(user.uid);
      }
    });

    return () => unsubscribe();
  }, [auth, id]);

  const checkIfFavorited = async (userId: string) => {
    try {
      const response = await getIfFavoritedMovie({ id: userId, movieId: id });
      setIsFavorited(!!response.data.favoriteMovie);
    } catch (error) {
      console.error('Error checking if favorited:', error);
    }
  };

  const checkIfWatched = async (userId: string) => {
    try {
      const response = await getIfWatched({ id: userId, movieId: id });
      setIsWatched(!!response.data.watchedMovie);
    } catch (error) {
      console.error('Error checking if watched:', error);
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) return;
    try {
      if (isFavorited) {
        await deleteFavoritedMovie({ userId: user.uid, movieId: id });
      } else {
        await addFavoritedMovie({ movieId: id });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleWatchedToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) return;
    try {
      if (isWatched) {
        await deleteWatchedMovie({ userId: user.uid, movieId: id });
      } else {
        await addWatchedMovie({ movieId: id });
      }
      setIsWatched(!isWatched);
    } catch (error) {
      console.error('Error updating watched status:', error);
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-1000 transform hover:scale-105 cursor-pointer w-64">
      <Link href={`/movie/${id}`} passHref>
        <div>
          <img className="w-full h-64 object-cover" src={imageUrl} alt={title} />
          <div className="p-4">
            <div className="font-bold text-lg mb-1 text-white whitespace-nowrap overflow-hidden overflow-ellipsis">{title}</div>
            <div className="flex items-center text-yellow-500">
              <MdStar className="text-yellow-500" size={20} />
              <span className="ml-1 text-gray-400">{rating}</span>
            </div>
            <div className="mt-2 text-gray-400">
              {genre && (
                <Link href={`/genre/${genre.toLowerCase()}`} passHref legacyBehavior>
                  <a className="block mb-1 hover:underline">{capitalize(genre)}</a>
                </Link>
              )}
              <div className="flex flex-wrap gap-1">
                {tags?.map((tag, index) => (
                  <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">{capitalize(tag)}</span>
                ))}
              </div>
            </div>
            {user && (
              <div className="mt-2 flex space-x-2 items-center">
                <button
                  className="flex items-center justify-center p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
                  aria-label="Favorite"
                  onClick={handleFavoriteToggle}
                >
                  {isFavorited ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
                </button>
                <button
                  className="flex items-center justify-center p-1 text-green-700 hover:text-green-800 transition-colors duration-200"
                  aria-label="Watched"
                  onClick={handleWatchedToggle}
                >
                  {isWatched ? (
                    <>
                      <MdCheck size={20} />
                      <span className="ml-1 text-sm">Watched</span>
                    </>
                  ) : (
                    <>
                      <MdAdd size={20} />
                      <span className="ml-1 text-sm">Add to watchlist</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
