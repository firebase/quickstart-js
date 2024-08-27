import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  getCurrentUser,
  GetCurrentUserResponse,
  deleteReview,
  deleteFavoritedMovie,
  deleteFavoritedActor,
} from '@movie/dataconnect';
import { MdStar } from 'react-icons/md';
import { AuthContext } from '@/lib/firebase';

export default function MyProfilePage() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<GetCurrentUserResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        fetchUserProfile();
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

  async function fetchUserProfile() {
    try {
      const response = await getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteReview(reviewId: string) {
    if (!authUser) return;
    try {
      await deleteReview({ movieId: reviewId });
      fetchUserProfile();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  }

  async function handleUnfavoriteMovie(movieId: string) {
    if (!authUser) return;
    try {
      await deleteFavoritedMovie({ movieId });
      fetchUserProfile();
    } catch (error) {
      console.error('Error unfavoriting movie:', error);
    }
  }

  async function handleUnfavoriteActor(actorId: string) {
    if (!authUser) return;
    try {
      await deleteFavoritedActor({ actorId });
      fetchUserProfile();
    } catch (error) {
      console.error('Error unfavoriting actor:', error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4">Welcome back, {user.username}</h1>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-lg overflow-scroll shadow-md p-4 relative max-h-72">
              <h3 className="font-bold text-lg mb-1 text-white">{review.movie.title}</h3>
              <div className="flex items-center text-yellow-500 mb-2">
                <MdStar className="text-yellow-500" size={24} />
                <span className="ml-1 text-gray-400">{review.rating}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{review.reviewDate}</p>
              <p className="text-sm text-gray-300">{review.reviewText}</p>
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="absolute bottom-2 right-2 text-red-500 hover:text-red-600"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Favorite Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.favoriteMovies.map((fav) => (
            <div key={fav.movie.id} className="bg-gray-800 rounded-lg overflow-scroll shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer relative max-h-80">
              <Link to={`/movie/${fav.movie.id}`}>
                <img className="w-full h-64 object-cover" src={fav.movie.imageUrl} alt={fav.movie.title} />
              </Link>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-white">{fav.movie.title}</h3>
                <p className="text-sm text-gray-400 capitalize">{fav.movie.genre}</p>
                <p className="text-sm text-gray-300 overflow-y-scroll max-h-24">{fav.movie.description}</p>
                <div className="flex items-center text-yellow-500 mt-2">
                  <MdStar className="text-yellow-500" size={24} />
                  <span className="ml-1 text-gray-400">{fav.movie.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {fav.movie.tags?.map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs capitalize">{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleUnfavoriteMovie(fav.movie.id)}
                className="absolute bottom-2 right-2 text-red-500 hover:text-red-600"
              >
                Remove Favorite
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Favorite Actors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.favoriteActors.map((favActor) => (
            <div key={favActor.actor.id} className="bg-gray-800 rounded-lg overflow-scroll shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer relative max-h-80">
              <Link to={`/actor/${favActor.actor.id}`}>
                <img className="w-48 h-48 object-cover rounded-full mx-auto mt-4" src={favActor.actor.imageUrl} alt={favActor.actor.name} />
              </Link>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg mb-1 text-white">{favActor.actor.name}</h3>
              </div>
              <button
                onClick={() => handleUnfavoriteActor(favActor.actor.id)}
                className="absolute bottom-2 right-2 text-red-500 hover:text-red-600"
              >
                Remove Favorite
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
