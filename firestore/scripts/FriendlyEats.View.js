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

FriendlyEats.prototype.initTemplates = function() {
  this.templates = {};
  document.querySelectorAll('.template').forEach(el => {
    this.templates[el.getAttribute('id')] = el;
  });
};

FriendlyEats.prototype.viewHome = function() {
  this.getAllRestaurants();
};

FriendlyEats.prototype.viewList = function(filters, filter_description) {
  if (!filter_description) {
    filter_description = 'any type of food with any price in any city.';
  }

  const mainEl = this.renderTemplate('main-adjusted');
  const headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: true
  });

  this.replaceElement(
      headerEl.querySelector('#section-header'),
      this.renderTemplate('filter-display', { filter_description })
  );

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), mainEl);

  headerEl.querySelector('#show-filters').addEventListener('click', () => {
    this.dialogs.filter.show();
  });

  const renderResults = doc => {
    if (!doc) {
      const headerEl = this.renderTemplate('header-base', {
        hasSectionHeader: true
      });
    
      const noResultsEl = this.renderTemplate('no-results');

      this.replaceElement(
          headerEl.querySelector('#section-header'),
          this.renderTemplate('filter-display', { filter_description })
      );

      headerEl.querySelector('#show-filters').addEventListener('click', () => {
        this.dialogs.filter.show();
      });

      this.replaceElement(document.querySelector('.header'), headerEl);
      this.replaceElement(document.querySelector('main'), noResultsEl);
      return;
    }
    const data = doc.data();
    data['.id'] = doc.id;
    data['go_to_restaurant'] = () => {
      this.router.navigate(`/restaurants/${doc.id}`);
    };

    const el = this.renderTemplate('restaurant-card', data);
    el.querySelector('.rating').append(this.renderRating(data.avgRating));
    el.querySelector('.price').append(this.renderPrice(data.price));

    mainEl.querySelector('#cards').append(el);
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

  const toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

  mdc.autoInit();
};

FriendlyEats.prototype.viewSetup = function() {
  const headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: false
  });

  const config = this.getFirebaseConfig();
  const noRestaurantsEl = this.renderTemplate('no-restaurants', config);

  const button = noRestaurantsEl.querySelector('#add_mock_data');
  let addingMockData = false;

  button.addEventListener('click', event => {
    if (addingMockData) return;
    addingMockData = true;

    event.target.style.opacity = '0.4';
    event.target.innerText = 'Please wait...';

    this.addMockRestaurants().then(() => {
      this.rerender();
    });
  });

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), noRestaurantsEl);

  firebase
  .firestore()
  .collection('restaurants')
  .limit(1)
  .onSnapshot(snapshot => {
    if (snapshot.size && !addingMockData) {
      this.router.navigate('/');
    }
  });
};

