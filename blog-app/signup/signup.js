import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
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
const signupForm = document.querySelector("#signupForm");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const signupPassword = document.querySelector("#signupPassword").value;
  const signupConfirmPassword = document.querySelector(
    "#signupConfirmPassword"
  ).value;
  if (signupPassword === signupConfirmPassword) {
    const firstName = document.querySelector("#firstname").value;
    const lastName = document.querySelector("#lastname").value;
    const userName = `${firstName} ${lastName}`;
    console.log(userName);
    const signupEmail = document.querySelector("#signupEmail").value;
    const signupPassword = document.querySelector("#signupPassword").value;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user", user);
        console.log(userCredential);
        updateProfile(auth.currentUser, {
          displayName: userName,
        })
          .then(() => {
            // Profile updated!
            // ...

            const currentUserName = user.displayName;
            sessionStorage.setItem("currentUserName", currentUserName);
            displayAlert("SignUp Successfully", "green");
          })
          .catch((error) => {
            // An error occurred
            // ...
          });
        const currentUserUID = user.uid;
        console.log(currentUserUID);
        sessionStorage.setItem("currentUserUID", currentUserUID);
        setTimeout(() => {
          location.assign("../editprofile/editprofile.html");
        }, 2000);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", error);
        // ..
      });
  } else {
    displayAlert("password must be same", "black");
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
