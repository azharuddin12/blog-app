import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
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
const uid = sessionStorage.getItem("uid");
const name = sessionStorage.getItem("name");
const url = sessionStorage.getItem("url");
console.log(url);
document.querySelector("#blog").innerText = `All from ${name}`;
const picture = document.querySelector("#picture");
picture.style.backgroundImage =
  url === null ? "url('../fall.png')" : `url(${url})`;

// const publishDate = new Date().toDateString();
window.addEventListener("load", () => {
  const q = query(collection(db, uid), orderBy("createdAt", "desc"));
  const globalBlogSection = document.querySelector("#globalBlogSection");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    globalBlogSection.innerHTML = "";

    querySnapshot.forEach((doc) => {
      //   const globalBlogDiv = document.createElement("div");
      //   globalBlogDiv.classList.add("globalBlogDiv");
      //   const headline = document.createElement("h2");
      //   headline.classList.add("headline");
      //   headline.innerText = `All from ${doc.data().personName}`;
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

      post.appendChild(head);
      post.appendChild(inputText);
      globalBlogSection.appendChild(post);
      // const pictureDiv = document.createElement("div");
      // pictureDiv.classList.add("pictureDiv");
      // pictureDiv.style.backgroundImage =
      //   doc.data().imageURL !== null
      //     ? `url(${doc.data().imageURL})`
      //     : "url('../fall.png')";

      // picture.appendChild(pictureDiv);
    });
  });
});
