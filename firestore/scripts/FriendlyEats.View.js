/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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
'use strict';

FriendlyEats.ID_CONSTANT = 'fir-';

FriendlyEats.prototype.initTemplates = function() {
  this.templates = {};

  let that = this;
  document.querySelectorAll('.template').forEach(function(el) {
    that.templates[el.getAttribute('id')] = el;
  });
};

FriendlyEats.prototype.viewHome = () => {
  this.getAllRestaurants();
};

FriendlyEats.prototype.viewList = (filters, filter_description) => {
  if (!filter_description) {
    filter_description = 'any type of food with any price in any city.';
  }

  let mainEl = this.renderTemplate('main-adjusted');
  let headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: true
  });

  this.replaceElement(
    headerEl.querySelector('#section-header'),
    this.renderTemplate('filter-display', {
      filter_description: filter_description
    })
  );

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), mainEl);

  let that = this;
  headerEl.querySelector('#show-filters').addEventListener('click', () => {
    that.dialogs.filter.show();
  });

  const renderResults = (doc) => {
    if (!doc) {
      let headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      let noResultsEl = that.renderTemplate('no-results');

      that.replaceElement(
        headerEl.querySelector('#section-header'),
        that.renderTemplate('filter-display', {
          filter_description: filter_description
        })
      );

      headerEl.querySelector('#show-filters').addEventListener('click', () => {
        that.dialogs.filter.show();
      });

      that.replaceElement(document.querySelector('.header'), headerEl);
      that.replaceElement(document.querySelector('main'), noResultsEl);
      return;
    }
    const data = doc.data();
    data['.id'] = doc.id;
    data['go_to_restaurant'] = () => {
      that.router.navigate('/restaurants/' + doc.id);
    };

    // check if restaurant card has already been rendered
    let existingRestaurantCardEl = mainEl.querySelector('#' + that.ID_CONSTANT + doc.id);
    let el = existingRestaurantCardEl || that.renderTemplate('restaurant-card', data);

    let ratingEl = el.querySelector('.rating');
    let priceEl = el.querySelector('.price');

    // clear out existing rating and price if they already exist
    if (existingRestaurantCardEl) {
      ratingEl.innerHTML = '';
      priceEl.innerHTML = '';
    }

    ratingEl.append(that.renderRating(data.avgRating));
    priceEl.append(that.renderPrice(data.price));

    if (!existingRestaurantCardEl) {
      mainEl.querySelector('#cards').append(el);
    }
  };

  if (filters.city || filters.category || filters.price || filters.sort !== 'Rating' ) {
    this.getFilteredRestaurants({
      city: filters.city || 'Any',
      category: filters.category || 'Any',
      price: filters.price || 'Any',
      sort: filters.sort
    }, renderResults);
  } else {
    this.getAllRestaurants(renderResults);
  }

  let toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

  mdc.autoInit();
};

FriendlyEats.prototype.viewSetup = () => {
  let headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: false
  });

  let config = this.getFirebaseConfig();
  let noRestaurantsEl = this.renderTemplate('no-restaurants', config);

  const button = noRestaurantsEl.querySelector('#add_mock_data');
  let addingMockData = false;

  let that = this;
  button.addEventListener('click', (event) => {
    if (addingMockData) {
      return;
    }

    addingMockData = true;

    event.target.style.opacity = '0.4';
    event.target.innerText = 'Please wait...';

    that.addMockRestaurants().then(() => {
      that.rerender();
    });
  });

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), noRestaurantsEl);

  firebase
    .firestore()
    .collection('restaurants')
    .limit(1)
    .onSnapshot(function(snapshot) {
      if (snapshot.size && !addingMockData) {
        that.router.navigate('/');
      }
    });
};

FriendlyEats.prototype.initReviewDialog = function() {
  const dialog = document.querySelector('#dialog-add-review');
  this.dialogs.add_review = new mdc.dialog.MDCDialog(dialog);

  let that = this;
  this.dialogs.add_review.listen('MDCDialog:accept', () => {
    let pathname = that.getCleanPath(document.location.pathname);
    let id = pathname.split('/')[2];

    that.addRating(id, {
      rating: rating,
      text: dialog.querySelector('#text').value,
      userName: 'Anonymous (Web)',
      timestamp: new Date(),
      userId: firebase.auth().currentUser.uid
    }).then(() => {
      that.rerender();
    });
  });

  let rating = 0;

  dialog.querySelectorAll('.star-input i').forEach((el) => {
    const rate = () => {
      let after = false;
      rating = 0;
      [].slice.call(el.parentNode.children).forEach((child) => {
        if (!after) {
          rating++;
          child.innerText = 'star';
        } else {
          child.innerText = 'star_border';
        }
        after = after || child.isSameNode(el);
      });
    };
    el.addEventListener('mouseover', rate);
  });
};

