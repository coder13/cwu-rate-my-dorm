import React from "react";
import { auth, firestore, storage } from './firebase';
import uuid from 'react-uuid';


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

// Get array of image urls for a dorm
export function getImagesByDorm(dormID) {
    // Get list of urls from firestore
    var images = [];
    firestore.collection('Dorms').doc(dormID).get().then((querySnapshot) => {
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

// Get all data of all dorms
export function getDorms() {
    var dorms = [];
    firestore.collection("Dorms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dorms.push(doc.data());
            //console.log(doc.data());
        });
    });
    return dorms;
}

// Get names of all dorms
export function getDormNames() {
    var dormNames = [];
    firestore.collection("Dorms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dormNames.push(doc.get('name'));
            console.log(doc.get('name'));
        });
    });
    return dormNames;
}

// Get all info from all reviews by a user
export function getReviewsByUser(userID) {
    var reviews = [];
    firestore.collection("Dorms").where('email', '==', userID).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data());
            console.log(doc.data());
        });
    });
    return reviews;
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
function addImageToStorage(dormName) {
    const btn = document.createElement('input');
    btn.setAttribute('type', "file");
    btn.setAttribute('id', "up");

    btn.onclick = function () {
        console.log("click up");
    }
    btn.click();

    btn.addEventListener('change', function (e) {
        var file = e.target.files[0];
        var storageRef = storage.ref();
        var imagesRef = storageRef.child('dormImages');
        var dormRef = imagesRef.child(`${dormName}/${file.name}`);
        var task = dormRef.put(file).then(() => {
            console.log('successfully uploaded image');
        });

    });
}

// Add a new Review to firestore
export function newReview(dormID, author, date, dormName, email, floor, images, rating, review, roomType, likes) {

    // Add every image to firebase storage
    var imageIDs = [];
    images.array.forEach(image => {
        imageIDs.push(addImage(image));
    });
    // Add review to firestore
    const dormRef = firestore.collection('Dorms').doc(dormID).collection('Reviews');
    return dormRef.add({
        author: author,
        date: date,
        dormName: dormName,
        email: email,
        floor: floor,
        images: imageIDs,
        likes: likes,
        rating: rating,
        review: review,
        roomType: roomType,
    })
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