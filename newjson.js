"use strict";

//INITIAL SETUP
let filter = "all";
let sort;
const allStudents = [];
const Student = {
  firstName: "-firstname-",
  middleName: "-middlename-",
  lastName: "-lastname-",
  house: "-house-",
  gender: "-gender"
};

//OBJECT CONTAINING ALL GLOBAL DOM VARIABLES
const DOM = {
  jsonLink: "http://petlatkea.dk/2019/hogwartsdata/students.json",
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

//ASSIGNING DATA TO STUDENT OBJECT
function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    //Create new object with cleaned data
    const student = Object.create(Student);
    //Interpret jsonObject into student properties
    let fullname = jsonObject.fullname.trim();
    student.firstName = fullname.split(" ")[0];
    if (fullname.split(" ").length === 2) {
      student.lastName = fullname.split(" ")[1];
    } else {
      student.lastName = fullname.split(" ")[2];
      student.middleName = fullname.split(" ")[1];
    }
    student.house = jsonObject.house.toLowerCase().trim();
    student.gender = jsonObject.gender;

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

    //event listener for displaying modal
    clone.querySelector(".button").addEventListener("click", () => {
      displayModal(student);
    });

    //displaying modal function
    function displayModal(student) {
      if (student.middleName !== "-middlename-") {
        DOM.modalHeading.textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
      } else {
        DOM.modalHeading.textContent = `${student.firstName} ${student.lastName}`;
      }

      // DOM.modalImg.src = `assets/students_photos/${student.lastName.toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
      DOM.modalHouseImg.src = `assets/${student.house.toLowerCase()}.png`;
      console.log(student.house);
      DOM.html.setAttribute(
        "data-attribute",
        `${student.house.toLowerCase()}-colors`
      );
      if (student.lastName === "Patil") {
        DOM.modalImg.src = `assets/students_photos/${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
      } else {
        DOM.modalImg.src = `assets/students_photos/${student.lastName.toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
      }
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