FriendlyEats.prototype.initFilterDialog = () => {
  // TODO: Reset filter dialog to init state on close.
  this.dialogs.filter = new mdc.dialog.MDCDialog(document.querySelector('#dialog-filter-all'));

  let that = this;
  this.dialogs.filter.listen('MDCDialog:accept', () => {
    that.updateQuery(that.filters);
  });

  const dialog = document.querySelector('aside');
  const pages = dialog.querySelectorAll('.page');

  this.replaceElement(
    dialog.querySelector('#category-list'),
    that.renderTemplate('item-list', { items: ['Any'].concat(that.data.categories) })
  );

  this.replaceElement(
    dialog.querySelector('#city-list'),
    that.renderTemplate('item-list', { items: ['Any'].concat(that.data.cities) })
  );

  const renderAllList = () => {
    that.replaceElement(
      dialog.querySelector('#all-filters-list'),
      that.renderTemplate('all-filters-list', that.filters)
    );

    dialog.querySelectorAll('#page-all .mdc-list-item').forEach((el) => {
      el.addEventListener('click', () => {
        let id = el.id.split('-').slice(1).join('-');
        displaySection(id);
      });
    });
  };

  const displaySection = (id) => {
    if (id === 'page-all') {
      renderAllList();
    }

    pages.forEach((sel) => {
      if (sel.id === id) {
        sel.style.display = 'block';
      } else {
        sel.style.display = 'none';
      }
    });
  };

  pages.forEach((sel) => {
    let type = sel.id.split('-')[1];
    if (type === 'all') {
      return;
    }

    sel.querySelectorAll('.mdc-list-item').forEach((el) => {
      el.addEventListener('click', () => {
        that.filters[type] = el.innerText.trim() === 'Any'? '' : el.innerText.trim();
        displaySection('page-all');
      });
    });
  });

  displaySection('page-all');
  dialog.querySelectorAll('.back').forEach((el) => {
    el.addEventListener('click', () => {
      displaySection('page-all');
    });
  });
};

FriendlyEats.prototype.updateQuery = (filters) => {
  let query_description = '';

  if (filters.category !== '') {
    query_description += filters.category + ' places';
  } else {
    query_description += 'any restaurant';
  }

  if (filters.city !== '') {
    query_description += ' in ' + filters.city;
  } else {
    query_description += ' located anywhere';
  }

  if (filters.price !== '') {
    query_description += ' with a price of ' + filters.price;
  } else {
    query_description += ' with any price';
  }

  if (filters.sort === 'Rating') {
    query_description += ' sorted by rating';
  } else if (filters.sort === 'Reviews') {
    query_description += ' sorted by # of reviews';
  }

  this.viewList(filters, query_description);
};

FriendlyEats.prototype.viewRestaurant = function(id) {
  let sectionHeaderEl;
  let that = this;

  return this.getRestaurant(id)
    .then((doc) => {
      var data = doc.data();
      var dialog =  that.dialogs.add_review;

      data.show_add_review = () => {
        dialog.show();
      };

      sectionHeaderEl = that.renderTemplate('restaurant-header', data);
      sectionHeaderEl
        .querySelector('.rating')
        .append(that.renderRating(data.avgRating));

      sectionHeaderEl
        .querySelector('.price')
        .append(that.renderPrice(data.price));
      return doc.ref.collection('ratings').orderBy('timestamp', 'desc').get();
    })
    .then((ratings) => {
      let mainEl;

      if (ratings.size) {
        mainEl = that.renderTemplate('main');

        ratings.forEach((rating) => {
          let data = rating.data();
          let el = that.renderTemplate('review-card', data);
          el.querySelector('.rating').append(that.renderRating(data.rating));
          mainEl.querySelector('#cards').append(el);
        });
      } else {
        mainEl = that.renderTemplate('no-ratings', {
          add_mock_data: function() {
            that.addMockRatings(id).then(() => {
              that.rerender();
            });
          }
        });
      }

      let headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      that.replaceElement(document.querySelector('.header'), sectionHeaderEl);
      that.replaceElement(document.querySelector('main'), mainEl);
    })
    .then(() => {
      that.router.updatePageLinks();
    })
    .catch((err) => {
      console.warn('Error rendering page', err);
    });
};

