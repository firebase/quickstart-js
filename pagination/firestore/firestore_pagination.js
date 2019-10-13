nextPage.addEventListener('click', loadNextPage);

const db = firebase.firestore();

function loadNextPage() {
    var query = db.collection('name')
    var documentArray;
    var documentArrayLength ;
    if (documentArray.length === 0) {} else {
        documentArrayLength = documentArray.length - 1;
        query = query.startAfter(documentArray[documentArrayLength]);
    }
    query.limit(10).orderBy('timestamp', 'desc').get().then((snapshot) => {
        itemExist = false;
        snapshot.forEach((document) => {
            documentArray.forEach((item) => {
                if (item.id === document.id) {
                    itemExist = true;
                }
            })
            if (!itemExist) {
                documentArray.push(document);
                console.log(document);
            } else {
                console.log('item already exist not adding more');
            }
        })
    })
}
loadNextPage();