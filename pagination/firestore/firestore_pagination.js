var nextPage = document.querySelector(".button");

nextPage.addEventListener("click", loadNextPage);

const db = firebase.firestore();

function loadNextPage() {
  var query = db.collection("name");
  var documentArray;
  var documentArrayLength;
  if (documentArray.length === 0) {
  } else {
    //if document contains no item then we are just getting the items from database
    documentArrayLength = documentArray.length - 1;
    query = query.startAfter(documentArray[documentArrayLength]);
  }
  query
    .limit(10)
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      // getting docs from newest to oldest
      itemExist = false;
      snapshot.forEach(document => {
        documentArray.forEach(item => {
          if (item.id === document.id) {
            itemExist = true;
          }
        });
        if (!itemExist) {
          documentArray.push(document);
          console.log(document);
        } else {
          console.log("Item already exist not adding more");
        }
      });
    });
}
loadNextPage();
