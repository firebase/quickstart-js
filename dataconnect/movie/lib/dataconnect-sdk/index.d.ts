import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;


export interface Actor_Key {
  id: UUIDString;
  __typename?: 'Actor_Key';
}

export interface AddFavoritedActorResponse {
  favoriteActor_upsert: FavoriteActor_Key;
}

export interface AddFavoritedActorVariables {
  actorId: UUIDString;
}

export interface AddFavoritedMovieResponse {
  favoriteMovie_upsert: FavoriteMovie_Key;
}

export interface AddFavoritedMovieVariables {
  movieId: UUIDString;
}

export interface AddReviewResponse {
  review_upsert: Review_Key;
}

export interface AddReviewVariables {
  movieId: UUIDString;
  rating: number;
  reviewText: string;
}

export interface AddWatchedMovieResponse {
  watchedMovie_upsert: WatchedMovie_Key;
}

export interface AddWatchedMovieVariables {
  movieId: UUIDString;
}

export interface CreateMovieResponse {
  movie_insert: Movie_Key;
}

export interface CreateMovieVariables {
  title: string;
  releaseYear: number;
  genre: string;
  rating?: number | null;
  description?: string | null;
  imageUrl: string;
  tags?: string[] | null;
}

export interface DeleteFavoriteActorResponse {
  favoriteActor_delete?: FavoriteActor_Key | null;
}

export interface DeleteFavoriteActorVariables {
  userId: string;
  actorId: UUIDString;
}

export interface DeleteFavoritedMovieResponse {
  favoriteMovie_delete?: FavoriteMovie_Key | null;
}

export interface DeleteFavoritedMovieVariables {
  userId: string;
  movieId: UUIDString;
}

export interface DeleteMovieResponse {
  movie_delete?: Movie_Key | null;
}

export interface DeleteMovieVariables {
  id: UUIDString;
}

export interface DeleteReviewResponse {
  review_delete?: Review_Key | null;
}

export interface DeleteReviewVariables {
  movieId: UUIDString;
  userId: string;
}

export interface DeleteUnpopularMoviesResponse {
  movie_deleteMany: number;
}

export interface DeleteUnpopularMoviesVariables {
  minRating: number;
}

export interface DeleteWatchedMovieResponse {
  watchedMovie_delete?: WatchedMovie_Key | null;
}

export interface DeleteWatchedMovieVariables {
  userId: string;
  movieId: UUIDString;
}

export interface FavoriteActor_Key {
  userId: string;
  actorId: UUIDString;
  __typename?: 'FavoriteActor_Key';
}

export interface FavoriteMovie_Key {
  userId: string;
  movieId: UUIDString;
  __typename?: 'FavoriteMovie_Key';
}

export interface FuzzySearchResponse {
  moviesMatchingTitle: ({
    id: UUIDString;
    title: string;
    genre?: string | null;
    rating?: number | null;
    imageUrl: string;
  } & Movie_Key)[];
    moviesMatchingDescription: ({
      id: UUIDString;
      title: string;
      genre?: string | null;
      rating?: number | null;
      imageUrl: string;
    } & Movie_Key)[];
      actorsMatchingName: ({
        id: UUIDString;
        name: string;
        imageUrl: string;
      } & Actor_Key)[];
        reviewsMatchingText: ({
          id: UUIDString;
          rating?: number | null;
          reviewText?: string | null;
          reviewDate: DateString;
          movie: {
            id: UUIDString;
            title: string;
          } & Movie_Key;
            user: {
              id: string;
              username: string;
            } & User_Key;
        })[];
}

export interface FuzzySearchVariables {
  input?: string | null;
  minYear: number;
  maxYear: number;
  minRating: number;
  maxRating: number;
  genre: string;
}

export interface GetActorByIdResponse {
  actor?: {
    id: UUIDString;
    name: string;
    imageUrl: string;
    biography?: string | null;
    mainActors: ({
      id: UUIDString;
      title: string;
      genre?: string | null;
      tags?: string[] | null;
      imageUrl: string;
    } & Movie_Key)[];
      supportingActors: ({
        id: UUIDString;
        title: string;
        genre?: string | null;
        tags?: string[] | null;
        imageUrl: string;
      } & Movie_Key)[];
  } & Actor_Key;
}

export interface GetActorByIdVariables {
  id: UUIDString;
}

export interface GetFavoriteActorsByIdResponse {
  user?: {
    favoriteActors_on_user: ({
      actor: {
        id: UUIDString;
        name: string;
        imageUrl: string;
      } & Actor_Key;
    })[];
  };
}

export interface GetFavoriteActorsByIdVariables {
  id: string;
}

export interface GetFavoriteMoviesByIdResponse {
  user?: {
    favoriteMovies_on_user: ({
      movie: {
        id: UUIDString;
        title: string;
        genre?: string | null;
        imageUrl: string;
        releaseYear?: number | null;
        rating?: number | null;
        description?: string | null;
      } & Movie_Key;
    })[];
  };
}

export interface GetFavoriteMoviesByIdVariables {
  id: string;
}

export interface GetIfFavoritedActorResponse {
  favoriteActor?: {
    actorId: UUIDString;
  };
}

export interface GetIfFavoritedActorVariables {
  id: string;
  actorId: UUIDString;
}

export interface GetIfFavoritedMovieResponse {
  favoriteMovie?: {
    movieId: UUIDString;
  };
}

