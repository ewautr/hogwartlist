"use strict";
//TODO: GENERALIZE UPPER LOWER CASING CODE
//TODO: SELECTED HOUSE HIGHLIGHTS THE NUMBER OF STUDENTS

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
  jsonLinkFamilies: "http://petlatkea.dk/2019/hogwartsdata/families.json",
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
  html: document.querySelector("html"),
  modalBloodStatus: document.querySelector(".bloodStatus"),
  numberAllStudents: document.querySelector(".numberAllStudents"),
  numberExpStudents: document.querySelector(".numberExpStudents"),
  numberGrifStudents: document.querySelector(".numberGrifStudents"),
  numberHufStudents: document.querySelector(".numberHufStudents"),
  numberRavStudents: document.querySelector(".numberRavStudents"),
  numberSlyStudents: document.querySelector(".numberSlyStudents")
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
    student.firstName =
      student.firstName.substring(0, 1).toUpperCase() +
      student.firstName.substring(1).toLowerCase();

    if (fullname.split(" ").length === 2) {
      student.lastName = fullname.split(" ")[1];
      student.lastName =
        student.lastName.substring(0, 1).toUpperCase() +
        student.lastName.substring(1).toLowerCase();
    } else if (fullname.split(" ").length === 3) {
      student.middleName = fullname.split(" ")[1];
      student.lastName = fullname.split(" ")[2];
      student.lastName =
        student.lastName.substring(0, 1).toUpperCase() +
        student.lastName.substring(1).toLowerCase();
    }
    student.house = jsonObject.house.toLowerCase().trim();
    student.gender = jsonObject.gender;
    //Pushing results to all students array
    allStudents.push(student);
  });
  displayList(allStudents);
  displayListDetails(allStudents);
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
      DOM.modalHouseImg.src = `assets/${student.house}.png`;
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

    //PURE BLOOD
    loadFamilyJSON();
    const Family = {
      halfBlood: "-half-",
      pureBlood: "-pure-"
    };
    function loadFamilyJSON() {
      fetch(DOM.jsonLinkFamilies)
        .then(response => response.json())
        .then(jsonFamilyData => {
          prepareFamilyObject(jsonFamilyData);
        });
    }
    function prepareFamilyObject(jsonFamilyData) {
      //Create new object with cleaned data
      const family = Object.create(Family);
      //Interpret jsonObject into student properties
      family.halfBlood = jsonFamilyData.half;
      family.pureBlood = jsonFamilyData.pure;
      checkBloodStatus(family);
    }
    function checkBloodStatus(family) {
      if (family.halfBlood.includes(`${student.lastName}`)) {
        DOM.modalBloodStatus.textContent = `blood status: halfblood`;
      } else if (family.pureBlood.includes(`${student.lastName}`)) {
        DOM.modalBloodStatus.textContent = `blood status: pureblood`;
      } else {
        DOM.modalBloodStatus.textContent = `blood status: non-magical parents`;
      }
    }

    //appending to DOM
    DOM.parent.appendChild(clone); // puts the tamplate in my <ol>
  }
}

//DISPLAYING LIST DETAILS
function displayListDetails(allStudents) {
  console.log(allStudents);
  DOM.numberAllStudents.textContent = `Students: ${allStudents.length}`;
}

//FADING BACKGROUND IMAGE WITH DELAY
function backgroundFade() {
  DOM.wrapperDiv.style.opacity = "0.2";
}
