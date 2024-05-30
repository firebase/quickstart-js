const { getDataConnect, queryRef, executeQuery, mutationRef, executeMutation } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'movie-connector',
  service: 'dataconnect',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

function createMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'createMovie', inputVars);
}
exports.createMovieRef = createMovieRef;
exports.createMovie = function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
};

function updateMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'updateMovie', inputVars);
}
exports.updateMovieRef = updateMovieRef;
exports.updateMovie = function updateMovie(dcOrVars, vars) {
  return executeMutation(updateMovieRef(dcOrVars, vars));
};

function deleteMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteMovie', inputVars);
}
exports.deleteMovieRef = deleteMovieRef;
exports.deleteMovie = function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
};

function deleteUnpopularMoviesRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteUnpopularMovies', inputVars);
}
exports.deleteUnpopularMoviesRef = deleteUnpopularMoviesRef;
exports.deleteUnpopularMovies = function deleteUnpopularMovies(dcOrVars, vars) {
  return executeMutation(deleteUnpopularMoviesRef(dcOrVars, vars));
};

function addWatchedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'addWatchedMovie', inputVars);
}
exports.addWatchedMovieRef = addWatchedMovieRef;
exports.addWatchedMovie = function addWatchedMovie(dcOrVars, vars) {
  return executeMutation(addWatchedMovieRef(dcOrVars, vars));
};

function deleteWatchedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteWatchedMovie', inputVars);
}
exports.deleteWatchedMovieRef = deleteWatchedMovieRef;
exports.deleteWatchedMovie = function deleteWatchedMovie(dcOrVars, vars) {
  return executeMutation(deleteWatchedMovieRef(dcOrVars, vars));
};

function addFavoritedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'addFavoritedMovie', inputVars);
}
exports.addFavoritedMovieRef = addFavoritedMovieRef;
exports.addFavoritedMovie = function addFavoritedMovie(dcOrVars, vars) {
  return executeMutation(addFavoritedMovieRef(dcOrVars, vars));
};

function deleteFavoritedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteFavoritedMovie', inputVars);
}
exports.deleteFavoritedMovieRef = deleteFavoritedMovieRef;
exports.deleteFavoritedMovie = function deleteFavoritedMovie(dcOrVars, vars) {
  return executeMutation(deleteFavoritedMovieRef(dcOrVars, vars));
};

function addFavoritedActorRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'addFavoritedActor', inputVars);
}
exports.addFavoritedActorRef = addFavoritedActorRef;
exports.addFavoritedActor = function addFavoritedActor(dcOrVars, vars) {
  return executeMutation(addFavoritedActorRef(dcOrVars, vars));
};

function deleteFavoriteActorRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteFavoriteActor', inputVars);
}
exports.deleteFavoriteActorRef = deleteFavoriteActorRef;
exports.deleteFavoriteActor = function deleteFavoriteActor(dcOrVars, vars) {
  return executeMutation(deleteFavoriteActorRef(dcOrVars, vars));
};

function addReviewRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'addReview', inputVars);
}
exports.addReviewRef = addReviewRef;
exports.addReview = function addReview(dcOrVars, vars) {
  return executeMutation(addReviewRef(dcOrVars, vars));
};

function deleteReviewRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'deleteReview', inputVars);
}
exports.deleteReviewRef = deleteReviewRef;
exports.deleteReview = function deleteReview(dcOrVars, vars) {
  return executeMutation(deleteReviewRef(dcOrVars, vars));
};

function upsertUserRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return mutationRef(dcInstance, 'upsertUser', inputVars);
}
exports.upsertUserRef = upsertUserRef;
exports.upsertUser = function upsertUser(dcOrVars, vars) {
  return executeMutation(upsertUserRef(dcOrVars, vars));
};

function listMoviesRef(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'ListMovies');
}
exports.listMoviesRef = listMoviesRef;
exports.listMovies = function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
};

function listUsersRef(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'ListUsers');
}
exports.listUsersRef = listUsersRef;
exports.listUsers = function listUsers(dc) {
  return executeQuery(listUsersRef(dc));
};

function listMoviesByGenreRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'ListMoviesByGenre', inputVars);
}
exports.listMoviesByGenreRef = listMoviesByGenreRef;
exports.listMoviesByGenre = function listMoviesByGenre(dcOrVars, vars) {
  return executeQuery(listMoviesByGenreRef(dcOrVars, vars));
};

