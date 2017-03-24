import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: Meteor.settings.public.firebase.API_KEY,
  authDomain: Meteor.settings.public.firebase.AUTH_DOMAIN,
  databaseURL: Meteor.settings.public.firebase.DATABASE_URL,
  storageBucket: Meteor.settings.public.firebase.STORAGE_BUCKET,
};
firebase.initializeApp(config);

var storage = firebase.storage();
var firebaseRef = firebase.storage();
export var storageRef = storage.ref();
export default firebase;
