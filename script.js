"use strict";

//INITIAL SETUP
let filter = "all";
let sort;
const allStudents = [];
const Student = {
  firstName: "-firstname-",
  lastName: "-lastname-",
  house: "-house-"
};

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
  modalImg: document.querySelector(".modal__img--student"),
  modalHouseImg: document.querySelector(".modal__img--symbol"),
  modalButton: document.querySelector(".button"),
  html: document.querySelector("html")
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
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    //Create new object with cleaned data
    const student = Object.create(Student);
    //Interpret jsonObject into animal properties
    const firstSpace = jsonObject.fullname.indexOf(" ");
    student.firstName = jsonObject.fullname.substring(0, firstSpace);
    student.lastName = jsonObject.fullname.substring(firstSpace + 1);
    student.house = jsonObject.house;
    //TODO: ADD DESC AND PHOTO ONCE YOU HAVE IT

    allStudents.push(student);
  });
  displayList(allStudents);
}

//FILTER DATA FUNCTION
function filterBy() {
  filter = this.value;
  displayList(allStudents);
}

//SORT DATA IF STATEMENTS
function sortBy() {
  sort = this.value;
  //IF STATEMENTS + .SORT() METHOD
  if (sort == "firstName") {
    allStudents.sort((a, b) => {
      return a.firstName.localeCompare(b.firstName);
    });
  } else if (sort == "lastName") {
    allStudents.sort((a, b) => {
      return a.lastName.localeCompare(b.lastName);
    });
  } else if (sort == "house") {
    allStudents.sort((a, b) => {
      return a.house.localeCompare(b.house);
    });
  } else if (sort == "all") {
    init();
  }
  displayList(allStudents);
}

//DISPLAYING THE LIST
function displayList(students) {
  DOM.parent.innerHTML = "";

  students.forEach(displayStudent);
}

// DEFINING THE CLONE
function displayStudent(student) {
  //IF STATEMENT FOR FILTERING THE LIST
  if (filter == student.house || filter == "all") {
    //cloning the template
    const clone = DOM.template.cloneNode(true).content;

    //populating it
    clone.querySelector(
      "li"
    ).innerHTML = `${student.firstName} ${student.lastName}, ${student.house}`;

    //displaying modal
    clone.querySelector(".button").addEventListener("click", () => {
      displayModal(student);
    });

    function displayModal(student) {
      DOM.modalHeading.textContent = `${student.firstName} ${student.lastName}`;
      DOM.modalImg.src = `assets/students_photos/${student.lastName.toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
      DOM.modalHouseImg.src = `assets/${student.house.toLowerCase()}.png`;
      console.log(student.house);
      DOM.html.setAttribute(
        "data-attribute",
        `${student.house.toLowerCase()}-colors`
      );
    }

    //ADDING HOUSE ATTRIBUTE
    clone.querySelector(".students-div").setAttribute("house", student.house);

    //appending to DOM
    DOM.parent.appendChild(clone); // puts the tamplate in my <ol>
  }
}

//FADING BACKGROUND IMAGE WITH DELAY
function backgroundFade() {
  DOM.wrapperDiv.style.opacity = "0.2";
}