function listMoviesByReleaseYearRef(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'ListMoviesByReleaseYear');
}
exports.listMoviesByReleaseYearRef = listMoviesByReleaseYearRef;
exports.listMoviesByReleaseYear = function listMoviesByReleaseYear(dc) {
  return executeQuery(listMoviesByReleaseYearRef(dc));
};

function getMovieByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetMovieById', inputVars);
}
exports.getMovieByIdRef = getMovieByIdRef;
exports.getMovieById = function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
};

function getActorByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetActorById', inputVars);
}
exports.getActorByIdRef = getActorByIdRef;
exports.getActorById = function getActorById(dcOrVars, vars) {
  return executeQuery(getActorByIdRef(dcOrVars, vars));
};

function userMoviePreferencesRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'UserMoviePreferences', inputVars);
}
exports.userMoviePreferencesRef = userMoviePreferencesRef;
exports.userMoviePreferences = function userMoviePreferences(dcOrVars, vars) {
  return executeQuery(userMoviePreferencesRef(dcOrVars, vars));
};

function getMovieMetadataRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetMovieMetadata', inputVars);
}
exports.getMovieMetadataRef = getMovieMetadataRef;
exports.getMovieMetadata = function getMovieMetadata(dcOrVars, vars) {
  return executeQuery(getMovieMetadataRef(dcOrVars, vars));
};

function getMovieCastRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetMovieCast', inputVars);
}
exports.getMovieCastRef = getMovieCastRef;
exports.getMovieCast = function getMovieCast(dcOrVars, vars) {
  return executeQuery(getMovieCastRef(dcOrVars, vars));
};

function listMoviesByPartialTitleRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'ListMoviesByPartialTitle', inputVars);
}
exports.listMoviesByPartialTitleRef = listMoviesByPartialTitleRef;
exports.listMoviesByPartialTitle = function listMoviesByPartialTitle(dcOrVars, vars) {
  return executeQuery(listMoviesByPartialTitleRef(dcOrVars, vars));
};

function movieByKeyRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'MovieByKey', inputVars);
}
exports.movieByKeyRef = movieByKeyRef;
exports.movieByKey = function movieByKey(dcOrVars, vars) {
  return executeQuery(movieByKeyRef(dcOrVars, vars));
};

function movieByTitleRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'MovieByTitle', inputVars);
}
exports.movieByTitleRef = movieByTitleRef;
exports.movieByTitle = function movieByTitle(dcOrVars, vars) {
  return executeQuery(movieByTitleRef(dcOrVars, vars));
};

function movieByTopRatingRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars);
  return queryRef(dcInstance, 'MovieByTopRating', inputVars);
}
exports.movieByTopRatingRef = movieByTopRatingRef;
exports.movieByTopRating = function movieByTopRating(dcOrVars, vars) {
  return executeQuery(movieByTopRatingRef(dcOrVars, vars));
};

function listMoviesByTagRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'ListMoviesByTag', inputVars);
}
exports.listMoviesByTagRef = listMoviesByTagRef;
exports.listMoviesByTag = function listMoviesByTag(dcOrVars, vars) {
  return executeQuery(listMoviesByTagRef(dcOrVars, vars));
};

function moviesTop10Ref(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'MoviesTop10');
}
exports.moviesTop10Ref = moviesTop10Ref;
exports.moviesTop10 = function moviesTop10(dc) {
  return executeQuery(moviesTop10Ref(dc));
};

function moviesByReleaseYearRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars);
  return queryRef(dcInstance, 'MoviesByReleaseYear', inputVars);
}
exports.moviesByReleaseYearRef = moviesByReleaseYearRef;
exports.moviesByReleaseYear = function moviesByReleaseYear(dcOrVars, vars) {
  return executeQuery(moviesByReleaseYearRef(dcOrVars, vars));
};

function moviesRecentlyReleasedRef(dc) {
  const { dc: dcInstance} = validateArgs(dc, undefined);
  return queryRef(dcInstance, 'MoviesRecentlyReleased');
}
exports.moviesRecentlyReleasedRef = moviesRecentlyReleasedRef;
exports.moviesRecentlyReleased = function moviesRecentlyReleased(dc) {
  return executeQuery(moviesRecentlyReleasedRef(dc));
};

function listMoviesFilterRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars);
  return queryRef(dcInstance, 'ListMoviesFilter', inputVars);
}
exports.listMoviesFilterRef = listMoviesFilterRef;
exports.listMoviesFilter = function listMoviesFilter(dcOrVars, vars) {
  return executeQuery(listMoviesFilterRef(dcOrVars, vars));
};

function listMoviesByTitleStringRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars);
  return queryRef(dcInstance, 'ListMoviesByTitleString', inputVars);
}
exports.listMoviesByTitleStringRef = listMoviesByTitleStringRef;
exports.listMoviesByTitleString = function listMoviesByTitleString(dcOrVars, vars) {
  return executeQuery(listMoviesByTitleStringRef(dcOrVars, vars));
};

function listMoviesByRatingAndGenreRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'ListMoviesByRatingAndGenre', inputVars);
}
exports.listMoviesByRatingAndGenreRef = listMoviesByRatingAndGenreRef;
exports.listMoviesByRatingAndGenre = function listMoviesByRatingAndGenre(dcOrVars, vars) {
  return executeQuery(listMoviesByRatingAndGenreRef(dcOrVars, vars));
};

function getFavoriteMoviesByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetFavoriteMoviesById', inputVars);
}
exports.getFavoriteMoviesByIdRef = getFavoriteMoviesByIdRef;
exports.getFavoriteMoviesById = function getFavoriteMoviesById(dcOrVars, vars) {
  return executeQuery(getFavoriteMoviesByIdRef(dcOrVars, vars));
};

function getFavoriteActorsByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetFavoriteActorsById', inputVars);
}
exports.getFavoriteActorsByIdRef = getFavoriteActorsByIdRef;
exports.getFavoriteActorsById = function getFavoriteActorsById(dcOrVars, vars) {
  return executeQuery(getFavoriteActorsByIdRef(dcOrVars, vars));
};

function getWatchedMoviesByAuthIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetWatchedMoviesByAuthId', inputVars);
}
exports.getWatchedMoviesByAuthIdRef = getWatchedMoviesByAuthIdRef;
exports.getWatchedMoviesByAuthId = function getWatchedMoviesByAuthId(dcOrVars, vars) {
  return executeQuery(getWatchedMoviesByAuthIdRef(dcOrVars, vars));
};

function getUserByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetUserById', inputVars);
}
exports.getUserByIdRef = getUserByIdRef;
exports.getUserById = function getUserById(dcOrVars, vars) {
  return executeQuery(getUserByIdRef(dcOrVars, vars));
};

function getIfWatchedRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetIfWatched', inputVars);
}
exports.getIfWatchedRef = getIfWatchedRef;
exports.getIfWatched = function getIfWatched(dcOrVars, vars) {
  return executeQuery(getIfWatchedRef(dcOrVars, vars));
};

function getIfFavoritedMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetIfFavoritedMovie', inputVars);
}
exports.getIfFavoritedMovieRef = getIfFavoritedMovieRef;
exports.getIfFavoritedMovie = function getIfFavoritedMovie(dcOrVars, vars) {
  return executeQuery(getIfFavoritedMovieRef(dcOrVars, vars));
};

function getIfFavoritedActorRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'GetIfFavoritedActor', inputVars);
}
exports.getIfFavoritedActorRef = getIfFavoritedActorRef;
exports.getIfFavoritedActor = function getIfFavoritedActor(dcOrVars, vars) {
  return executeQuery(getIfFavoritedActorRef(dcOrVars, vars));
};

function fuzzySearchRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'fuzzySearch', inputVars);
}
exports.fuzzySearchRef = fuzzySearchRef;
exports.fuzzySearch = function fuzzySearch(dcOrVars, vars) {
  return executeQuery(fuzzySearchRef(dcOrVars, vars));
};

function searchMovieDescriptionUsingL2similarityRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(dcOrVars, vars, true);
  return queryRef(dcInstance, 'searchMovieDescriptionUsingL2Similarity', inputVars);
}
exports.searchMovieDescriptionUsingL2similarityRef = searchMovieDescriptionUsingL2similarityRef;
exports.searchMovieDescriptionUsingL2similarity = function searchMovieDescriptionUsingL2similarity(dcOrVars, vars) {
  return executeQuery(searchMovieDescriptionUsingL2similarityRef(dcOrVars, vars));
};

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