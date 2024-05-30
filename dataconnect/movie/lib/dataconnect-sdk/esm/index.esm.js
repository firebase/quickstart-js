import { getDataConnect, queryRef, executeQuery, mutationRef, executeMutation } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'movie-connector',
  service: 'dataconnect',
  location: 'us-central1'
};

export function createMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'createMovie', inputVars);
}
export function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
}
export function updateMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'updateMovie', inputVars);
}
export function updateMovie(dcOrVars, vars) {
  return executeMutation(updateMovieRef(dcOrVars, vars));
}
export function deleteMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteMovie', inputVars);
}
export function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
}
export function deleteUnpopularMoviesRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteUnpopularMovies', inputVars);
}
export function deleteUnpopularMovies(dcOrVars, vars) {
  return executeMutation(deleteUnpopularMoviesRef(dcOrVars, vars));
}
export function addWatchedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'addWatchedMovie', inputVars);
}
export function addWatchedMovie(dcOrVars, vars) {
  return executeMutation(addWatchedMovieRef(dcOrVars, vars));
}
export function deleteWatchedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteWatchedMovie', inputVars);
}
export function deleteWatchedMovie(dcOrVars, vars) {
  return executeMutation(deleteWatchedMovieRef(dcOrVars, vars));
}
export function addFavoritedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'addFavoritedMovie', inputVars);
}
export function addFavoritedMovie(dcOrVars, vars) {
  return executeMutation(addFavoritedMovieRef(dcOrVars, vars));
}
export function deleteFavoritedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteFavoritedMovie', inputVars);
}
export function deleteFavoritedMovie(dcOrVars, vars) {
  return executeMutation(deleteFavoritedMovieRef(dcOrVars, vars));
}
export function addFavoritedActorRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'addFavoritedActor', inputVars);
}
export function addFavoritedActor(dcOrVars, vars) {
  return executeMutation(addFavoritedActorRef(dcOrVars, vars));
}
export function deleteFavoriteActorRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteFavoriteActor', inputVars);
}
export function deleteFavoriteActor(dcOrVars, vars) {
  return executeMutation(deleteFavoriteActorRef(dcOrVars, vars));
}
export function addReviewRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'addReview', inputVars);
}
export function addReview(dcOrVars, vars) {
  return executeMutation(addReviewRef(dcOrVars, vars));
}
export function deleteReviewRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteReview', inputVars);
}
export function deleteReview(dcOrVars, vars) {
  return executeMutation(deleteReviewRef(dcOrVars, vars));
}
export function upsertUserRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'upsertUser', inputVars);
}
export function upsertUser(dcOrVars, vars) {
  return executeMutation(upsertUserRef(dcOrVars, vars));
}
export function listMoviesRef(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'ListMovies');
}
export function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
}
export function listUsersRef(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'ListUsers');
}
export function listUsers(dc) {
  return executeQuery(listUsersRef(dc));
}
export function listMoviesByGenreRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'ListMoviesByGenre', inputVars);
}
export function listMoviesByGenre(dcOrVars, vars) {
  return executeQuery(listMoviesByGenreRef(dcOrVars, vars));
}
export function listMoviesByReleaseYearRef(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'ListMoviesByReleaseYear');
}
export function listMoviesByReleaseYear(dc) {
  return executeQuery(listMoviesByReleaseYearRef(dc));
}
export function getMovieByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetMovieById', inputVars);
}
export function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
}
export function getActorByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetActorById', inputVars);
}
export function getActorById(dcOrVars, vars) {
  return executeQuery(getActorByIdRef(dcOrVars, vars));
}
export function userMoviePreferencesRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'UserMoviePreferences', inputVars);
}
export function userMoviePreferences(dcOrVars, vars) {
  return executeQuery(userMoviePreferencesRef(dcOrVars, vars));
}
export function getMovieMetadataRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetMovieMetadata', inputVars);
}
export function getMovieMetadata(dcOrVars, vars) {
  return executeQuery(getMovieMetadataRef(dcOrVars, vars));
}
export function getMovieCastRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetMovieCast', inputVars);
}
export function getMovieCast(dcOrVars, vars) {
  return executeQuery(getMovieCastRef(dcOrVars, vars));
}
export function listMoviesByPartialTitleRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'ListMoviesByPartialTitle', inputVars);
}
export function listMoviesByPartialTitle(dcOrVars, vars) {
  return executeQuery(listMoviesByPartialTitleRef(dcOrVars, vars));
}
export function movieByKeyRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'MovieByKey', inputVars);
}
export function movieByKey(dcOrVars, vars) {
  return executeQuery(movieByKeyRef(dcOrVars, vars));
}
export function movieByTitleRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'MovieByTitle', inputVars);
}
export function movieByTitle(dcOrVars, vars) {
  return executeQuery(movieByTitleRef(dcOrVars, vars));
}
export function movieByTopRatingRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars);
  return queryRef(dcInstance, 'MovieByTopRating', inputVars);
}
export function movieByTopRating(dcOrVars, vars) {
  return executeQuery(movieByTopRatingRef(dcOrVars, vars));
}
export function listMoviesByTagRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'ListMoviesByTag', inputVars);
}
export function listMoviesByTag(dcOrVars, vars) {
  return executeQuery(listMoviesByTagRef(dcOrVars, vars));
}
export function moviesTop10Ref(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'MoviesTop10');
}
export function moviesTop10(dc) {
  return executeQuery(moviesTop10Ref(dc));
}
export function moviesByReleaseYearRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars);
  return queryRef(dcInstance, 'MoviesByReleaseYear', inputVars);
}
export function moviesByReleaseYear(dcOrVars, vars) {
  return executeQuery(moviesByReleaseYearRef(dcOrVars, vars));
}
export function moviesRecentlyReleasedRef(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'MoviesRecentlyReleased');
}
export function moviesRecentlyReleased(dc) {
  return executeQuery(moviesRecentlyReleasedRef(dc));
}
export function listMoviesFilterRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars);
  return queryRef(dcInstance, 'ListMoviesFilter', inputVars);
}
export function listMoviesFilter(dcOrVars, vars) {
  return executeQuery(listMoviesFilterRef(dcOrVars, vars));
}
export function listMoviesByTitleStringRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars);
  return queryRef(dcInstance, 'ListMoviesByTitleString', inputVars);
}
export function listMoviesByTitleString(dcOrVars, vars) {
  return executeQuery(listMoviesByTitleStringRef(dcOrVars, vars));
}
export function listMoviesByRatingAndGenreRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'ListMoviesByRatingAndGenre', inputVars);
}
export function listMoviesByRatingAndGenre(dcOrVars, vars) {
  return executeQuery(listMoviesByRatingAndGenreRef(dcOrVars, vars));
}
export function getFavoriteMoviesByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetFavoriteMoviesById', inputVars);
}
export function getFavoriteMoviesById(dcOrVars, vars) {
  return executeQuery(getFavoriteMoviesByIdRef(dcOrVars, vars));
}
export function getFavoriteActorsByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetFavoriteActorsById', inputVars);
}
export function getFavoriteActorsById(dcOrVars, vars) {
  return executeQuery(getFavoriteActorsByIdRef(dcOrVars, vars));
}
export function getWatchedMoviesByAuthIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetWatchedMoviesByAuthId', inputVars);
}
export function getWatchedMoviesByAuthId(dcOrVars, vars) {
  return executeQuery(getWatchedMoviesByAuthIdRef(dcOrVars, vars));
}
export function getUserByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetUserById', inputVars);
}
export function getUserById(dcOrVars, vars) {
  return executeQuery(getUserByIdRef(dcOrVars, vars));
}
export function getIfWatchedRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetIfWatched', inputVars);
}
export function getIfWatched(dcOrVars, vars) {
  return executeQuery(getIfWatchedRef(dcOrVars, vars));
}
export function getIfFavoritedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetIfFavoritedMovie', inputVars);
}
export function getIfFavoritedMovie(dcOrVars, vars) {
  return executeQuery(getIfFavoritedMovieRef(dcOrVars, vars));
}
export function getIfFavoritedActorRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetIfFavoritedActor', inputVars);
}
export function getIfFavoritedActor(dcOrVars, vars) {
  return executeQuery(getIfFavoritedActorRef(dcOrVars, vars));
}
export function fuzzySearchRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'fuzzySearch', inputVars);
}
export function fuzzySearch(dcOrVars, vars) {
  return executeQuery(fuzzySearchRef(dcOrVars, vars));
}
export function searchMovieDescriptionUsingL2similarityRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'searchMovieDescriptionUsingL2Similarity', inputVars);
}
export function searchMovieDescriptionUsingL2similarity(dcOrVars, vars) {
  return executeQuery(searchMovieDescriptionUsingL2similarityRef(dcOrVars, vars));
}
function validateArgs(dcOrVars, vars, validateVars) {
  let dcInstance;
  let realVars;
  // TODO; Check what happens if this is undefined.
  if(dcOrVars && 'dataConnectOptions' in dcOrVars) {
      dcInstance = dcOrVars;
      realVars = vars;
  } else {
      dcInstance = getDataConnect(connectorConfig);
      realVars = dcOrVars;
  }
  if(!dcInstance || (!realVars && validateVars)) {
      throw new Error('You didn\t pass in the vars!');
  }
  return { dc: dcInstance, vars: realVars };
}