FriendlyEats.prototype.renderTemplate = (id, data) => {
  let template = this.templates[id];
  let el = template.cloneNode(true);
  el.removeAttribute('hidden');
  this.render(el, data);
  
  // set an id in case we need to access the element later
  if (data && data['.id']) {
    // for `querySelector` to work, ids must start with a string
    el.id = this.ID_CONSTANT + data['.id'];
  }

  return el;
};

FriendlyEats.prototype.render = (el, data) => {
  if (!data) {
    return;
  }

  let that = this;
  let modifiers = {
    'data-fir-foreach': (tel) => {
      let field = tel.getAttribute('data-fir-foreach');
      let values = that.getDeepItem(data, field);

      values.forEach((value, index) => {
        let cloneTel = tel.cloneNode(true);
        tel.parentNode.append(cloneTel);

        Object.keys(modifiers).forEach((selector) => {
          let children = Array.prototype.slice.call(
            cloneTel.querySelectorAll('[' + selector + ']')
          );
          children.push(cloneTel);
          children.forEach((childEl) => {
            let currentVal = childEl.getAttribute(selector);

            if (!currentVal) {
              return;
            }

            childEl.setAttribute(
              selector,
              currentVal.replace('~', field + '/' + index)
            );
          });
        });
      });

      tel.parentNode.removeChild(tel);
    },
    'data-fir-content': (tel) => {
      let field = tel.getAttribute('data-fir-content');
      tel.innerText = that.getDeepItem(data, field);
    },
    'data-fir-click': (tel) => {
      tel.addEventListener('click', () => {
        let field = tel.getAttribute('data-fir-click');
        that.getDeepItem(data, field)();
      });
    },
    'data-fir-if': (tel) => {
      let field = tel.getAttribute('data-fir-if');
      if (!that.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-if-not': (tel) => {
      let field = tel.getAttribute('data-fir-if-not');
      if (that.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-attr': (tel) => {
      let chunks = tel.getAttribute('data-fir-attr').split(':');
      let attr = chunks[0];
      let field = chunks[1];
      tel.setAttribute(attr, that.getDeepItem(data, field));
    },
    'data-fir-style': (tel) => {
      let chunks = tel.getAttribute('data-fir-style').split(':');
      let attr = chunks[0];
      let field = chunks[1];
      let value = that.getDeepItem(data, field);

      if (attr.toLowerCase() === 'backgroundimage') {
        value = 'url(' + value + ')';
      }
      tel.style[attr] = value;
    }
  };

  const preModifiers = ['data-fir-foreach'];

  preModifiers.forEach((selector) => {
    let modifier = modifiers[selector];
    that.useModifier(el, selector, modifier);
  });

  Object.keys(modifiers).forEach((selector) => {
    if (preModifiers.indexOf(selector) !== -1) {
      return;
    }

    let modifier = modifiers[selector];
    that.useModifier(el, selector, modifier);
  });
};

FriendlyEats.prototype.useModifier = (el, selector, modifier) => {
  el.querySelectorAll('[' + selector + ']').forEach(modifier);
};

FriendlyEats.prototype.getDeepItem = (obj, path) => {
  path.split('/').forEach((chunk) => {
    obj = obj[chunk];
  });
  return obj;
};

FriendlyEats.prototype.renderRating = (rating) => {
  let el = this.renderTemplate('rating', {});
  for (var r = 0; r < 5; r += 1) {
    let star;
    if (r < Math.floor(rating)) {
      star = this.renderTemplate('star-icon', {});
    } else {
      star = this.renderTemplate('star-border-icon', {});
    }
    el.append(star);
  }
  return el;
};

FriendlyEats.prototype.renderPrice = function(price) {
  var el = this.renderTemplate('price', {});
  for (var r = 0; r < price; r += 1) {
    el.append('$');
  }
  return el;
};

FriendlyEats.prototype.replaceElement = function(parent, content) {
  parent.innerHTML = '';
  parent.append(content);
};

FriendlyEats.prototype.rerender = function() {
  this.router.navigate(document.location.pathname + '?' + new Date().getTime());
};
