// Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCSlBPiVHq34O35jZrwBu6hVbIpQpQQV9M",
    authDomain: "dynamicorg-2025.firebaseapp.com",
    projectId: "dynamicorg-2025",
    storageBucket: "dynamicorg-2025.firebasestorage.app",
    messagingSenderId: "904928889046",
    appId: "1:904928889046:web:bd909de3569e92d4dce177",
    measurementId: "G-736F8MZREF"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence (optional but recommended)
db.enablePersistence().catch((err) => {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.log('Persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the features required
        console.log('Persistence not available');
    }
});