export interface GetIfFavoritedMovieVariables {
  id: string;
  movieId: UUIDString;
}

export interface GetIfWatchedResponse {
  watchedMovie?: {
    movieId: UUIDString;
  };
}

export interface GetIfWatchedVariables {
  id: string;
  movieId: UUIDString;
}

export interface GetMovieByIdResponse {
  movie?: {
    id: UUIDString;
    title: string;
    imageUrl: string;
    releaseYear?: number | null;
    genre?: string | null;
    rating?: number | null;
    description?: string | null;
    tags?: string[] | null;
    metadata: ({
      director?: string | null;
    })[];
      mainActors: ({
        id: UUIDString;
        name: string;
        imageUrl: string;
      } & Actor_Key)[];
        supportingActors: ({
          id: UUIDString;
          name: string;
          imageUrl: string;
        } & Actor_Key)[];
          sequelTo?: {
            id: UUIDString;
            title: string;
            imageUrl: string;
          } & Movie_Key;
            reviews: ({
              id: UUIDString;
              reviewText?: string | null;
              reviewDate: DateString;
              rating?: number | null;
              user: {
                id: string;
                username: string;
              } & User_Key;
            })[];
  } & Movie_Key;
}

export interface GetMovieByIdVariables {
  id: UUIDString;
}

export interface GetMovieCastResponse {
  movie?: {
    mainActors: ({
      id: UUIDString;
      name: string;
      imageUrl: string;
    } & Actor_Key)[];
      supportingActors: ({
        id: UUIDString;
        name: string;
        imageUrl: string;
      } & Actor_Key)[];
  };
    actor?: {
      mainRoles: ({
        id: UUIDString;
        title: string;
        imageUrl: string;
      } & Movie_Key)[];
        supportingRoles: ({
          id: UUIDString;
          title: string;
          imageUrl: string;
        } & Movie_Key)[];
    };
}

export interface GetMovieCastVariables {
  movieId: UUIDString;
  actorId: UUIDString;
}

export interface GetMovieMetadataResponse {
  movie?: {
    movieMetadatas_on_movie: ({
      director?: string | null;
    })[];
  };
}

export interface GetMovieMetadataVariables {
  id: UUIDString;
}

export interface GetUserByIdResponse {
  user?: {
    id: string;
    username: string;
    reviews: ({
      id: UUIDString;
      rating?: number | null;
      reviewDate: DateString;
      reviewText?: string | null;
      movie: {
        id: UUIDString;
        title: string;
      } & Movie_Key;
    })[];
      watched: ({
        movie: {
          id: UUIDString;
          title: string;
          genre?: string | null;
          imageUrl: string;
          releaseYear?: number | null;
          rating?: number | null;
          description?: string | null;
          tags?: string[] | null;
          metadata: ({
            director?: string | null;
          })[];
        } & Movie_Key;
      })[];
        favoriteMovies: ({
          movie: {
            id: UUIDString;
            title: string;
            genre?: string | null;
            imageUrl: string;
            releaseYear?: number | null;
            rating?: number | null;
            description?: string | null;
            tags?: string[] | null;
            metadata: ({
              director?: string | null;
            })[];
          } & Movie_Key;
        })[];
          favoriteActors: ({
            actor: {
              id: UUIDString;
              name: string;
              imageUrl: string;
            } & Actor_Key;
          })[];
  } & User_Key;
}

export interface GetUserByIdVariables {
  id: string;
}

export interface GetWatchedMoviesByAuthIdResponse {
  user?: {
    watchedMovies_on_user: ({
      movie: {
        id: UUIDString;
        title: string;
        genre?: string | null;
        imageUrl: string;
        releaseYear?: number | null;
        rating?: number | null;
        description?: string | null;
      } & Movie_Key;
    })[];
  };
}

export interface GetWatchedMoviesByAuthIdVariables {
  id: string;
}

export interface ListMoviesByGenreResponse {
  mostPopular: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    rating?: number | null;
    tags?: string[] | null;
  } & Movie_Key)[];
    mostRecent: ({
      id: UUIDString;
      title: string;
      imageUrl: string;
      rating?: number | null;
      tags?: string[] | null;
    } & Movie_Key)[];
}

export interface ListMoviesByGenreVariables {
  genre: string;
}

export interface ListMoviesByPartialTitleResponse {
  movies: ({
    id: UUIDString;
    title: string;
    genre?: string | null;
    rating?: number | null;
    imageUrl: string;
  } & Movie_Key)[];
}

export interface ListMoviesByPartialTitleVariables {
  input: string;
}

export interface ListMoviesByRatingAndGenreResponse {
  movies: ({
    title: string;
    imageUrl: string;
  })[];
}

export interface ListMoviesByRatingAndGenreVariables {
  minRating: number;
  genre?: string | null;
}

export interface ListMoviesByReleaseYearResponse {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
  } & Movie_Key)[];
}

export interface ListMoviesByTagResponse {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
    rating?: number | null;
  } & Movie_Key)[];
}

export interface ListMoviesByTagVariables {
  tag: string;
}

export interface ListMoviesByTitleStringResponse {
  prefixed: ({
    title: string;
  })[];
    suffixed: ({
      title: string;
    })[];
      contained: ({
        title: string;
      })[];
}

export interface ListMoviesByTitleStringVariables {
  prefix?: string | null;
  suffix?: string | null;
  contained?: string | null;
}

