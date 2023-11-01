/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  DatabaseReference,
  Query,
  child,
  connectDatabaseEmulator,
  getDatabase,
  limitToLast,
  off,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  runTransaction,
  set,
  update,
} from 'firebase/database';
import { firebaseConfig } from './config';

// We declare variables used on the window object
// We use a custom interface to avoid these modifying the global Window type in other files
interface CustomWindow extends Window {
  // This comes from MDL lite and is used to upgrade the DOM after we have added new elements
  componentHandler?: {
    upgradeElements: (...element: Element[]) => void;
  };
}

interface HTMLElementWithMaterialTextfield extends HTMLElement {
  MaterialTextfield: { boundUpdateClassesHandler: () => void };
}

declare const window: CustomWindow;

initializeApp(firebaseConfig);

const auth = getAuth();
const database = getDatabase();

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectDatabaseEmulator(database, '127.0.0.1', 9000);
}

// Shortcuts to DOM Elements.
const messageForm = document.getElementById('message-form') as HTMLFormElement;
const messageInput = document.getElementById(
  'new-post-message',
) as HTMLTextAreaElement;
const titleInput = document.getElementById(
  'new-post-title',
) as HTMLInputElement;
const signInButton = document.getElementById(
  'sign-in-button',
) as HTMLButtonElement;
const signOutButton = document.getElementById(
  'sign-out-button',
) as HTMLButtonElement;
const splashPage = document.getElementById('page-splash') as HTMLDivElement;
const addPost = document.getElementById('add-post') as HTMLDivElement;
const addButton = document.getElementById('add') as HTMLButtonElement;
const recentPostsSection = document.getElementById(
  'recent-posts-list',
) as HTMLDivElement;
const userPostsSection = document.getElementById(
  'user-posts-list',
) as HTMLDivElement;
const topUserPostsSection = document.getElementById(
  'top-user-posts-list',
) as HTMLDivElement;
const recentMenuButton = document.getElementById(
  'menu-recent',
) as HTMLButtonElement;
const myPostsMenuButton = document.getElementById(
  'menu-my-posts',
) as HTMLButtonElement;
const myTopPostsMenuButton = document.getElementById(
  'menu-my-top-posts',
) as HTMLButtonElement;
let listeningFirebaseRefs: Query[] = [];

interface Post {
  author: string | null;
  uid: string;
  body: string;
  title: string;
  starCount: number;
  authorPic: string | null;
}

/**
 * Saves a new post to the Firebase DB.
 */
function writeNewPost(
  uid: string,
  username: string | null,
  picture: string | null,
  title: string,
  body: string,
) {
  // A post entry.
  const postData: Post = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture,
  };

  // Get a key for a new Post.
  const newPostKey = push(child(ref(database), 'posts')).key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates: Record<string, Post> = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return update(ref(database), updates);
}

/**
 * Star/unstar post.
 */
function toggleStar(postRef: DatabaseReference, uid: string) {
  runTransaction(postRef, function (post) {
    if (post) {
      if (post.stars && post.stars[uid]) {
        post.starCount--;
        post.stars[uid] = null;
      } else {
        post.starCount++;
        if (!post.stars) {
          post.stars = {};
        }
        post.stars[uid] = true;
      }
    }
    return post;
  });
}

/**
 * Creates a post element.
 */
