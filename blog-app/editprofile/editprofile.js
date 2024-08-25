import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
import {
  getAuth,
  updateProfile,
  onAuthStateChanged,
  updatePassword,
  signOut,
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
const storage = getStorage();

// const userName = sessionStorage.getItem("currentUserName");
// const username = (document.querySelector("#username").innerText = userName);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user.auth.currentUser);

    const profileimg = document.querySelector("#profileimg");
    if (user.auth.currentUser.photoURL === null) {
      profileimg.style.backgroundImage = "url('../fall.png')";
    } else {
      profileimg.style.backgroundImage = `url(${user.auth.currentUser.photoURL})`;
    }
    const fileUpload = document.querySelector("#fileUpload");
    fileUpload.addEventListener("click", () => {
      uploadBtn.style.display = "block";
    });

    // ------Edit Profile Image------
    const uploadBtn = document.querySelector("#uploadBtn");
    const uploadProgress = document.getElementById("uploadProgress");
    const progressPercent = document.querySelector("#progressPercent");
    uploadBtn.addEventListener("click", () => {
      uploadProgress.style.display = "block";
      progressPercent.style.display = "block";
      const fileInput = document.querySelector("#fileInput");
      const file = fileInput.files[0];
      console.log(file);
      if (file) {
        profileimg.classList.add("opacityDown");
        const storageRef = ref(storage, "images/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressPercent.innerText = `${progress}%`;
            uploadProgress.value = progress;
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            console.log("Image uploaded successfully!");

            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              updateProfile(auth.currentUser, {
                photoURL: downloadURL,
              })
                .then(() => {
                  // Profile updated!
                  uploadBtn.style.display = "none";
                  profileimg.classList.remove("opacityDown");
                  setTimeout(() => {
                    progressPercent.style.display = "none";
                    uploadProgress.style.display = "none";
                    location.reload();
                  }, 2000);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }
        );
      } else {
        console.log("error in uploading");
      }
    });

    // ----Edit Display Name-------
    const displayName = document.querySelector("#displayName");
    displayName.value = user.auth.currentUser.displayName;
    const editPenForDisplayName = document.querySelector(
      "#editPenForDisplayName"
    );
    editPenForDisplayName.addEventListener("click", () => {
      displayName.disabled = false;
      displayName.style.border = "1px solid gray";
      editPenForDisplayName.style.display = "none";
    });
    document
      .querySelector("#updateDisplayNameForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        updateProfile(auth.currentUser, {
          displayName: displayName.value,
        })
          .then(() => {
            // Profile updated!
            editPenForDisplayName.style.display = "block";
            displayName.disabled = true;
            displayName.style.border = "none";
          })
          .catch((error) => {
            console.log(error);
          });
      });

    const updatePasswordForm = document.querySelector("#updatePasswordForm");
    updatePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const oldPassword = document.querySelector("#oldPassword").value;
      const newPassword = document.querySelector("#newPassword").value;
      const confirmPassword = document.querySelector("#confirmPassword").value;

      if (newPassword === confirmPassword) {
        const user = auth.currentUser;
        const newPassword = confirmPassword;

        updatePassword(user, newPassword)
          .then(() => {
            // Update successful.
            console.log("Password Updated");
            updatePasswordForm.reset();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("password must be same");
      }
    });

    const logout = document.querySelector("#logout");
    logout.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          location.replace("../index.html");
        })
        .catch((error) => {
          // An error happened.
        });
    });
  } else {
    // User is signed out
    // ...
  }
});
