const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");

selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
});

let currentlyActive = null;

optionsList.forEach(o => {
  o.addEventListener("click", () => {
    if (currentlyActive != null)
    {
        currentlyActive.classList.remove("current");
    }
    selected.innerHTML = o.getAttribute("value");
    console.log(selected.innerHTML);
    optionsContainer.classList.remove("active");
    o.classList.add("current");
    currentlyActive = o;
  });
});