function createPostElement(
  postId: string,
  title: string,
  text: string,
  author?: string,
  authorId?: string,
  authorPic?: string,
) {
  const uid = auth.currentUser!.uid;

  const html =
    '<div class="post post-' +
    postId +
    ' mdl-cell mdl-cell--12-col ' +
    'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
    '<div class="mdl-card mdl-shadow--2dp">' +
    '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
    '<h4 class="mdl-card__title-text"></h4>' +
    '</div>' +
    '<div class="header">' +
    '<div>' +
    '<div class="avatar"></div>' +
    '<div class="username mdl-color-text--black"></div>' +
    '</div>' +
    '</div>' +
    '<span class="star">' +
    '<div class="not-starred material-icons">star_border</div>' +
    '<div class="starred material-icons">star</div>' +
    '<div class="star-count">0</div>' +
    '</span>' +
    '<div class="text"></div>' +
    '<div class="comments-container"></div>' +
    '<form class="add-comment" action="#">' +
    '<div class="mdl-textfield mdl-js-textfield">' +
    '<input class="mdl-textfield__input new-comment" type="text">' +
    '<label class="mdl-textfield__label">Comment...</label>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</div>';

  // Create the DOM element from the HTML.
  const div = document.createElement('div');
  div.innerHTML = html;
  const postElement = div.firstChild as HTMLElement;
  if (window.componentHandler) {
    window.componentHandler.upgradeElements(
      postElement.getElementsByClassName('mdl-textfield')[0],
    );
  }

  const addCommentForm = postElement.getElementsByClassName(
    'add-comment',
  )[0] as HTMLFormElement;
  const commentInput = postElement.getElementsByClassName(
    'new-comment',
  )[0] as HTMLInputElement;
  const star = postElement.getElementsByClassName(
    'starred',
  )[0] as HTMLDivElement;
  const unStar = postElement.getElementsByClassName(
    'not-starred',
  )[0] as HTMLDivElement;

  const textElement = postElement.getElementsByClassName(
    'text',
  )[0] as HTMLDivElement;
  const titleText = postElement.getElementsByClassName(
    'mdl-card__title-text',
  )[0] as HTMLHeadingElement;
  const username = postElement.getElementsByClassName(
    'username',
  )[0] as HTMLDivElement;
  const avatar = postElement.getElementsByClassName(
    'avatar',
  )[0] as HTMLDivElement;

  // Set values.
  textElement.innerText = text;
  titleText.innerText = title;
  username.innerText = author || 'Anonymous';
  avatar.style.backgroundImage =
    'url("' + (authorPic || './silhouette.jpg') + '")';

  // Listen for comments.
  const commentsRef = ref(database, 'post-comments/' + postId);
  onChildAdded(commentsRef, function (data) {
    addCommentElement(
      postElement,
      data.key,
      data.val().text,
      data.val().author,
    );
  });

  onChildChanged(commentsRef, function (data) {
    setCommentValues(
      postElement,
      data.key!,
      data.val().text,
      data.val().author,
    );
  });

  onChildRemoved(commentsRef, function (data) {
    deleteComment(postElement, data.key!);
  });

  // Listen for likes counts.
  const starCountRef = ref(database, 'posts/' + postId + '/starCount');
  onValue(starCountRef, function (snapshot) {
    updateStarCount(postElement, snapshot.val());
  });

  // Listen for the starred status.
  const starredStatusRef = ref(database, 'posts/' + postId + '/stars/' + uid);
  onValue(starredStatusRef, function (snapshot) {
    updateStarredByCurrentUser(postElement, snapshot.val());
  });

  // Keep track of all Firebase reference on which we are listening.
  listeningFirebaseRefs.push(commentsRef);
  listeningFirebaseRefs.push(starCountRef);
  listeningFirebaseRefs.push(starredStatusRef);

  // Create new comment.
  addCommentForm.onsubmit = function (e) {
    e.preventDefault();
    createNewComment(
      postId,
      auth.currentUser!.displayName ?? 'Anonymous',
      uid,
      commentInput.value,
    );
    commentInput.value = '';

    const commentInputParent =
      commentInput.parentElement as HTMLElementWithMaterialTextfield;
    commentInputParent.MaterialTextfield.boundUpdateClassesHandler();
  };

  // Bind starring action.
  const onStarClicked = function () {
    const globalPostRef = ref(database, '/posts/' + postId);
    const userPostRef = ref(database, '/user-posts/' + authorId + '/' + postId);
    toggleStar(globalPostRef, uid);
    toggleStar(userPostRef, uid);
  };
  unStar.onclick = onStarClicked;
  star.onclick = onStarClicked;

  return postElement;
}

/**
 * Writes a new comment for the given post.
 */
