import "./app.js";
import AOS from "aos";
import "aos/dist/aos.css";
import { initSelects } from "../blocks/select/select.js";
import { initRandomControls } from "../pages/random/random.js";
import { initResultsPage } from "../pages/results/results.js";

AOS.init({
  duration: 700,
  easing: "ease-out-cubic",
  once: false,
});

initSelects();
initRandomControls();
initResultsPage();
