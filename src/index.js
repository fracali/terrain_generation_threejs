import "./css/main.css";
import Application from "./js/Application";

// @ts-ignore
window.application = new Application({
  $canvas: document.querySelector(".js-canvas"),
});
