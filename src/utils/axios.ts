import axios from "axios";

const instance = axios.create({
  baseURL: "https://62286b649fd6174ca82321f1.mockapi.io/case-study",
});

export default instance;
