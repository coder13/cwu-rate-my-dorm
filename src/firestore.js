import firebase from 'firebase/app';
import { firestore, storage } from './firebase';
import uuid from 'react-uuid';


//gets images by dorm name and returns array of URLs 
export async function getImagesByDormName(dormName) {
    // Get list of urls from firestore
    var images = [];
    await firestore.collection('Dorms').where('name', '==', dormName).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            images = doc.get('images');
        });
        console.log(images);
    });
    return images;

}

// Get array of image urls for a dorm using dorm document id
export async function getImagesByDorm(dormID) {
    // Get list of urls from firestore
    var images = [];
    await firestore.collection('Dorms').doc(dormID).get().then((querySnapshot) => {
        images = querySnapshot.get('images');
        //console.log("images: "+images);
    });
    return images;
}


// Add a new dorm to firestore
export function newDorm(name, description, rating, amenities, images) {
    const dormRef = firestore.collection('Dorms');
    return dormRef.add({
        name: name,
        description: description,
        rating: rating,
        amenities: amenities,
        images: images
    })
}
//newDorm('', '', 5, [], []);

// Get all data of all dorms, returns an array containing all data of all dorms
export async function getDorms() {
    var dorms = [];
    await firestore.collection("Dorms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dorms.push(doc.data());
            //console.log(doc.data());
        });
    });
    return dorms;
}

//gets Dorm documents, returns array with document objects from which all other data can be extracted including id 
export async function getDormDocs(){
    var dorms = [];

    await firestore.collection("Dorms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dorms.push(doc);
            //console.log(doc.id);
        });

    });
    return dorms;
}

// Get names of all dorms
export async function getDormNames() {
    var dormNames = [];
    await firestore.collection("Dorms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dormNames.push(doc.get('name'));
            //console.log(doc.get('name'));
        });
    });
    return dormNames;
}

//returns dorm documents in alphabetical order
export async function orderDorms(){
    var dorms = [];

    await firestore.collection('Dorms').orderBy('name').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            dorms.push(doc);
        });
    });

    return dorms;
}

//Updates the overall rating. Gets called everytime a new review is submited. Assumes each review has a rating.
export async function updateOverallRating(dormName, revRating ){
    var dormId = await getDormId(dormName);
    firestore.runTransaction((transaction) => {
        let dormRef = firestore.collection('Dorms').doc(dormId);
        return transaction.get(dormRef).then(doc => {
            //update number of reviews
            var newNumReviews = doc.data().numReviews + 1;

            //update overall rating
            var oldRatingTotal = 0.0;
 

            if(doc.data().rating != null){ //if this is not the first review
                oldRatingTotal = doc.data().rating * doc.data().numReviews; 
            }

            //calculate new rating
            var newAvgRating = (oldRatingTotal + revRating )/ newNumReviews;

            //commit to Firestore
            transaction.update(dormRef, {
                numReviews: newNumReviews,
                rating: newAvgRating
            });
        });
      });
}

// Get all info from all reviews by a user
export async function getReviewsByUser() {
    var reviews = []; 
    var user = firebase.auth().currentUser;
    //console.log(user.email);
    await firestore.collectionGroup('Reviews').where('authorID', '==', user.uid).orderBy("lastQuarterYear", "desc").orderBy("lastQuarterSeasonNum", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            reviews.push(doc);
        });
    });
    return reviews;
}

//Get all review documents by dormId
export async function getReviewsByDormId(dormId) {
    var reviews = [];
    await firestore.collection("Dorms").doc(dormId).collection("Reviews").get().then((querySnapshot) => { //finds the dorm using the id
        querySnapshot.forEach((doc) => { //gets all review documents
            reviews.push(doc);
            //console.log(doc.id + " " + doc.get("rating"));      //print review id and rating 
        });
    });
    return reviews;
}

//Get reviews by the  dorm name using getDormId to get the id first
export async function getReviewsByDormName(dormName){
    var reviews =[];
    var dormId = await getDormId(dormName); //gets dorm id
    await firestore.collection("Dorms").doc(dormId).collection("Reviews").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            reviews.push(doc);
            //console.log(doc.id + " " + doc.get("rating"));         
        });  
    });
    return reviews;
}

//Get reviews by the  dorm name using getDormId to get the id first
export async function getReviewIDByDormNameAndUser(dormName, email){
    var reviewID;
    var dormId = await getDormId(dormName); //gets dorm id
    await firestore.collection("Dorms").doc(dormId).collection("Reviews").where("email", "==", email).limit(1).get().then((querySnapshot) => {
        querySnapshot.forEach((review) => {
            reviewID = review.id;
        });  
    });
    return reviewID
}

//Get top 3 LIKED reiews
/*
export async function getTopReviews(dormName){
    var topRev = [];
    var topId = [];
    var dormId = await getDormId(dormName);
    await firestore.collection("Dorms").doc(dormId).collection("Reviews").orderBy("likes", "desc").limit(3).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            topRev.push(doc);
            topId.push(doc.id);
        });
    });
    return [topRev, topId];
} */


