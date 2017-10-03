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
"use strict";

FriendlyEats.prototype.initTemplates = function() {
  const self = this;
  self.templates = {};
  document.querySelectorAll(".template").forEach(function (el) {
    self.templates[el.getAttribute("id")] = el;
  });
};

FriendlyEats.prototype.viewHome = function() {
  const self = this;
  self.getAllRestaurants();
};

FriendlyEats.prototype.viewList = function(filters, filter_description) {
  const self = this;
  if (!filter_description) {
    filter_description = "any type of food with any price in any city.";
  }

  const mainEl = self.renderTemplate("main-adjusted");
  const headerEl = self.renderTemplate("header-base", {
    hasSectionHeader: true
  });

  self.replaceElement(
    headerEl.querySelector("#section-header"),
    self.renderTemplate("filter-display", { filter_description })
  );

  self.replaceElement(document.querySelector(".header"), headerEl);
  self.replaceElement(document.querySelector("main"), mainEl);

  headerEl.querySelector("#show-filters").addEventListener("click", function() {
    self.dialogs.filter.show();
  });

  const renderResults = function (doc) {
    if (!doc) {
      const headerEl = self.renderTemplate("header-base", {
        hasSectionHeader: true
      });
    
      const noResultsEl = self.renderTemplate("no-results");

      self.replaceElement(
        headerEl.querySelector("#section-header"),
        self.renderTemplate("filter-display", { filter_description })
      );

      headerEl.querySelector("#show-filters").addEventListener("click", function() {
        self.dialogs.filter.show();
      });
    
      self.replaceElement(document.querySelector(".header"), headerEl);
      self.replaceElement(document.querySelector("main"), noResultsEl);
      return;
    }
    const data = doc.data();
    data[".id"] = doc.id;
    data["go_to_restaurant"] = function ()  {
      self.router.navigate(`/restaurants/${doc.id}`);
    };

    const el = self.renderTemplate("restaurant-card", data);
    el.querySelector(".rating").append(self.renderRating(data.avgRating));
    el.querySelector(".price").append(self.renderPrice(data.price));

    mainEl.querySelector("#cards").append(el);
  };

  if (filters.city || filters.category || filters.price || filters.sort !== "Rating" ) {
    self.getFilteredRestaurants({
     city: filters.city || "Any",
     category: filters.category || "Any",
     price: filters.price,
     sort: filters.sort 
    }, renderResults);
  } else {
    self.getAllRestaurants(renderResults);
  }

  var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

  mdc.autoInit();
};

FriendlyEats.prototype.viewSetup = function() {
  clearTimeout(window.st);
  console.warn("HIT SETUP PAGE");
  const self = this;
  const headerEl = self.renderTemplate("header-base", {
    hasSectionHeader: false
  });

  const config = self.getFirebaseConfig();
  const noRestaurantsEl = self.renderTemplate("no-restaurants", config);

  const button = noRestaurantsEl.querySelector("#add_mock_data");
  let addingMockData = false;

  button.addEventListener("click", function () {
    if (addingMockData) return;
    addingMockData = true;

    this.style.opacity = "0.4";
    this.innerText = "Please wait...";

    self.addMockRestaurants().then(function () {
      self.rerender();
    });
  });

  self.replaceElement(document.querySelector(".header"), headerEl);
  self.replaceElement(document.querySelector("main"), noRestaurantsEl);

  firebase
  .firestore()
  .collection("restaurants")
  .limit(1)
  .onSnapshot(function (snapshot) {
    if (snapshot.size && !addingMockData) {
      self.router.navigate("/");
    }
  });
};

FriendlyEats.prototype.initReviewDialog = function() {
  const self = this;
  const dialog = document.querySelector("#dialog-add-review");
  self.dialogs.add_review = new mdc.dialog.MDCDialog(dialog); 
  
  self.dialogs.add_review.listen('MDCDialog:accept', function () {
    let pathname = self.getCleanPath(document.location.pathname);
    let id = pathname.split("/")[2];

    self.addRating(id, {
      rating,
      text: dialog.querySelector("#text").value,
      userName: "Anonymous (Web)",
      timestamp: new Date(),
      userId: firebase.auth().currentUser.uid
    }).then(function () {
      self.rerender();
    });
  });

  let rating = 0;

  dialog.querySelectorAll(".star-input i").forEach(function (el) {
    const rate = function ()  {
      let after = false;
      rating = 0;
      [].slice.call(el.parentNode.children).forEach(function (child) {
        if (!after) {
          rating++;
          child.innerText = "star";
        } else {
          child.innerText = "star_border";
        }
        after = after || child.isSameNode(el);
      });
    };
    el.addEventListener("mouseover", rate);
  });
};

