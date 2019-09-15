"use strict";

//INITIAL SETUP
let students = [];
let filter = "all";
let sort;

//OBJECT CONTAINING ALL GLOBAL DOM VARIABLES
const DOM = {
  jsonLink: "http://petlatkea.dk/2019/students1991.json",
  parent: document.querySelector("ol"),
  template: document.querySelector("template"),
  wrapperDiv: document.querySelector(".background"),
  filterDropdown: document.querySelectorAll("#filter"),
  sortDropdown: document.querySelectorAll("#sort"),
  modalHeading: document.querySelector(".modal__heading"),
  modalDesc: document.querySelector(".modal__text"),
  modalImg: document.querySelector(".modal__img")
};

//CALLING INIT FUNCTION ON PAGE LOAD
document.addEventListener("DOMContentLoaded", init);

function init() {
  setUpEventListeners();
  backgroundFade();
  loadJSON();
}

//SETTING UP EVENT LISTENERS FOR FILTER AND SORT
function setUpEventListeners() {
  DOM.filterDropdown.forEach(option => {
    option.addEventListener("change", filterBy);
  });
  DOM.sortDropdown.forEach(option => {
    option.addEventListener("change", sortBy);
  });
}

//FETCHING DATA FROM JSON
function loadJSON() {
  fetch(DOM.jsonLink)
    .then(response => response.json())
    .then(jsonData => {
      students = jsonData;

      //display list when loaded
      displayList();
    });
}

//FILTER DATA FUNCTION
function filterBy() {
  filter = this.value;
  displayList();
}

//SORT DATA FUNCTION
function sortBy() {
  sort = this.value;

  //IF STATEMENTS + .SORT() METHOD
  if (sort == "firstName") {
    students.sort(function(a, b) {
      return a.firstName.localeCompare(b.firstName);
    });
  } else if (sort == "lastName") {
    students.sort(function(a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  } else if (sort == "house") {
    students.sort(function(a, b) {
      return a.house.localeCompare(b.house);
    });
  } else if (sort == "all") {
    init(); //RESETING
  }
  displayList();
}

//DISPLAYING THE LIST
function displayList() {
  DOM.parent.innerHTML = "";

  students.forEach(displayItem);
}

// DEFINING THE CLONE
function displayItem(object) {
  //SEPARATING FIRST NAME AND LAST NAME
  const firstSpace = object.fullname.indexOf(" ");
  let firstName = object.fullname.substring(0, firstSpace);
  let lastName = object.fullname.substring(firstSpace + 1);
  object.firstName = firstName;
  object.lastName = lastName;

  //IF STATEMENT FOR FILTERING THE LIST
  if (filter == object.house || filter == "all") {
    //cloning the template
    const clone = DOM.template.cloneNode(true).content;

    //populating it
    clone.querySelector("li").innerHTML =
      firstName + " " + lastName + ", " + object.house;
    //ADDING HOUSE ATTRIBUTE
    clone.querySelector(".students-div").setAttribute("house", object.house);

    //appending to DOM
    DOM.parent.appendChild(clone); // puts the tamplate in my <ol>
  }
}

//CHANGING MODAL
function displayModal() {
  DOM.modalHeading.textContent = object.firstName;
  // DOM.modalDesc.textContent = object.desc;    ----ADD WHEN YOU HAVE DESC IN JSON
  // DOM.modalImg.textContent = object.img;    ----ADD WHEN YOU HAVE IMG IN JSON
  let house = this.getAttribute("house");
}

//FADING BACKGROUND IMAGE WITH DELAY
function backgroundFade() {
  DOM.wrapperDiv.style.opacity = "0.2";
}