//Get top 3 MOST RECENT reviews
export async function getTopReviews(dormName){
    var topRev = []; //these will be the actual review documents
    var topId = []; //this will just be the ids of the top reviews
    var dormId = await getDormId(dormName);
    console.log("top");
    await firestore.collection("Dorms").doc(dormId).collection("Reviews").orderBy("lastQuarterYear", "desc").orderBy("lastQuarterSeasonNum", "desc").limit(3).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            topRev.push(doc);
            topId.push(doc.id)
            console.log(doc.id);
        });
    });
    return [topRev, topId];
}

//Get reviews sorted by most recent. ***Uncomment commented parts to use top reviews***
export async function getSortedReviews(dormName){
    var reviews = [];
    var dormId = await getDormId(dormName);
    //var topRevId = await getTopReviews(dormName)[1];
    console.log("sorted");
    await firestore.collection("Dorms").doc(dormId).collection("Reviews").orderBy("lastQuarterYear", "desc").orderBy("lastQuarterSeasonNum", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //if(!(topRevId.includes(doc.id))){
                reviews.push(doc); 
                console.log(doc.id);
            //}
           
        });
    });
    return reviews;
}

//Get dorm id. Since dorm names are unique in the database, we can get a dorm's ID by looking for the document with the dorm name
export async function getDormId(dormName){
    var dormId;
    await firestore.collection("Dorms").where("name", "==", dormName).get().then((querySnapshot) => { //finds documents with dorm name (only 1 in our database)
        querySnapshot.forEach((doc) => { //goes through documents (again, only 1 in our database), and gets its ID
            dormId = doc.id; //sets the dorm id
        });
    })
    .catch((error) => {
        console.log("Error getting document: ", error);
        
    });
    return dormId;
}

// Geta dorm document using its name
export async function getDormByName(dormName){
    var dormId;
    await firestore.collection("Dorms").where("name", "==", dormName).get().then((querySnapshot) => { //finds documents with dorm name (only 1 in our database)
        querySnapshot.forEach((doc) => { //goes through documents (again, only 1 in our database), and gets its ID
            dormId = doc; //sets the dorm id
            return dormId
        });
    })
    .catch((error) => {
        console.log("Error getting document: ", error);
    });
    return dormId;
}

//add image to storage, dorm document images, and review document images. w/example of user file input
/*
export async function uploadImage(dormName, file){
    var newId = uuid(); //creates uuid for image
    var imgURL;

    var storageRef = storage.ref();
    var imagesRef = storageRef.child('dormImages');
    var dormRef = imagesRef.child( dormName + "/" + newId); //this just creates a reference, just says where and how the image will be stored
       
    await dormRef.put(file).then(async() => { //putting image in db                  
        await dormRef.getDownloadURL().then(async(url) => {//get the url of image    
            imgURL = url;  
        }) //error getting url
        .catch((error) => { 
            console.log("Error getting URL", error);
        });

    });    
    
    return imgURL;
}
*/
//add image to storage, dorm document images, and review document images. w/example of user file input
//FOR REVIEW IMAGES
export async function uploadImage(file){
    var newId = uuid(); //creates uuid for image
    var imgURL;

    var storageRef = storage.ref();
    var imagesRef = storageRef.child('reviewImages/' + newId);//this just creates a reference, just says where and how the image will be stored
       
    await imagesRef.put(file).then(async() => { //putting image in db                  
        await imagesRef.getDownloadURL().then(async(url) => {//get the url of image    
            imgURL = url;  
        }) //error getting url
        .catch((error) => { 
            console.log("Error getting URL", error);
        });

    });    
    
    return imgURL;
}


// Add a given image to firebase storage
export async function addImage(dormID, image) {
    var dormDoc = firestore.collection('Dorms').doc(dormID);
    if (dormDoc.exists) {
        var dormName = dormDoc.get('name');
        var newUuid = uuid();
        const storageRef = storage.ref();
        var imagesRef = storageRef.child('dormImages');
        var dormRef = imagesRef.child(`${dormName}/${newUuid}`);
        // Convert image to blob
        // Remove this later; it only helps when uploading from project files
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image, true);
            xhr.send(null);
        });
        await dormRef.put(blob);
        dormDoc.update('images', dormDoc.get('images').append(dormRef.getDownloadURL()));
        return dormRef.getDownloadURL();
    } else return null;
}

export async function deleteImage(url){
    var pictureRef = storage.refFromURL(url);
    pictureRef.delete()
    .then(() => {
      console.log("Picture is deleted successfully from storage!");
    })
    .catch((err) => {
      console.log(err);
    });
}

