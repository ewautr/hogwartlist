"use strict";
//TODO: GENERALIZE UPPER LOWER CASING CODE
//TODO: SELECTED HOUSE HIGHLIGHTS THE NUMBER OF STUDENTS

//INITIAL SETUP
const allStudents = [];
let currentList = [];

//PROTOTYPE STUDENT
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
  filterDropdown: document.querySelector("#filter"),
  sortDropdown: document.querySelector("#sort"),
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
  DOM.sortDropdown.addEventListener("change", sortList);
  DOM.filterDropdown.addEventListener("change", filterList);
  backgroundFade();
  loadJSON();
}

//FILTERING FUNCTION

function sortList(event) {
  const sortBy = event.target.value;
  sortListBy(sortBy);
  displayList(currentList);
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
  rebuildList();
  displayListDetails(allStudents);
}

function rebuildList() {
  filterListBy("all");
  sortListBy("name");
  displayList(currentList);
}

function sortListBy(prop) {
  currentList.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
}

function filterList(event) {
  const filterBy = event.target.value;
  filterListBy(filterBy);
  displayList(currentList);
}

//FILTER DATA FUNCTION
function filterListBy(filterBy) {
  console.log(filterBy);
  currentList = allStudents.filter(filterByHouse);
  function filterByHouse(student) {
    if (student.house === filterBy || filterBy === "all") {
      return true;
    } else {
      return false;
    }
  }
}

//DISPLAYING THE LIST
function displayList(students) {
  DOM.parent.innerHTML = "";

  students.forEach(displayStudent);
}

// DEFINING THE CLONE
function displayStudent(student) {
  //create clone
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

//DISPLAYING LIST DETAILS
function displayListDetails(allStudents) {
  DOM.numberAllStudents.textContent = `Students: ${allStudents.length}`;
}

//FADING BACKGROUND IMAGE WITH DELAY
function backgroundFade() {
  DOM.wrapperDiv.style.opacity = "0.2";
}