function createNewComment(
  postId: string,
  username: string,
  uid: string,
  text: string,
) {
  push(ref(database, 'post-comments/' + postId), {
    text: text,
    author: username,
    uid: uid,
  });
}

/**
 * Updates the starred status of the post.
 */
function updateStarredByCurrentUser(
  postElement: HTMLElement,
  starred: boolean,
) {
  const star = postElement.getElementsByClassName(
    'starred',
  )[0] as HTMLDivElement;
  const unStar = postElement.getElementsByClassName(
    'not-starred',
  )[0] as HTMLDivElement;

  if (starred) {
    star.style.display = 'inline-block';
    unStar.style.display = 'none';
  } else {
    star.style.display = 'none';
    unStar.style.display = 'inline-block';
  }
}

/**
 * Updates the number of stars displayed for a post.
 */
function updateStarCount(postElement: HTMLElement, nbStart: number) {
  (
    postElement.getElementsByClassName('star-count')[0] as HTMLElement
  ).innerText = nbStart.toString();
}

/**
 * Creates a comment element and adds it to the given postElement.
 */
function addCommentElement(
  postElement: HTMLElement,
  id: string | null,
  text: string,
  author: string,
) {
  const comment = document.createElement('div');
  comment.classList.add('comment-' + id);
  comment.innerHTML =
    '<span class="username"></span><span class="comment"></span>';
  (comment.getElementsByClassName('comment')[0] as HTMLSpanElement).innerText =
    text;
  (comment.getElementsByClassName('username')[0] as HTMLSpanElement).innerText =
    author || 'Anonymous';

  const commentsContainer =
    postElement.getElementsByClassName('comments-container')[0];
  commentsContainer.appendChild(comment);
}

/**
 * Sets the comment's values in the given postElement.
 */
function setCommentValues(
  postElement: HTMLElement,
  id: string,
  text: string,
  author: string,
) {
  const comment = postElement.getElementsByClassName('comment-' + id)[0];
  (comment.getElementsByClassName('comment')[0] as HTMLElement).innerText =
    text;
  (comment.getElementsByClassName('fp-username')[0] as HTMLElement).innerText =
    author;
}

/**
 * Deletes the comment of the given ID in the given postElement.
 */
function deleteComment(postElement: HTMLElement, id: string) {
  const comment = postElement.getElementsByClassName('comment-' + id)[0];
  comment.parentElement!.removeChild(comment);
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  const myUserId = auth.currentUser!.uid;
  const topUserPostsRef = query(
    ref(database, 'user-posts/' + myUserId + '/starCount'),
    orderByChild('starCount'),
  );
  const recentPostsRef = query(ref(database, 'posts'), limitToLast(100));
  const userPostsRef = ref(database, 'user-posts/' + myUserId);

  const fetchPosts = function (postsRef: Query, sectionElement: HTMLElement) {
    onChildAdded(postsRef, function (data) {
      const author = data.val().author || 'Anonymous';
      const containerElement =
        sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createPostElement(
          data.key!,
          data.val().title,
          data.val().body,
          author,
          data.val().uid,
          data.val().authorPic,
        ),
        containerElement.firstChild,
      );
    });

    onChildChanged(postsRef, function (data) {
      const containerElement =
        sectionElement.getElementsByClassName('posts-container')[0];
      const postElement = containerElement.getElementsByClassName(
        'post-' + data.key,
      )[0];
      const title = postElement.getElementsByClassName(
        'mdl-card__title-text',
      )[0] as HTMLHeadingElement;
      const text = postElement.getElementsByClassName(
        'text',
      )[0] as HTMLDivElement;
      const username = postElement.getElementsByClassName(
        'username',
      )[0] as HTMLDivElement;
      const starCount = postElement.getElementsByClassName(
        'star-count',
      )[0] as HTMLDivElement;

      title.innerText = data.val().title;
      username.innerText = data.val().author;
      text.innerText = data.val().body;
      starCount.innerText = data.val().starCount;
    });

    onChildRemoved(postsRef, function (data) {
      const containerElement =
        sectionElement.getElementsByClassName('posts-container')[0];
      const post = containerElement.getElementsByClassName(
        'post-' + data.key,
      )[0];
      post.parentElement!.removeChild(post);
    });
  };

  // Fetching and displaying all posts of each sections.
  fetchPosts(topUserPostsRef, topUserPostsSection);
  fetchPosts(recentPostsRef, recentPostsSection);
  fetchPosts(userPostsRef, userPostsSection);

  // Keep track of all Firebase refs we are listening to.
  listeningFirebaseRefs.push(topUserPostsRef);
  listeningFirebaseRefs.push(recentPostsRef);
  listeningFirebaseRefs.push(userPostsRef);
}