FriendlyEats.prototype.initFilterDialog = function() {
  // TODO: Reset filter dialog to init state on close.
  const self = this;

  self.dialogs.filter = new mdc.dialog.MDCDialog(document.querySelector('#dialog-filter-all'));
  
  self.dialogs.filter.listen('MDCDialog:accept', function() {
    self.updateQuery(self.filters);
  });

  const dialog = document.querySelector("aside");
  const pages = dialog.querySelectorAll(".page");

  self.replaceElement(
    dialog.querySelector("#category-list"),
    self.renderTemplate("item-list", { items: ["Any"].concat(self.data.categories) })
  );

  self.replaceElement(
    dialog.querySelector("#city-list"),
    self.renderTemplate("item-list", { items: ["Any"].concat(self.data.cities) })
  );

  const renderAllList = function () {
    self.replaceElement(
      dialog.querySelector("#all-filters-list"),
      self.renderTemplate("all-filters-list", self.filters)
    );
  
    dialog.querySelectorAll("#page-all .mdc-list-item").forEach(function (el) {
      el.addEventListener("click", function () {
        const id = el.id.split("-").slice(1).join("-");
        displaySection(id);
      });
    });
  }

  const displaySection = function (id) {
    if (id == "page-all") {
      renderAllList();
    }

    pages.forEach(function (sel) {
      if (sel.id == id) {
        sel.style.display = "block";
      } else {
        sel.style.display = "none";
      }
    });
  }

  pages.forEach(function (sel) {
    const type = sel.id.split("-")[1];
    if (type == "all") return;

    sel.querySelectorAll(".mdc-list-item").forEach(function (el) {
      el.addEventListener("click", function () {
        self.filters[type] = el.innerText.trim() == "Any"? "" : el.innerText.trim();
        displaySection("page-all");
      });
    });
  });

  displaySection("page-all");
  dialog.querySelectorAll(".back").forEach(function (el) {
    el.addEventListener("click", function () {
      displaySection("page-all");
    });
  });
};

FriendlyEats.prototype.updateQuery = function (filters) {
  const self = this;
  let query_description = "";

  if (filters.category != "") {
    query_description += `${filters.category} places`;
  } else {
    query_description += "any restaraunt";
  }

  if (filters.city != "") {
    query_description += ` in ${filters.city}`;
  } else {
    query_description += " located  anywhere";
  }

  if (filters.price != "") {
    query_description += ` with a price of ${filters.price}`;
  } else {
    query_description += " with any price";
  }

  if (filters.sort == "Rating") {
    query_description += " sorted by rating";
  } else if (filters.sort == "Reviews") {
    query_description += " sorted by # of reviews";
  }

  self.viewList(filters, query_description);
}

FriendlyEats.prototype.viewRestaurant = function(id) {
  const self = this;
  let sectionHeaderEl;
  return self.getRestaurant(id)
    .then(function (doc) {
      const data = doc.data();
      const dialog =  self.dialogs.add_review;

      data.show_add_review = function ()  {
        dialog.show();
      };

      sectionHeaderEl = self.renderTemplate("restaurant-header", data);
      sectionHeaderEl
        .querySelector(".rating")
        .append(self.renderRating(data.avgRating));

      sectionHeaderEl
        .querySelector(".price")
        .append(self.renderPrice(data.price));
      return doc.ref.collection("ratings").orderBy("timestamp", "desc").get();
    })
    .then(function (ratings) {
      let mainEl;

      if (ratings.size) {
        mainEl = self.renderTemplate("main");

        ratings.forEach(function (rating) {
          const data = rating.data();
          const el = self.renderTemplate("review-card", data);
          el.querySelector(".rating").append(self.renderRating(data.rating));
          mainEl.querySelector("#cards").append(el);
        });
      } else {
        mainEl = self.renderTemplate("no-ratings", {
          add_mock_data () {
            self.addMockRatings(id).then(function () {
              self.rerender();
            });
          }
        });
      }

      const headerEl = self.renderTemplate("header-base", {
        hasSectionHeader: true
      });

      self.replaceElement(document.querySelector(".header"), sectionHeaderEl);
      self.replaceElement(document.querySelector("main"), mainEl);
    })
    .then(function ()  {
      self.router.updatePageLinks();
    })
    .catch(function (err) {
      console.warn("Error rendering page", err);
    });
};