export interface ListMoviesFilterResponse {
  movies: ({
    title: string;
    imageUrl: string;
  })[];
}

export interface ListMoviesFilterVariables {
  genre?: string | null;
  limit?: number | null;
}

export interface ListMoviesResponse {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    releaseYear?: number | null;
    genre?: string | null;
    rating?: number | null;
    tags?: string[] | null;
  } & Movie_Key)[];
}

export interface ListUsersResponse {
  users: ({
    id: string;
    username: string;
    favoriteActors_on_user: ({
      actor: {
        id: UUIDString;
        name: string;
        imageUrl: string;
      } & Actor_Key;
    })[];
      favoriteMovies_on_user: ({
        movie: {
          id: UUIDString;
          title: string;
          genre?: string | null;
          imageUrl: string;
          tags?: string[] | null;
        } & Movie_Key;
      })[];
        reviews_on_user: ({
          id: UUIDString;
          rating?: number | null;
          reviewText?: string | null;
          reviewDate: DateString;
          movie: {
            id: UUIDString;
            title: string;
          } & Movie_Key;
        })[];
          watchedMovies_on_user: ({
            movie: {
              id: UUIDString;
              title: string;
              genre?: string | null;
              imageUrl: string;
            } & Movie_Key;
          })[];
  } & User_Key)[];
}

export interface MovieActor_Key {
  movieId: UUIDString;
  actorId: UUIDString;
  __typename?: 'MovieActor_Key';
}

export interface MovieByKeyResponse {
  movie?: {
    title: string;
    imageUrl: string;
  };
}

export interface MovieByKeyVariables {
  key: Movie_Key;
}

export interface MovieByTitleResponse {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
    rating?: number | null;
  } & Movie_Key)[];
}

export interface MovieByTitleVariables {
  title: string;
}

export interface MovieByTopRatingResponse {
  mostPopular: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    rating?: number | null;
    tags?: string[] | null;
  } & Movie_Key)[];
}

export interface MovieByTopRatingVariables {
  genre?: string | null;
}

export interface MovieMetadata_Key {
  id: UUIDString;
  __typename?: 'MovieMetadata_Key';
}

export interface Movie_Key {
  id: UUIDString;
  __typename?: 'Movie_Key';
}

export interface MoviesByReleaseYearResponse {
  movies: ({
    id: UUIDString;
    rating?: number | null;
    title: string;
    imageUrl: string;
  } & Movie_Key)[];
}

export interface MoviesByReleaseYearVariables {
  min?: number | null;
  max?: number | null;
}

export interface MoviesRecentlyReleasedResponse {
  movies: ({
    id: UUIDString;
    title: string;
    rating?: number | null;
    imageUrl: string;
    genre?: string | null;
    tags?: string[] | null;
  } & Movie_Key)[];
}

export interface MoviesTop10Response {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    rating?: number | null;
    genre?: string | null;
    tags?: string[] | null;
    metadata: ({
      director?: string | null;
    })[];
      mainActors: ({
        id: UUIDString;
        name: string;
        imageUrl: string;
      } & Actor_Key)[];
        supportingActors: ({
          id: UUIDString;
          name: string;
          imageUrl: string;
        } & Actor_Key)[];
  } & Movie_Key)[];
}

export interface Review_Key {
  userId: string;
  movieId: UUIDString;
  __typename?: 'Review_Key';
}

export interface SearchMovieDescriptionUsingL2similarityResponse {
  movies_descriptionEmbedding_similarity: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    tags?: string[] | null;
    rating?: number | null;
    imageUrl: string;
  } & Movie_Key)[];
}

export interface SearchMovieDescriptionUsingL2similarityVariables {
  query: string;
}

export interface UpdateMovieResponse {
  movie_update?: Movie_Key | null;
}

export interface UpdateMovieVariables {
  id: UUIDString;
  title?: string | null;
  releaseYear?: number | null;
  genre?: string | null;
  rating?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  tags?: string[] | null;
}

export interface UpsertUserResponse {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  username: string;
}

export interface UserMoviePreferencesResponse {
  users: ({
    likedMovies: ({
      title: string;
      imageUrl: string;
      genre?: string | null;
      description?: string | null;
    })[];
      dislikedMovies: ({
        title: string;
        imageUrl: string;
        genre?: string | null;
        description?: string | null;
      })[];
  })[];
}

