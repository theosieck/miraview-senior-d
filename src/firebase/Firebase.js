import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

// add our api keys
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

// initialize the app
const firebaseApp = initializeApp(firebaseConfig);

// set up auth
const auth = getAuth(firebaseApp);

// setup functions
const firebaseFunctions = getFunctions(firebaseApp);
const addTherapist = httpsCallable(firebaseFunctions, 'addTherapist');
const getClientsList = httpsCallable(firebaseFunctions, 'getClientsList');
const getClientStatistics = httpsCallable(firebaseFunctions, 'getClientStatistics');
const getSingleClient = httpsCallable(firebaseFunctions, 'getSingleClient');
const updateTherapist = httpsCallable(firebaseFunctions, 'updateTherapist');
const getTherapistInfo=httpsCallable(firebaseFunctions,'getTherapistInfo')

/* Call functions like this:
import {getClientsList} from Firebase.js;
let data = await getClientsList({name: ''});

OR

import {getClientsList} from Firebase.js;
getClientsList().then((result) => {
	// Do Stuff here
}).catch((error) => {
	// Catch any errors in here
});
*/

// detect auth state - TODO
// onAuthStateChanged(auth, (user) => {

// })

export default firebaseApp;
export {auth};
export { addTherapist, getClientsList, getClientStatistics, getSingleClient, updateTherapist,getTherapistInfo };