// Add a new Review to firestore and return the document created
export async function newReview(dormName, author, authorID, email, fQuarter, lQuarter,roomType, floor, review, images, overallRating, 
    locationRating, roomSizeRating, furnitureRating, commonAreasRating, cleanlinessRating, bathroomRating, likes) {

    var reviewDoc; //review document once it's created
    var dormID = await getDormId(dormName);

    //get the "number" of last quarter
    var seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
    var lastSeasonNum = seasons.indexOf(lQuarter[1]);

    const dormRef = firestore.collection('Dorms').doc(dormID).collection('Reviews');
    // Add review to firestore
    await dormRef.add({ // add returns a document reference in promise
        author: author,
        firstQuarterYear: fQuarter[0],
        firstQuarterSeason: fQuarter[1],
        lastQuarterYear: lQuarter[0],
        lastQuarterSeason: lQuarter[1],
        lastQuarterSeasonNum: lastSeasonNum,
        dormName: dormName,
        email: email,
        floor: floor,
        images: images,
        overallRating: parseInt(overallRating),
        review: review,
        roomType: roomType,
        locationRating: locationRating,
        roomSizeRating: roomSizeRating,
        furnitureRating: furnitureRating,
        commonAreasRating: commonAreasRating,
        cleanlinessRating: cleanlinessRating,
        bathroomRating: bathroomRating,
        likes: likes,
        authorID: authorID
    })
    .then(async documentReference =>{
        await documentReference.get().then(async documentSnapshot =>{ //gets the document from the reference that add returns
            reviewDoc = documentSnapshot;
        });
        await updateOverallRating(dormName, reviewDoc.get('overallRating'));
    });
    return reviewDoc;
}

export async function editReview(revId, dormName, fQuarter, lQuarter,roomType, floor, review, images, overallRating, 
    locationRating, roomSizeRating, furnitureRating, commonAreasRating, cleanlinessRating, bathroomRating, likes, oldRevRating){

    var seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
    var lastSeasonNum = seasons.indexOf(lQuarter[1]);

    var dormId = await getDormId(dormName);

    var revRef = firestore.collection('Dorms').doc(dormId).collection('Reviews').doc(revId);

    revRef.set({
        firstQuarterYear: fQuarter[0],
        firstQuarterSeason: fQuarter[1],
        lastQuarterYear: lQuarter[0],
        lastQuarterSeason: lQuarter[1],
        lastQuarterSeasonNum: lastSeasonNum,
        floor: floor,
        images: images,
        overallRating: parseInt(overallRating),
        review: review,
        roomType: roomType,
        locationRating: locationRating,
        roomSizeRating: roomSizeRating,
        furnitureRating: furnitureRating,
        commonAreasRating: commonAreasRating,
        cleanlinessRating: cleanlinessRating,
        bathroomRating: bathroomRating,
        likes: likes,

    }, 
    { merge: true });

    //firestore transaction to update overallRating of dorm affected
    firestore.runTransaction((transaction) => {
        let dormRef = firestore.collection('Dorms').doc(dormId);
        return transaction.get(dormRef).then(doc => {
            //get old overall rating total
            var oldRatingTotal = doc.data().rating * doc.data().numReviews;
            console.log("old rating total " + oldRatingTotal); 

            //get new overall rating total
            var newRatingTotal = (oldRatingTotal - oldRevRating) + parseInt(overallRating);
            console.log("new rating total" + newRatingTotal);

            //calculate new rating 
            var newAvgRating = newRatingTotal / doc.data().numReviews;
            console.log("average overall " + newAvgRating);

            //commit to Firestore
            transaction.update(dormRef, {
                rating: newAvgRating
            });
        });
    }); 

}

export async function deleteReview(dormName, revId, oldRevRating){
    var dormId = await getDormId(dormName);
    var deletedRating = oldRevRating;
    console.log(deletedRating);

    //delete review doc from firestore
    firestore.collection("Dorms").doc(dormId).collection('Reviews').doc(revId).delete().then(() => {
        console.log("Review successfully deleted!");
    }).catch((error) => {
        console.log("Error removing review: ", error);
    });

    //update overall rating of affected dorm
    firestore.runTransaction((transaction) => {
        let dormRef = firestore.collection('Dorms').doc(dormId);
        return transaction.get(dormRef).then(doc => {
            //update number of reviews
            var newNumReviews = doc.data().numReviews - 1;

            //update overall rating total
            var oldRatingTotal = doc.data().rating * doc.data().numReviews; 
            var newRatingTotal = oldRatingTotal - deletedRating;

            //calculate new rating 
            var newAvgRating;
            if(newNumReviews >0){ //if this is the last review, make sure not to divide by 0
                newAvgRating = newRatingTotal/ newNumReviews;
            }else{
                newAvgRating = null; //if this is the last review we want rating to be null
            }

            //commit to Firestore
            transaction.update(dormRef, {
                numReviews: newNumReviews,
                rating: newAvgRating
            });
        });
    }); 
}

// Add a new user to firestore
export function newUser(username, email, graduationYear) {
    firestore.collection('Users').add({
        username: username,
        email: email,
        graduationYear: graduationYear,
    })
}

//adds a suggestion to firestore in the collection 'suggestions'
export async function newSuggestion(text){
    var sDoc;
    const sRef = firestore.collection('suggestions');

    // Add suggestion to firestore
    await sRef.add({ // add returns a document reference in promise
        text:text
    })
    .then(async documentReference =>{
        await documentReference.get().then(async documentSnapshot =>{ //gets the document from the reference that add returns
            sDoc = documentSnapshot;
        });
    });

    //console.log('Suggestion doc sumbitted:', sDoc.id);
    return sDoc;
}

//newUser('', '', 2010);

// Add edit functions

export default firestore;