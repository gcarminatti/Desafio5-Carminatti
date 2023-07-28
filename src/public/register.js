import axios from "axios";

const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  axios
    .post("/api/sessions/register", obj)
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));
});
