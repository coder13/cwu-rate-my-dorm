import React from "react";
import { auth, firestore, storage } from '../firebase';
import uuid from 'react-uuid';

const storageRef = storage.ref();

export async function addImage(dormID, image) {
    // Create a unique uuid
    var newUuid = uuid();
    console.log(newUuid);
    // Navigate to a path with that uuid
    // TODO: GET EXTENSION FROM IMAGE
    var imageLocation = storageRef.child(`/${newUuid}`);
    //var imageLocation = firestore.collection('Dorms').doc(dormID).collection("Photos").get();

    // Convert image to blob
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

    await imageLocation.put(blob);
    console.log('ImageLocation: ' + blob);
    // Put file in storage at that location
}

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

// Add a new Review to firestore
export function newReview(dormID, author, date, dormName, email, floor, images, rating, review, roomType, likes) {
    const dormRef = firestore.collection('Dorms').doc(dormID).collection('Reviews');
    return dormRef.add({
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
}
//newReview('', '', '', '', '', '', [], 0, 0, '', {});



// Edit function editReview

// Edit user information

// Add a new user to firestore
export function newUser(username, email, graduationYear) {
    firestore.collection('Users').add({
        username: username,
        email: email,
        graduationYear: graduationYear,
    })
}
//newUser('', '', 2010);


export default firestore;