import firebase from 'firebase/app';
import React from "react";
import { auth, firestore, storage } from './firebase';
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
            console.log(doc.id);
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
            console.log(doc.get('name'));
        });
    });
    return dormNames;
}

//returns dorm documents in alphabetical order
export async function orderDorms(){
    var dorms = [];

    await firestore.collection('Dorms').orderBy('name').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            //dorms.push(doc.data());
            dorms.push(doc);
        });
    });

    return dorms;
}

// Get all info from all reviews by a user
export async function getReviewsByUser(userID) {
    var reviews = [];
    await firestore.collection("Dorms").where('email', '==', userID).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data());
            console.log(doc.data());
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

//add image to storage, dorm document images, and review document images. w/example of user file input
export async function uploadImage(dormName, dormId, revId){
    var newId = uuid(); //creates uuid for image

    //creates button 
    const btn = document.createElement('input'); 
    btn.setAttribute('type', "file");
    btn.setAttribute('id', "click");
    btn.click(); //clicks button created above
    
    btn.addEventListener('change', async function(e){  //this happens when our invisible button is clicked
        var file = e.target.files[0];
        var storageRef = storage.ref();
        var imagesRef = storageRef.child('dormImages');
        var dormRef = imagesRef.child( dormName + "/" + newId); //this just creates a reference, just says where and how the image will be stored
        
            
        await dormRef.put(file).then(() => { //putting image in db                  
            dormRef.getDownloadURL().then(async(url) => {//get the url of image
                //updating images in dorm images collection
                var dorm = firestore.collection('Dorms').doc(dormId); //get the dorm where we want to update images
                dorm.get().then(async(doc) => {
                    dorm.update({  //update dorm images 
                        images: firebase.firestore.FieldValue.arrayUnion(url)          
                    });

                    //Updating images in review document
                    var rev = dorm.collection('Reviews').doc(revId);
                    rev.get().then(async (doc) => { //gets review document
                        rev.update({ //update review images
                            images: firebase.firestore.FieldValue.arrayUnion(url)
                        });
                    });
                });     
            }) //error getting url
                .catch((error) => { 
                console.log("Error getting URL", error);
            });
        });    
    }); 
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

// Adds image to storage w/example of user file input
export function addImageToStorage(dormName) {
    var newUuid = uuid();

    //creates an input file button
    const btn = document.createElement('input');
    btn.setAttribute('type', "file");
    btn.setAttribute('id', "up");

    btn.click(); //clicks on input file button

    btn.addEventListener('change', function (e) {
        var file = e.target.files[0];
        var storageRef = storage.ref();
        var imagesRef = storageRef.child('dormImages');
        var dormRef = imagesRef.child( `${dormName}/${newUuid}`);
        var task = dormRef.put(file).then(() => { //adds image to storage
            console.log('successfully uploaded image');
        });

    });
}

// Add a new Review to firestore and return the document created
export async function newReview(dormID, author, date, dormName, email, floor, images, rating, review, roomType, likes) {

    var reviewDoc; //review document once it's created

    // Add review to firestore
    const dormRef = firestore.collection('Dorms').doc(dormID).collection('Reviews');
    await dormRef.add({ // add returns a document reference in promise
        author: author,
        date: date,
        dormName: dormName,
        email: email,
        floor: floor,
        images: images,
        likes: likes,
        rating: rating,
        review: review,
        roomType: roomType,
    })
    .then(async documentReference =>{
        await documentReference.get().then(documentSnapshot =>{ //gets the document from the reference that add returns
            reviewDoc = documentSnapshot;
        });
    });
    return reviewDoc;
}
//newReview('', '', '', '', '', '', [], 0, 0, '', {});

// Add a new user to firestore
export function newUser(username, email, graduationYear) {
    firestore.collection('Users').add({
        username: username,
        email: email,
        graduationYear: graduationYear,
    })
}
//newUser('', '', 2010);

// Add edit functions

export default firestore;