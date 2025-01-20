// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfD4xWi-N6G4-wj3l1rFIHeQRXolovgCE",
    authDomain: "police-report-record.firebaseapp.com",
    projectId: "police-report-record",
    storageBucket: "police-report-record.appspot.com",
    messagingSenderId: "680890909094",
    appId: "1:680890909094:web:637a77ef50b5f0f8a90f67"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  