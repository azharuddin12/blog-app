import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBTad2mGHTDf69J7gqG3PQHGlWIAxCKrI",
  authDomain: "mini-hackathon-js-37bdc.firebaseapp.com",
  projectId: "mini-hackathon-js-37bdc",
  storageBucket: "mini-hackathon-js-37bdc.appspot.com",
  messagingSenderId: "843533931567",
  appId: "1:843533931567:web:2fb0d2b719a9b26888e2da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const loginEmail = document.querySelector("#loginEmail").value;
  const loginPassword = document.querySelector("#loginPassword").value;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("user", user);
      console.log(userCredential);
      const currentUserUID = user.uid;
      const currentUserName = user.displayName;
      sessionStorage.setItem("currentUserUID", currentUserUID);
      sessionStorage.setItem("currentUserName", currentUserName);
      console.log(currentUserName);
      console.log(currentUserUID);
      displayAlert("Login Successfully", "green");

      setTimeout(() => {
        location.assign("home/home.html");
      }, 2000);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      displayAlert(errorMessage, "red");
      // ..
    });
});
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    displayAlert("Already logged in", "green");
    setTimeout(() => {
      location.assign("home/home.html");
    }, 2000);
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const alertBox = document.querySelector("#alertBox");
const displayAlert = (txt, clss) => {
  alertBox.textContent = txt;
  alertBox.classList.add(clss);
  // remove alert
  setTimeout(() => {
    alertBox.textContent = "";
    alertBox.classList.remove(clss);
  }, 2000);
};