export interface UserMoviePreferencesVariables {
  username: string;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface WatchedMovie_Key {
  userId: string;
  movieId: UUIDString;
  __typename?: 'WatchedMovie_Key';
}



/* Allow users to create refs without passing in DataConnect */
export function createMovieRef(vars: CreateMovieVariables): MutationRef<CreateMovieResponse, CreateMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createMovieRef(dc: DataConnect, vars: CreateMovieVariables): MutationRef<CreateMovieResponse,CreateMovieVariables>;

export function createMovie(vars: CreateMovieVariables): MutationPromise<CreateMovieResponse, CreateMovieVariables>;
export function createMovie(dc: DataConnect, vars: CreateMovieVariables): MutationPromise<CreateMovieResponse,CreateMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function updateMovieRef(vars: UpdateMovieVariables): MutationRef<UpdateMovieResponse, UpdateMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function updateMovieRef(dc: DataConnect, vars: UpdateMovieVariables): MutationRef<UpdateMovieResponse,UpdateMovieVariables>;

export function updateMovie(vars: UpdateMovieVariables): MutationPromise<UpdateMovieResponse, UpdateMovieVariables>;
export function updateMovie(dc: DataConnect, vars: UpdateMovieVariables): MutationPromise<UpdateMovieResponse,UpdateMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteMovieRef(vars: DeleteMovieVariables): MutationRef<DeleteMovieResponse, DeleteMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteMovieRef(dc: DataConnect, vars: DeleteMovieVariables): MutationRef<DeleteMovieResponse,DeleteMovieVariables>;

export function deleteMovie(vars: DeleteMovieVariables): MutationPromise<DeleteMovieResponse, DeleteMovieVariables>;
export function deleteMovie(dc: DataConnect, vars: DeleteMovieVariables): MutationPromise<DeleteMovieResponse,DeleteMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteUnpopularMoviesRef(vars: DeleteUnpopularMoviesVariables): MutationRef<DeleteUnpopularMoviesResponse, DeleteUnpopularMoviesVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteUnpopularMoviesRef(dc: DataConnect, vars: DeleteUnpopularMoviesVariables): MutationRef<DeleteUnpopularMoviesResponse,DeleteUnpopularMoviesVariables>;

export function deleteUnpopularMovies(vars: DeleteUnpopularMoviesVariables): MutationPromise<DeleteUnpopularMoviesResponse, DeleteUnpopularMoviesVariables>;
export function deleteUnpopularMovies(dc: DataConnect, vars: DeleteUnpopularMoviesVariables): MutationPromise<DeleteUnpopularMoviesResponse,DeleteUnpopularMoviesVariables>;


/* Allow users to create refs without passing in DataConnect */
export function addWatchedMovieRef(vars: AddWatchedMovieVariables): MutationRef<AddWatchedMovieResponse, AddWatchedMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function addWatchedMovieRef(dc: DataConnect, vars: AddWatchedMovieVariables): MutationRef<AddWatchedMovieResponse,AddWatchedMovieVariables>;

export function addWatchedMovie(vars: AddWatchedMovieVariables): MutationPromise<AddWatchedMovieResponse, AddWatchedMovieVariables>;
export function addWatchedMovie(dc: DataConnect, vars: AddWatchedMovieVariables): MutationPromise<AddWatchedMovieResponse,AddWatchedMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteWatchedMovieRef(vars: DeleteWatchedMovieVariables): MutationRef<DeleteWatchedMovieResponse, DeleteWatchedMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteWatchedMovieRef(dc: DataConnect, vars: DeleteWatchedMovieVariables): MutationRef<DeleteWatchedMovieResponse,DeleteWatchedMovieVariables>;

export function deleteWatchedMovie(vars: DeleteWatchedMovieVariables): MutationPromise<DeleteWatchedMovieResponse, DeleteWatchedMovieVariables>;
export function deleteWatchedMovie(dc: DataConnect, vars: DeleteWatchedMovieVariables): MutationPromise<DeleteWatchedMovieResponse,DeleteWatchedMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function addFavoritedMovieRef(vars: AddFavoritedMovieVariables): MutationRef<AddFavoritedMovieResponse, AddFavoritedMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function addFavoritedMovieRef(dc: DataConnect, vars: AddFavoritedMovieVariables): MutationRef<AddFavoritedMovieResponse,AddFavoritedMovieVariables>;

export function addFavoritedMovie(vars: AddFavoritedMovieVariables): MutationPromise<AddFavoritedMovieResponse, AddFavoritedMovieVariables>;
export function addFavoritedMovie(dc: DataConnect, vars: AddFavoritedMovieVariables): MutationPromise<AddFavoritedMovieResponse,AddFavoritedMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteFavoritedMovieRef(vars: DeleteFavoritedMovieVariables): MutationRef<DeleteFavoritedMovieResponse, DeleteFavoritedMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteFavoritedMovieRef(dc: DataConnect, vars: DeleteFavoritedMovieVariables): MutationRef<DeleteFavoritedMovieResponse,DeleteFavoritedMovieVariables>;

export function deleteFavoritedMovie(vars: DeleteFavoritedMovieVariables): MutationPromise<DeleteFavoritedMovieResponse, DeleteFavoritedMovieVariables>;
export function deleteFavoritedMovie(dc: DataConnect, vars: DeleteFavoritedMovieVariables): MutationPromise<DeleteFavoritedMovieResponse,DeleteFavoritedMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function addFavoritedActorRef(vars: AddFavoritedActorVariables): MutationRef<AddFavoritedActorResponse, AddFavoritedActorVariables>;
/* Allow users to pass in custom DataConnect instances */
export function addFavoritedActorRef(dc: DataConnect, vars: AddFavoritedActorVariables): MutationRef<AddFavoritedActorResponse,AddFavoritedActorVariables>;

export function addFavoritedActor(vars: AddFavoritedActorVariables): MutationPromise<AddFavoritedActorResponse, AddFavoritedActorVariables>;
export function addFavoritedActor(dc: DataConnect, vars: AddFavoritedActorVariables): MutationPromise<AddFavoritedActorResponse,AddFavoritedActorVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteFavoriteActorRef(vars: DeleteFavoriteActorVariables): MutationRef<DeleteFavoriteActorResponse, DeleteFavoriteActorVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteFavoriteActorRef(dc: DataConnect, vars: DeleteFavoriteActorVariables): MutationRef<DeleteFavoriteActorResponse,DeleteFavoriteActorVariables>;

export function deleteFavoriteActor(vars: DeleteFavoriteActorVariables): MutationPromise<DeleteFavoriteActorResponse, DeleteFavoriteActorVariables>;
export function deleteFavoriteActor(dc: DataConnect, vars: DeleteFavoriteActorVariables): MutationPromise<DeleteFavoriteActorResponse,DeleteFavoriteActorVariables>;


/* Allow users to create refs without passing in DataConnect */
export function addReviewRef(vars: AddReviewVariables): MutationRef<AddReviewResponse, AddReviewVariables>;
/* Allow users to pass in custom DataConnect instances */
export function addReviewRef(dc: DataConnect, vars: AddReviewVariables): MutationRef<AddReviewResponse,AddReviewVariables>;

export function addReview(vars: AddReviewVariables): MutationPromise<AddReviewResponse, AddReviewVariables>;
export function addReview(dc: DataConnect, vars: AddReviewVariables): MutationPromise<AddReviewResponse,AddReviewVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteReviewRef(vars: DeleteReviewVariables): MutationRef<DeleteReviewResponse, DeleteReviewVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteReviewRef(dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewResponse,DeleteReviewVariables>;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewResponse, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewResponse,DeleteReviewVariables>;


/* Allow users to create refs without passing in DataConnect */
export function upsertUserRef(vars: UpsertUserVariables): MutationRef<UpsertUserResponse, UpsertUserVariables>;
/* Allow users to pass in custom DataConnect instances */
export function upsertUserRef(dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserResponse,UpsertUserVariables>;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserResponse, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserResponse,UpsertUserVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesRef(): QueryRef<ListMoviesResponse, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listMoviesRef(dc: DataConnect): QueryRef<ListMoviesResponse,undefined>;

export function listMovies(): QueryPromise<ListMoviesResponse, undefined>;
export function listMovies(dc: DataConnect): QueryPromise<ListMoviesResponse,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listUsersRef(): QueryRef<ListUsersResponse, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listUsersRef(dc: DataConnect): QueryRef<ListUsersResponse,undefined>;

export function listUsers(): QueryPromise<ListUsersResponse, undefined>;
export function listUsers(dc: DataConnect): QueryPromise<ListUsersResponse,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesByGenreRef(vars: ListMoviesByGenreVariables): QueryRef<ListMoviesByGenreResponse, ListMoviesByGenreVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listMoviesByGenreRef(dc: DataConnect, vars: ListMoviesByGenreVariables): QueryRef<ListMoviesByGenreResponse,ListMoviesByGenreVariables>;

export function listMoviesByGenre(vars: ListMoviesByGenreVariables): QueryPromise<ListMoviesByGenreResponse, ListMoviesByGenreVariables>;
export function listMoviesByGenre(dc: DataConnect, vars: ListMoviesByGenreVariables): QueryPromise<ListMoviesByGenreResponse,ListMoviesByGenreVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesByReleaseYearRef(): QueryRef<ListMoviesByReleaseYearResponse, undefined>;/* Allow users to pass in custom DataConnect instances */
export function listMoviesByReleaseYearRef(dc: DataConnect): QueryRef<ListMoviesByReleaseYearResponse,undefined>;

export function listMoviesByReleaseYear(): QueryPromise<ListMoviesByReleaseYearResponse, undefined>;
export function listMoviesByReleaseYear(dc: DataConnect): QueryPromise<ListMoviesByReleaseYearResponse,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function getMovieByIdRef(vars: GetMovieByIdVariables): QueryRef<GetMovieByIdResponse, GetMovieByIdVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getMovieByIdRef(dc: DataConnect, vars: GetMovieByIdVariables): QueryRef<GetMovieByIdResponse,GetMovieByIdVariables>;

export function getMovieById(vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdResponse, GetMovieByIdVariables>;
export function getMovieById(dc: DataConnect, vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdResponse,GetMovieByIdVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getActorByIdRef(vars: GetActorByIdVariables): QueryRef<GetActorByIdResponse, GetActorByIdVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getActorByIdRef(dc: DataConnect, vars: GetActorByIdVariables): QueryRef<GetActorByIdResponse,GetActorByIdVariables>;

export function getActorById(vars: GetActorByIdVariables): QueryPromise<GetActorByIdResponse, GetActorByIdVariables>;
export function getActorById(dc: DataConnect, vars: GetActorByIdVariables): QueryPromise<GetActorByIdResponse,GetActorByIdVariables>;


/* Allow users to create refs without passing in DataConnect */
export function userMoviePreferencesRef(vars: UserMoviePreferencesVariables): QueryRef<UserMoviePreferencesResponse, UserMoviePreferencesVariables>;
/* Allow users to pass in custom DataConnect instances */
export function userMoviePreferencesRef(dc: DataConnect, vars: UserMoviePreferencesVariables): QueryRef<UserMoviePreferencesResponse,UserMoviePreferencesVariables>;

export function userMoviePreferences(vars: UserMoviePreferencesVariables): QueryPromise<UserMoviePreferencesResponse, UserMoviePreferencesVariables>;
export function userMoviePreferences(dc: DataConnect, vars: UserMoviePreferencesVariables): QueryPromise<UserMoviePreferencesResponse,UserMoviePreferencesVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getMovieMetadataRef(vars: GetMovieMetadataVariables): QueryRef<GetMovieMetadataResponse, GetMovieMetadataVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getMovieMetadataRef(dc: DataConnect, vars: GetMovieMetadataVariables): QueryRef<GetMovieMetadataResponse,GetMovieMetadataVariables>;

export function getMovieMetadata(vars: GetMovieMetadataVariables): QueryPromise<GetMovieMetadataResponse, GetMovieMetadataVariables>;
export function getMovieMetadata(dc: DataConnect, vars: GetMovieMetadataVariables): QueryPromise<GetMovieMetadataResponse,GetMovieMetadataVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getMovieCastRef(vars: GetMovieCastVariables): QueryRef<GetMovieCastResponse, GetMovieCastVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getMovieCastRef(dc: DataConnect, vars: GetMovieCastVariables): QueryRef<GetMovieCastResponse,GetMovieCastVariables>;

export function getMovieCast(vars: GetMovieCastVariables): QueryPromise<GetMovieCastResponse, GetMovieCastVariables>;
export function getMovieCast(dc: DataConnect, vars: GetMovieCastVariables): QueryPromise<GetMovieCastResponse,GetMovieCastVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesByPartialTitleRef(vars: ListMoviesByPartialTitleVariables): QueryRef<ListMoviesByPartialTitleResponse, ListMoviesByPartialTitleVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listMoviesByPartialTitleRef(dc: DataConnect, vars: ListMoviesByPartialTitleVariables): QueryRef<ListMoviesByPartialTitleResponse,ListMoviesByPartialTitleVariables>;

export function listMoviesByPartialTitle(vars: ListMoviesByPartialTitleVariables): QueryPromise<ListMoviesByPartialTitleResponse, ListMoviesByPartialTitleVariables>;
export function listMoviesByPartialTitle(dc: DataConnect, vars: ListMoviesByPartialTitleVariables): QueryPromise<ListMoviesByPartialTitleResponse,ListMoviesByPartialTitleVariables>;


/* Allow users to create refs without passing in DataConnect */
export function movieByKeyRef(vars: MovieByKeyVariables): QueryRef<MovieByKeyResponse, MovieByKeyVariables>;
/* Allow users to pass in custom DataConnect instances */
export function movieByKeyRef(dc: DataConnect, vars: MovieByKeyVariables): QueryRef<MovieByKeyResponse,MovieByKeyVariables>;

export function movieByKey(vars: MovieByKeyVariables): QueryPromise<MovieByKeyResponse, MovieByKeyVariables>;
export function movieByKey(dc: DataConnect, vars: MovieByKeyVariables): QueryPromise<MovieByKeyResponse,MovieByKeyVariables>;


/* Allow users to create refs without passing in DataConnect */
export function movieByTitleRef(vars: MovieByTitleVariables): QueryRef<MovieByTitleResponse, MovieByTitleVariables>;
/* Allow users to pass in custom DataConnect instances */
export function movieByTitleRef(dc: DataConnect, vars: MovieByTitleVariables): QueryRef<MovieByTitleResponse,MovieByTitleVariables>;

export function movieByTitle(vars: MovieByTitleVariables): QueryPromise<MovieByTitleResponse, MovieByTitleVariables>;
export function movieByTitle(dc: DataConnect, vars: MovieByTitleVariables): QueryPromise<MovieByTitleResponse,MovieByTitleVariables>;


/* Allow users to create refs without passing in DataConnect */
export function movieByTopRatingRef(vars?: MovieByTopRatingVariables): QueryRef<MovieByTopRatingResponse, MovieByTopRatingVariables>;
/* Allow users to pass in custom DataConnect instances */
export function movieByTopRatingRef(dc: DataConnect, vars?: MovieByTopRatingVariables): QueryRef<MovieByTopRatingResponse,MovieByTopRatingVariables>;

export function movieByTopRating(vars?: MovieByTopRatingVariables): QueryPromise<MovieByTopRatingResponse, MovieByTopRatingVariables>;
export function movieByTopRating(dc: DataConnect, vars?: MovieByTopRatingVariables): QueryPromise<MovieByTopRatingResponse,MovieByTopRatingVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesByTagRef(vars: ListMoviesByTagVariables): QueryRef<ListMoviesByTagResponse, ListMoviesByTagVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listMoviesByTagRef(dc: DataConnect, vars: ListMoviesByTagVariables): QueryRef<ListMoviesByTagResponse,ListMoviesByTagVariables>;

export function listMoviesByTag(vars: ListMoviesByTagVariables): QueryPromise<ListMoviesByTagResponse, ListMoviesByTagVariables>;
export function listMoviesByTag(dc: DataConnect, vars: ListMoviesByTagVariables): QueryPromise<ListMoviesByTagResponse,ListMoviesByTagVariables>;


/* Allow users to create refs without passing in DataConnect */
export function moviesTop10Ref(): QueryRef<MoviesTop10Response, undefined>;/* Allow users to pass in custom DataConnect instances */
export function moviesTop10Ref(dc: DataConnect): QueryRef<MoviesTop10Response,undefined>;

export function moviesTop10(): QueryPromise<MoviesTop10Response, undefined>;
export function moviesTop10(dc: DataConnect): QueryPromise<MoviesTop10Response,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function moviesByReleaseYearRef(vars?: MoviesByReleaseYearVariables): QueryRef<MoviesByReleaseYearResponse, MoviesByReleaseYearVariables>;
/* Allow users to pass in custom DataConnect instances */
export function moviesByReleaseYearRef(dc: DataConnect, vars?: MoviesByReleaseYearVariables): QueryRef<MoviesByReleaseYearResponse,MoviesByReleaseYearVariables>;

export function moviesByReleaseYear(vars?: MoviesByReleaseYearVariables): QueryPromise<MoviesByReleaseYearResponse, MoviesByReleaseYearVariables>;
export function moviesByReleaseYear(dc: DataConnect, vars?: MoviesByReleaseYearVariables): QueryPromise<MoviesByReleaseYearResponse,MoviesByReleaseYearVariables>;


/* Allow users to create refs without passing in DataConnect */
export function moviesRecentlyReleasedRef(): QueryRef<MoviesRecentlyReleasedResponse, undefined>;/* Allow users to pass in custom DataConnect instances */
export function moviesRecentlyReleasedRef(dc: DataConnect): QueryRef<MoviesRecentlyReleasedResponse,undefined>;

export function moviesRecentlyReleased(): QueryPromise<MoviesRecentlyReleasedResponse, undefined>;
export function moviesRecentlyReleased(dc: DataConnect): QueryPromise<MoviesRecentlyReleasedResponse,undefined>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesFilterRef(vars?: ListMoviesFilterVariables): QueryRef<ListMoviesFilterResponse, ListMoviesFilterVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listMoviesFilterRef(dc: DataConnect, vars?: ListMoviesFilterVariables): QueryRef<ListMoviesFilterResponse,ListMoviesFilterVariables>;

export function listMoviesFilter(vars?: ListMoviesFilterVariables): QueryPromise<ListMoviesFilterResponse, ListMoviesFilterVariables>;
export function listMoviesFilter(dc: DataConnect, vars?: ListMoviesFilterVariables): QueryPromise<ListMoviesFilterResponse,ListMoviesFilterVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesByTitleStringRef(vars?: ListMoviesByTitleStringVariables): QueryRef<ListMoviesByTitleStringResponse, ListMoviesByTitleStringVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listMoviesByTitleStringRef(dc: DataConnect, vars?: ListMoviesByTitleStringVariables): QueryRef<ListMoviesByTitleStringResponse,ListMoviesByTitleStringVariables>;

export function listMoviesByTitleString(vars?: ListMoviesByTitleStringVariables): QueryPromise<ListMoviesByTitleStringResponse, ListMoviesByTitleStringVariables>;
export function listMoviesByTitleString(dc: DataConnect, vars?: ListMoviesByTitleStringVariables): QueryPromise<ListMoviesByTitleStringResponse,ListMoviesByTitleStringVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesByRatingAndGenreRef(vars: ListMoviesByRatingAndGenreVariables): QueryRef<ListMoviesByRatingAndGenreResponse, ListMoviesByRatingAndGenreVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listMoviesByRatingAndGenreRef(dc: DataConnect, vars: ListMoviesByRatingAndGenreVariables): QueryRef<ListMoviesByRatingAndGenreResponse,ListMoviesByRatingAndGenreVariables>;

export function listMoviesByRatingAndGenre(vars: ListMoviesByRatingAndGenreVariables): QueryPromise<ListMoviesByRatingAndGenreResponse, ListMoviesByRatingAndGenreVariables>;
export function listMoviesByRatingAndGenre(dc: DataConnect, vars: ListMoviesByRatingAndGenreVariables): QueryPromise<ListMoviesByRatingAndGenreResponse,ListMoviesByRatingAndGenreVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getFavoriteMoviesByIdRef(vars: GetFavoriteMoviesByIdVariables): QueryRef<GetFavoriteMoviesByIdResponse, GetFavoriteMoviesByIdVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getFavoriteMoviesByIdRef(dc: DataConnect, vars: GetFavoriteMoviesByIdVariables): QueryRef<GetFavoriteMoviesByIdResponse,GetFavoriteMoviesByIdVariables>;

export function getFavoriteMoviesById(vars: GetFavoriteMoviesByIdVariables): QueryPromise<GetFavoriteMoviesByIdResponse, GetFavoriteMoviesByIdVariables>;
export function getFavoriteMoviesById(dc: DataConnect, vars: GetFavoriteMoviesByIdVariables): QueryPromise<GetFavoriteMoviesByIdResponse,GetFavoriteMoviesByIdVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getFavoriteActorsByIdRef(vars: GetFavoriteActorsByIdVariables): QueryRef<GetFavoriteActorsByIdResponse, GetFavoriteActorsByIdVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getFavoriteActorsByIdRef(dc: DataConnect, vars: GetFavoriteActorsByIdVariables): QueryRef<GetFavoriteActorsByIdResponse,GetFavoriteActorsByIdVariables>;

export function getFavoriteActorsById(vars: GetFavoriteActorsByIdVariables): QueryPromise<GetFavoriteActorsByIdResponse, GetFavoriteActorsByIdVariables>;
export function getFavoriteActorsById(dc: DataConnect, vars: GetFavoriteActorsByIdVariables): QueryPromise<GetFavoriteActorsByIdResponse,GetFavoriteActorsByIdVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getWatchedMoviesByAuthIdRef(vars: GetWatchedMoviesByAuthIdVariables): QueryRef<GetWatchedMoviesByAuthIdResponse, GetWatchedMoviesByAuthIdVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getWatchedMoviesByAuthIdRef(dc: DataConnect, vars: GetWatchedMoviesByAuthIdVariables): QueryRef<GetWatchedMoviesByAuthIdResponse,GetWatchedMoviesByAuthIdVariables>;

export function getWatchedMoviesByAuthId(vars: GetWatchedMoviesByAuthIdVariables): QueryPromise<GetWatchedMoviesByAuthIdResponse, GetWatchedMoviesByAuthIdVariables>;
export function getWatchedMoviesByAuthId(dc: DataConnect, vars: GetWatchedMoviesByAuthIdVariables): QueryPromise<GetWatchedMoviesByAuthIdResponse,GetWatchedMoviesByAuthIdVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getUserByIdRef(vars: GetUserByIdVariables): QueryRef<GetUserByIdResponse, GetUserByIdVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getUserByIdRef(dc: DataConnect, vars: GetUserByIdVariables): QueryRef<GetUserByIdResponse,GetUserByIdVariables>;

export function getUserById(vars: GetUserByIdVariables): QueryPromise<GetUserByIdResponse, GetUserByIdVariables>;
export function getUserById(dc: DataConnect, vars: GetUserByIdVariables): QueryPromise<GetUserByIdResponse,GetUserByIdVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getIfWatchedRef(vars: GetIfWatchedVariables): QueryRef<GetIfWatchedResponse, GetIfWatchedVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getIfWatchedRef(dc: DataConnect, vars: GetIfWatchedVariables): QueryRef<GetIfWatchedResponse,GetIfWatchedVariables>;

export function getIfWatched(vars: GetIfWatchedVariables): QueryPromise<GetIfWatchedResponse, GetIfWatchedVariables>;
export function getIfWatched(dc: DataConnect, vars: GetIfWatchedVariables): QueryPromise<GetIfWatchedResponse,GetIfWatchedVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getIfFavoritedMovieRef(vars: GetIfFavoritedMovieVariables): QueryRef<GetIfFavoritedMovieResponse, GetIfFavoritedMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getIfFavoritedMovieRef(dc: DataConnect, vars: GetIfFavoritedMovieVariables): QueryRef<GetIfFavoritedMovieResponse,GetIfFavoritedMovieVariables>;

export function getIfFavoritedMovie(vars: GetIfFavoritedMovieVariables): QueryPromise<GetIfFavoritedMovieResponse, GetIfFavoritedMovieVariables>;
export function getIfFavoritedMovie(dc: DataConnect, vars: GetIfFavoritedMovieVariables): QueryPromise<GetIfFavoritedMovieResponse,GetIfFavoritedMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function getIfFavoritedActorRef(vars: GetIfFavoritedActorVariables): QueryRef<GetIfFavoritedActorResponse, GetIfFavoritedActorVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getIfFavoritedActorRef(dc: DataConnect, vars: GetIfFavoritedActorVariables): QueryRef<GetIfFavoritedActorResponse,GetIfFavoritedActorVariables>;

export function getIfFavoritedActor(vars: GetIfFavoritedActorVariables): QueryPromise<GetIfFavoritedActorResponse, GetIfFavoritedActorVariables>;
export function getIfFavoritedActor(dc: DataConnect, vars: GetIfFavoritedActorVariables): QueryPromise<GetIfFavoritedActorResponse,GetIfFavoritedActorVariables>;


/* Allow users to create refs without passing in DataConnect */
export function fuzzySearchRef(vars: FuzzySearchVariables): QueryRef<FuzzySearchResponse, FuzzySearchVariables>;
/* Allow users to pass in custom DataConnect instances */
export function fuzzySearchRef(dc: DataConnect, vars: FuzzySearchVariables): QueryRef<FuzzySearchResponse,FuzzySearchVariables>;

export function fuzzySearch(vars: FuzzySearchVariables): QueryPromise<FuzzySearchResponse, FuzzySearchVariables>;
export function fuzzySearch(dc: DataConnect, vars: FuzzySearchVariables): QueryPromise<FuzzySearchResponse,FuzzySearchVariables>;


/* Allow users to create refs without passing in DataConnect */
export function searchMovieDescriptionUsingL2similarityRef(vars: SearchMovieDescriptionUsingL2similarityVariables): QueryRef<SearchMovieDescriptionUsingL2similarityResponse, SearchMovieDescriptionUsingL2similarityVariables>;
/* Allow users to pass in custom DataConnect instances */
export function searchMovieDescriptionUsingL2similarityRef(dc: DataConnect, vars: SearchMovieDescriptionUsingL2similarityVariables): QueryRef<SearchMovieDescriptionUsingL2similarityResponse,SearchMovieDescriptionUsingL2similarityVariables>;

export function searchMovieDescriptionUsingL2similarity(vars: SearchMovieDescriptionUsingL2similarityVariables): QueryPromise<SearchMovieDescriptionUsingL2similarityResponse, SearchMovieDescriptionUsingL2similarityVariables>;
export function searchMovieDescriptionUsingL2similarity(dc: DataConnect, vars: SearchMovieDescriptionUsingL2similarityVariables): QueryPromise<SearchMovieDescriptionUsingL2similarityResponse,SearchMovieDescriptionUsingL2similarityVariables>;


