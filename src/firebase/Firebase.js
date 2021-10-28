import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

// detect auth state - TODO
// onAuthStateChanged(auth, (user) => {

// })

export default firebaseApp;
export {auth};