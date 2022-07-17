import { render } from "react-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
render(<App />, rootElement);
