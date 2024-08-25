import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBTad2mGHTDf69J7gqG3PQHGlWIAxCKrI",
  authDomain: "mini-hackathon-js-37bdc.firebaseapp.com",
  projectId: "mini-hackathon-js-37bdc",
  storageBucket: "mini-hackathon-js-37bdc.appspot.com",
  messagingSenderId: "843533931567",
  appId: "1:843533931567:web:2fb0d2b719a9b26888e2da"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();

const userName = sessionStorage.getItem("currentUserName");
const username = (document.querySelector("#usernamea").innerText = userName);
const currentUserUID = sessionStorage.getItem("currentUserUID");
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const publishDate = new Date().toDateString();
    const uid = user.uid;
    console.log(user);
    const blogForm = document.querySelector("#blogForm");
    blogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const blogId = generateUniqueId();
      const title = document.querySelector("#title").value;
      const inputText = document.querySelector("#inputText").value;
      console.log(inputText);
      try {
        const docRef = await addDoc(collection(db, uid), {
          userUID: uid,
          title: title,
          inputText: inputText,
          id: blogId,
          createdAt: serverTimestamp(),
          date: publishDate,
          personName: user.displayName,
          imageURL: user.auth.currentUser.photoURL,
        });
        const globalBlog = await addDoc(collection(db, "global"), {
          title: title,
          userUID: uid,
          inputText: inputText,
          id: blogId,
          createdAt: serverTimestamp(),
          date: publishDate,
          personName: user.displayName,
          imageURL: user.auth.currentUser.photoURL,
        });
        blogForm.reset();
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    });
    // .......signout.........
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

    // ...
  } else {
    // User is signed out
    // ...
    displayAlert("You're not login", "black");
    setTimeout(() => {
      location.replace("../index.html");
    }, 2000);
    console.log("error");
  }
});

window.addEventListener("load", () => {
  const q = query(collection(db, currentUserUID), orderBy("createdAt", "desc"));
  const blogSection = document.querySelector("#blogSection");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    blogSection.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const post = document.createElement("div");
      post.classList.add("post");
      post.id = doc.data().userUID;
      const head = document.createElement("div");
      head.classList.add("head");
      const userImg = document.createElement("div");
      userImg.style.backgroundImage =
        doc.data().imageURL !== null
          ? `url(${doc.data().imageURL})`
          : "url('../fall.png')";
      // "url('../fall.png')"
      // userImg.innerHTML = `<i class="bi bi-person"></i>`;
      userImg.classList.add("userImg");
      const head2Div = document.createElement("div");
      head2Div.classList.add("head2Div");
      const title = document.createElement("div");
      title.classList.add("title");
      title.innerText = doc.data().title;
      const displayNameAndDate = document.createElement("div");
      displayNameAndDate.classList.add("displayNameAndDate");
      const displayName = document.createElement("div");
      displayName.classList.add("displayName");
      displayName.innerText = doc.data().personName;
      const dateString = document.createElement("span");
      dateString.classList.add("dateString");
      dateString.innerText = ` - ${doc.data().date}`;
      displayNameAndDate.appendChild(displayName);
      displayNameAndDate.appendChild(dateString);
      head2Div.appendChild(title);
      head2Div.appendChild(displayNameAndDate);
      head.appendChild(userImg);
      head.appendChild(head2Div);

      const inputText = document.createElement("div");
      inputText.classList.add("inputText");
      inputText.innerText = doc.data().inputText;

      const btnDiv = document.createElement("div");
      btnDiv.classList.add("btnDiv");
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn");
      deleteBtn.id = `${doc.data().id}`;
      deleteBtn.innerText = "Delete";

      const editBtn = document.createElement("button");
      editBtn.classList.add("btn");
      editBtn.id = `${doc.id}`;
      editBtn.innerText = "Edit";
      btnDiv.appendChild(deleteBtn);
      btnDiv.appendChild(editBtn);
      post.appendChild(head);
      post.appendChild(inputText);
      post.appendChild(btnDiv);

      blogSection.appendChild(post);
      deleteBtn.addEventListener("click", () =>
        deletePostFunc(doc.id, doc.data().title)
      );
      editBtn.addEventListener("click", () =>
        editPostFunc(doc.id, doc.data().title, doc.data().inputText)
      );
    });
  });
});

const deletePostFunc = async (id, globalTitle) => {
  try {
    // Delete from user's personal collection
    await deleteDoc(doc(db, currentUserUID, id));

    // Delete from global collection
    const globalQuerySnapshot = await getDocs(
      query(collection(db, "global"), where("title", "==", globalTitle))
    );
    globalQuerySnapshot.forEach(async (doc) => {
      if (doc.data().title === globalTitle) {
        await deleteDoc(doc.ref);
      }
    });

    console.log("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

const generateUniqueId = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 10;
  let uniqueId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters.charAt(randomIndex);
  }
  return `id-${uniqueId}`;
};

const editPostFunc = (id, title, text) => {
  document.querySelector("#editFormDiv").style.display = "block";
  const editForm = document.querySelector("#editForm");
  const editFormTitle = document.querySelector("#editFormTitle");
  const editFormText = document.querySelector("#editFormText");
  editFormTitle.value = title;
  editFormText.value = text;
  const editFormFunc = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, currentUserUID, id), {
      title: editFormTitle.value,
      inputText: editFormText.value,
    });
    const globalQuerySnapshot = await getDocs(
      query(collection(db, "global"), where("title", "==", title))
    );
    globalQuerySnapshot.forEach(async (doc) => {
      if (doc.data().title === title) {
        await updateDoc(doc.ref, {
          title: editFormTitle.value,
          inputText: editFormText.value,
        });
      }
    });
    editForm.reset();
    document.querySelector("#editFormDiv").style.display = "none";
    editForm.removeEventListener("submit", editFormFunc);
  };
  editForm.addEventListener("submit", editFormFunc);
};

const cross = document.querySelector("#cross");
cross.addEventListener("click", () => {
  const editFormDiv = document.querySelector("#editFormDiv");
  editFormDiv.style.display = "none";
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
