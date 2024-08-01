var nextPage = document.querySelector(".button");
nextPage.addEventListener("click", onNextPageClick);
var list = [];
function onNextPageClick() {
  if (list.length == 0) {
    // if list length is 0 then we just passing the current timestamp to get the newest items
    getNextPage(Date.now());
  } else {
    //if list has items then we are passing the last item timestamp to get the items after that
    //for ex: if our list contains 20 items then at first we are getting 10 items
    // on the second click then we pass the 10 item timestamp from list
    var lastitemindex = list.length - 1;
    getNextPage(list[lastitemindex].timestamp);
  }
}

function getNextPage(lastTimestamp) {
  firebase
    .database()
    .ref("/name/")
    .orderByChild("timestamp")
    .endAt(lastTimestamp)
    .limitToLast(10)
    .once("value")
    .then(results => {
      results.forEach(snapshot => {
        var value = snapshot.val();
        value.key = snapshot.key;
        var listItemExist = false;
        list.forEach(element => {
          if (element.key == value.key) {
            listItemExist = true;
          }
        });
        if (!listItemExist) {
          console.log("Adding in list ");
          list.push(value);
        } else {
          console.log("item already exist not adding");
        }
      });

      list.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
    })
    .catch(err => {
      console.log(err);
    });
}
