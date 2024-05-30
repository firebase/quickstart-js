'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { getActorById, GetActorByIdResponse, GetActorByIdVariables, addFavoritedActor, deleteFavoriteActor, getIfFavoritedActor } from '../../../lib/dataconnect-sdk';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const Page = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [actor, setActor] = useState<GetActorByIdResponse['actor'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        checkIfFavorited(user.uid);
      }
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchActor = async () => {
        try {
          const response = await getActorById({ id });
          setActor(response.data.actor);
        } catch (error) {
          console.error('Error fetching actor:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchActor();
    }
  }, [id]);

  const checkIfFavorited = async (userId: string) => {
    try {
      const response = await getIfFavoritedActor({ id: userId, actorId: id });
      setIsFavorited(!!response.data.favoriteActor);
    } catch (error) {
      console.error('Error checking if favorited:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!authUser) return;
    try {
      if (isFavorited) {
        await deleteFavoriteActor({ userId: authUser.uid, actorId: id });
      } else {
        await addFavoritedActor({ actorId: id });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!actor) return <p>Actor not found.</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col md:flex-row mb-8">
        <img className="w-full md:w-1/3 object-cover rounded-lg shadow-md" src={actor.imageUrl} alt={actor.name} />
        <div className="md:ml-8 mt-4 md:mt-0 flex-1">
          <h1 className="text-5xl font-bold mb-2">{actor.name}</h1>
          <div className="mt-4 flex space-x-4">
            <button
              className="flex items-center justify-center p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
              aria-label="Favorite"
              onClick={handleFavoriteToggle}
            >
              {isFavorited ? <MdFavorite size={24} /> : <MdFavoriteBorder size={24} />}
            </button>
          </div>
          <p className="text-lg mb-4 p-4 bg-gray-800 rounded-lg">{actor.biography}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Main Roles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actor.mainActors.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <img className="w-full h-48 object-cover" src={movie.imageUrl} alt={movie.title} />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-white">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.genre}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie.tags.map((tag, index) => (
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
        <h2 className="text-2xl font-bold mb-2">Supporting Roles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actor.supportingActors.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <img className="w-full h-48 object-cover" src={movie.imageUrl} alt={movie.title} />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-white">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.genre}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
