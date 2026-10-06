import { showListDialog } from "./module1.js";
import { showTextDialog } from "./module2.js";

const resultEl = document.getElementById("result");

document.getElementById("menu-work1").addEventListener("click", () => {
  showListDialog((chosenGroup) => {
    resultEl.textContent = chosenGroup;
  });
});

document.getElementById("menu-work2").addEventListener("click", () => {
  showTextDialog((enteredText) => {
    resultEl.textContent = enteredText;
  });
});