/**
 * Writes the user's data to the database.
 */
function writeUserData(
  userId: string,
  name: string | null,
  email: string | null,
  imageUrl: string | null,
) {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture: imageUrl,
  });
}

/**
 * Cleanups the UI and removes all Firebase listeners.
 */
function cleanupUi() {
  // Remove all previously displayed posts.
  topUserPostsSection.getElementsByClassName('posts-container')[0].innerHTML =
    '';
  recentPostsSection.getElementsByClassName('posts-container')[0].innerHTML =
    '';
  userPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';

  // Stop all currently listening Firebase listeners.
  listeningFirebaseRefs.forEach(function (ref) {
    off(ref);
  });
  listeningFirebaseRefs = [];
}

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
let currentUID: string | null = null;

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthChanged(user: User | null) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  cleanupUi();
  if (user) {
    currentUID = user.uid;
    splashPage.style.display = 'none';
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    // Display the splash page where you can sign-in.
    splashPage.style.display = '';
  }
}

/**
 * Creates a new post for the current user.
 */
function newPostForCurrentUser(title: string, text: string) {
  const userId = auth.currentUser!.uid;

  return new Promise((resolve) => {
    onValue(
      ref(database, '/users/' + userId),
      function (snapshot) {
        const username =
          (snapshot.val() && snapshot.val().username) || 'Anonymous';
        return writeNewPost(
          auth.currentUser!.uid,
          username,
          auth.currentUser!.photoURL,
          title,
          text,
        ).then(resolve);
      },
      { onlyOnce: true },
    );
  });
}

/**
 * Displays the given section element and changes styling of the given button.
 */
function showSection(
  sectionElement?: HTMLElement,
  buttonElement?: HTMLElement,
) {
  recentPostsSection.style.display = 'none';
  userPostsSection.style.display = 'none';
  topUserPostsSection.style.display = 'none';
  addPost.style.display = 'none';
  recentMenuButton.classList.remove('is-active');
  myPostsMenuButton.classList.remove('is-active');
  myTopPostsMenuButton.classList.remove('is-active');

  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
  if (buttonElement) {
    buttonElement.classList.add('is-active');
  }
}

// Bind Sign in button.
signInButton.addEventListener('click', function () {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
});

// Bind Sign out button.
signOutButton.addEventListener('click', function () {
  signOut(auth);
});

// Listen for auth state changes
onAuthStateChanged(auth, onAuthChanged);

// Saves message on form submit.
messageForm.onsubmit = function (e) {
  e.preventDefault();
  const text = messageInput.value;
  const title = titleInput.value;
  if (text && title) {
    newPostForCurrentUser(title, text).then(function () {
      myPostsMenuButton.click();
    });
    messageInput.value = '';
    titleInput.value = '';
  }
};

// Bind menu buttons.
recentMenuButton.onclick = function () {
  showSection(recentPostsSection, recentMenuButton);
};
myPostsMenuButton.onclick = function () {
  showSection(userPostsSection, myPostsMenuButton);
};
myTopPostsMenuButton.onclick = function () {
  showSection(topUserPostsSection, myTopPostsMenuButton);
};
addButton.onclick = function () {
  showSection(addPost);
  messageInput.value = '';
  titleInput.value = '';
};

recentMenuButton.click();