FriendlyEats.prototype.renderTemplate = function(id, data) {
  const self = this;
  const template = self.templates[id];
  const el = template.cloneNode(true);
  el.removeAttribute("hidden");
  self.render(el, data);
  return el;
};

FriendlyEats.prototype.render = function(el, data) {
  if (!data) return;
  const self = this;

  const modifiers = {
    "data-fir-foreach": function (tel) {
      const field = tel.getAttribute("data-fir-foreach");
      const values = self.getDeepItem(data, field);

      values.forEach(function (value, index) {
        const cloneTel = tel.cloneNode(true);
        tel.parentNode.append(cloneTel);

        Object.keys(modifiers).forEach(function (selector) {
          const children = Array.prototype.slice.call(
            cloneTel.querySelectorAll(`[${selector}]`)
          );
          children.push(cloneTel);
          children.forEach(function (childEl) {
            const currentVal = childEl.getAttribute(selector);

            if (!currentVal) return;
            childEl.setAttribute(
              selector,
              currentVal.replace("~", `${field}/${index}`)
            );
          });
        });
      });

      tel.parentNode.removeChild(tel);
    },
    "data-fir-content": function (tel) {
      const field = tel.getAttribute("data-fir-content");
      tel.innerText = self.getDeepItem(data, field);
    },
    "data-fir-click": function (tel) {
      tel.addEventListener("click", function ()  {
        const field = tel.getAttribute("data-fir-click");
        self.getDeepItem(data, field)();
      });
    },
    "data-fir-if": function (tel) {
      const field = tel.getAttribute("data-fir-if");
      if (!self.getDeepItem(data, field)) {
        tel.style.display = "none";
      }
    },
    "data-fir-if-not": function (tel) {
      const field = tel.getAttribute("data-fir-if-not");
      if (self.getDeepItem(data, field)) {
        tel.style.display = "none";
      }
    },
    "data-fir-attr": function (tel) {
      const chunks = tel.getAttribute("data-fir-attr").split(":");
      const attr = chunks[0];
      const field = chunks[1];
      tel.setAttribute(attr, self.getDeepItem(data, field));
    },
    "data-fir-style": function (tel) {
      const chunks = tel.getAttribute("data-fir-style").split(":");
      const attr = chunks[0];
      const field = chunks[1];
      let value = self.getDeepItem(data, field);

      if (attr.toLowerCase() == "backgroundimage") {
        value = `url(${value})`;
      }
      tel.style[attr] = value;
    }
  };

  const preModifiers = ["data-fir-foreach"];

  preModifiers.forEach(function (selector) {
    const modifier = modifiers[selector];
    self.useModifier(el, selector, modifier);
  });

  Object.keys(modifiers).forEach(function (selector) {
    if (preModifiers.indexOf(selector) != -1) return;

    const modifier = modifiers[selector];
    self.useModifier(el, selector, modifier);
  });
};

FriendlyEats.prototype.useModifier = function(el, selector, modifier) {
  el.querySelectorAll(`[${selector}]`).forEach(modifier);
};

FriendlyEats.prototype.getDeepItem = function(obj, path) {
  path.split("/").forEach(function (chunk) {
    obj = obj[chunk];
  });
  return obj;
};

FriendlyEats.prototype.renderRating = function(rating) {
  const self = this;
  const el = self.renderTemplate("rating", {});
  for (let r = 0; r < 5; r += 1) {
    let star;
    if (r < Math.floor(rating)) {
      star = self.renderTemplate("star-icon", {});
    } else {
      star = self.renderTemplate("star-border-icon", {});
    }
    el.append(star);
  }
  return el;
};

FriendlyEats.prototype.renderPrice = function(price) {
  const self = this;
  const el = self.renderTemplate("price", {});
  for (let r = 0; r < price; r += 1) {
    el.append("$");
  }
  return el;
};

FriendlyEats.prototype.replaceElement = function(parent, content) {
  parent.innerHTML = "";
  parent.append(content);
};

FriendlyEats.prototype.rerender = function () {
  const self = this;
  self.router.navigate(document.location.pathname + "?" + new Date().getTime());
};
