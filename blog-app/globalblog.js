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
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

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
const greetings = document.querySelector("#greetings");
const greetingFunc = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  console.log(currentHour);
  let greeting;
  if (currentHour < 12) {
    greeting = "Good Morning Readers!";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon Readers!";
  } else {
    greeting = "Good Evening Readers!";
  }
  return greeting;
};
greetings.innerText = greetingFunc();

// const publishDate = new Date().toDateString();
window.addEventListener("load", () => {
  const q = query(collection(db, "global"), orderBy("createdAt", "desc"));
  const globalBlogSection = document.querySelector("#globalBlogSection");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    globalBlogSection.innerHTML = "";
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
      displayName.innerText = `${doc.data().personName} `;
      const dateString = document.createElement("span");
      dateString.classList.add("dateString");
      dateString.innerText = `- ${doc.data().date}`;
      displayNameAndDate.appendChild(displayName);
      displayNameAndDate.appendChild(dateString);
      head2Div.appendChild(title);
      head2Div.appendChild(displayNameAndDate);
      head.appendChild(userImg);
      head.appendChild(head2Div);

      const inputText = document.createElement("div");
      inputText.classList.add("inputText");
      inputText.innerText = doc.data().inputText;

      const button = document.createElement("button");
      button.innerText = "See all from this user";
      button.classList.add("button");
      post.appendChild(head);
      post.appendChild(inputText);
      post.appendChild(button);

      globalBlogSection.appendChild(post);
      button.addEventListener("click", () =>
        seeAllBlog(
          doc.data().userUID,
          doc.data().personName,
          doc.data().imageURL
        )
      );
    });
  });
});

const seeAllBlog = (uid, name, url) => {
  sessionStorage.setItem("uid", uid);
  sessionStorage.setItem("name", name);
  sessionStorage.setItem("url", url);
  console.log(name);
  setTimeout(() => {
    location.assign("userblog.html");
  }, 1000);
};