FriendlyEats.prototype.initReviewDialog = function() {
  const dialog = document.querySelector('#dialog-add-review');
  this.dialogs.add_review = new mdc.dialog.MDCDialog(dialog);

  this.dialogs.add_review.listen('MDCDialog:accept', () => {
    let pathname = this.getCleanPath(document.location.pathname);
    let id = pathname.split('/')[2];

    this.addRating(id, {
      rating,
      text: dialog.querySelector('#text').value,
      userName: 'Anonymous (Web)',
      timestamp: new Date(),
      userId: firebase.auth().currentUser.uid
    }).then(() => {
      this.rerender();
    });
  });

  let rating = 0;

  dialog.querySelectorAll('.star-input i').forEach(el => {
    const rate = () => {
      let after = false;
      rating = 0;
      [].slice.call(el.parentNode.children).forEach(child => {
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

FriendlyEats.prototype.initFilterDialog = function() {
  // TODO: Reset filter dialog to init state on close.
  this.dialogs.filter = new mdc.dialog.MDCDialog(document.querySelector('#dialog-filter-all'));

  this.dialogs.filter.listen('MDCDialog:accept', () => {
    this.updateQuery(this.filters);
  });

  const dialog = document.querySelector('aside');
  const pages = dialog.querySelectorAll('.page');

  this.replaceElement(
    dialog.querySelector('#category-list'),
      this.renderTemplate('item-list', { items: ['Any'].concat(this.data.categories) })
  );

  this.replaceElement(
      dialog.querySelector('#city-list'),
      this.renderTemplate('item-list', { items: ['Any'].concat(this.data.cities) })
  );

  const renderAllList = () => {
    this.replaceElement(
        dialog.querySelector('#all-filters-list'),
        this.renderTemplate('all-filters-list', this.filters)
    );
  
    dialog.querySelectorAll('#page-all .mdc-list-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.id.split('-').slice(1).join('-');
        displaySection(id);
      });
    });
  };

  const displaySection = id => {
    if (id === 'page-all') {
      renderAllList();
    }

    pages.forEach(sel => {
      if (sel.id === id) {
        sel.style.display = 'block';
      } else {
        sel.style.display = 'none';
      }
    });
  };

  pages.forEach(sel => {
    const type = sel.id.split('-')[1];
    if (type === 'all') return;

    sel.querySelectorAll('.mdc-list-item').forEach(el => {
      el.addEventListener('click', () => {
        this.filters[type] = el.innerText.trim() === 'Any'? '' : el.innerText.trim();
        displaySection('page-all');
      });
    });
  });

  displaySection('page-all');
  dialog.querySelectorAll('.back').forEach(el => {
    el.addEventListener('click', () => {
      displaySection('page-all');
    });
  });
};

FriendlyEats.prototype.updateQuery = function(filters) {
  let query_description = '';

  if (filters.category !== '') {
    query_description += `${filters.category} places`;
  } else {
    query_description += 'any restaurant';
  }

  if (filters.city !== '') {
    query_description += ` in ${filters.city}`;
  } else {
    query_description += ' located anywhere';
  }

  if (filters.price !== '') {
    query_description += ` with a price of ${filters.price}`;
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
  return this.getRestaurant(id)
    .then(doc => {
      const data = doc.data();
      const dialog =  this.dialogs.add_review;

      data.show_add_review = () => {
        dialog.show();
      };

      sectionHeaderEl = this.renderTemplate('restaurant-header', data);
      sectionHeaderEl
        .querySelector('.rating')
        .append(this.renderRating(data.avgRating));

      sectionHeaderEl
        .querySelector('.price')
        .append(this.renderPrice(data.price));
      return doc.ref.collection('ratings').orderBy('timestamp', 'desc').get();
    })
    .then(ratings => {
      let mainEl;

      if (ratings.size) {
        mainEl = this.renderTemplate('main');

        ratings.forEach(rating => {
          const data = rating.data();
          const el = this.renderTemplate('review-card', data);
          el.querySelector('.rating').append(this.renderRating(data.rating));
          mainEl.querySelector('#cards').append(el);
        });
      } else {
        mainEl = this.renderTemplate('no-ratings', {
          add_mock_data: () => {
            this.addMockRatings(id).then(() => {
              this.rerender();
            });
          }
        });
      }

      const headerEl = this.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      this.replaceElement(document.querySelector('.header'), sectionHeaderEl);
      this.replaceElement(document.querySelector('main'), mainEl);
    })
    .then(() => {
      this.router.updatePageLinks();
    })
    .catch(err => {
      console.warn('Error rendering page', err);
    });
};

FriendlyEats.prototype.renderTemplate = function(id, data) {
  const template = this.templates[id];
  const el = template.cloneNode(true);
  el.removeAttribute('hidden');
  this.render(el, data);
  return el;
};

FriendlyEats.prototype.render = function(el, data) {
  if (!data) return;

  const modifiers = {
    'data-fir-foreach': tel => {
      const field = tel.getAttribute('data-fir-foreach');
      const values = this.getDeepItem(data, field);

      values.forEach((value, index) => {
        const cloneTel = tel.cloneNode(true);
        tel.parentNode.append(cloneTel);

        Object.keys(modifiers).forEach(selector => {
          const children = Array.prototype.slice.call(
            cloneTel.querySelectorAll(`[${selector}]`)
          );
          children.push(cloneTel);
          children.forEach(childEl => {
            const currentVal = childEl.getAttribute(selector);

            if (!currentVal) return;
            childEl.setAttribute(
              selector,
              currentVal.replace('~', `${field}/${index}`)
            );
          });
        });
      });

      tel.parentNode.removeChild(tel);
    },
    'data-fir-content': tel => {
      const field = tel.getAttribute('data-fir-content');
      tel.innerText = this.getDeepItem(data, field);
    },
    'data-fir-click': tel => {
      tel.addEventListener('click', () => {
        const field = tel.getAttribute('data-fir-click');
        this.getDeepItem(data, field)();
      });
    },
    'data-fir-if': tel => {
      const field = tel.getAttribute('data-fir-if');
      if (!this.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-if-not': tel => {
      const field = tel.getAttribute('data-fir-if-not');
      if (this.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-attr': tel => {
      const chunks = tel.getAttribute('data-fir-attr').split(':');
      const attr = chunks[0];
      const field = chunks[1];
      tel.setAttribute(attr, this.getDeepItem(data, field));
    },
    'data-fir-style': tel => {
      const chunks = tel.getAttribute('data-fir-style').split(':');
      const attr = chunks[0];
      const field = chunks[1];
      let value = this.getDeepItem(data, field);

      if (attr.toLowerCase() === 'backgroundimage') {
        value = `url(${value})`;
      }
      tel.style[attr] = value;
    }
  };

  const preModifiers = ['data-fir-foreach'];

  preModifiers.forEach(selector => {
    const modifier = modifiers[selector];
    this.useModifier(el, selector, modifier);
  });

  Object.keys(modifiers).forEach(selector => {
    if (preModifiers.indexOf(selector) !== -1) return;

    const modifier = modifiers[selector];
    this.useModifier(el, selector, modifier);
  });
};

FriendlyEats.prototype.useModifier = function(el, selector, modifier) {
  el.querySelectorAll(`[${selector}]`).forEach(modifier);
};

FriendlyEats.prototype.getDeepItem = function(obj, path) {
  path.split('/').forEach(chunk => {
    obj = obj[chunk];
  });
  return obj;
};

FriendlyEats.prototype.renderRating = function(rating) {
  const el = this.renderTemplate('rating', {});
  for (let r = 0; r < 5; r += 1) {
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
  const el = this.renderTemplate('price', {});
  for (let r = 0; r < price; r += 1) {
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
