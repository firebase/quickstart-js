import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { handleGetCurrentUser, handleDeleteReview } from "@/lib/MovieService";
import { MdStar } from "react-icons/md";
import { AuthContext } from "@/lib/firebase";
import MovieCard from "@/components/moviecard";

export default function MyProfilePage() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        loadUserProfile();
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

  async function loadUserProfile() {
    try {
      const userProfile = await handleGetCurrentUser();
      setUser(userProfile);
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(reviewMovieId: string) {
    if (!authUser) return;
    try {
      await handleDeleteReview(reviewMovieId);
      loadUserProfile();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4">
          Welcome back, {user.username}
        </h1>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-800 rounded-lg overflow-scroll shadow-md p-4 relative max-h-72"
            >
              <h3 className="font-bold text-lg mb-1 text-white">
                {review.movie.title}
              </h3>
              <div className="flex items-center text-yellow-500 mb-2">
                <MdStar className="text-yellow-500" size={24} />
                <span className="ml-1 text-gray-400">{review.rating}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{review.reviewDate}</p>
              <p className="text-sm text-gray-300">{review.reviewText}</p>
              <button
                onClick={() => deleteReview(review.movie.id)}
                className="absolute bottom-2 right-2 text-red-500 hover:text-red-600"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Favorite Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {user.favoriteMovies.map((fav) => (
            <div className="m-4">
              <MovieCard
                key={fav.movie.id}
                id={fav.movie.id}
                title={fav.movie.title || "TBA"}
                imageUrl={fav.movie.imageUrl}
                rating={fav.movie.rating}
                genre={fav.movie.genre}
                tags={fav.movie.tags}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
