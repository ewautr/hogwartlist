"use strict";
//TODO: FIX NUMBERS IN LOIST DETAILS
//TODO: GENERALIZE UPPER LOWER CASING CODE
//TODO: SELECTED HOUSE HIGHLIGHTS THE NUMBER OF STUDENTS

//INITIAL SETUP
const allStudents = [];
let currentList = [];
let expelledList = [];

//PROTOTYPE STUDENT
const Student = {
  firstName: "-firstname-",
  middleName: "-middlename-",
  lastName: "-lastname-",
  house: "-house-",
  gender: "-gender",
  id: "-id-"
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
  numberSlyStudents: document.querySelector(".numberSlyStudents"),
  mainList: document.querySelector(".main-list")
};

//CALLING INIT FUNCTION ON PAGE LOAD
document.addEventListener("DOMContentLoaded", init);

function init() {
  DOM.sortDropdown.addEventListener("change", sortList);
  DOM.filterDropdown.addEventListener("change", filterList);
  DOM.mainList.addEventListener("click", expellStudent);
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
    student.id = uuidv4();
    //Pushing results to all students array
    allStudents.push(student);
  });
  //Making childhood dreams come true
  const ewaStudent = Object.create(Student);
  ewaStudent.firstName = "Ewa";
  ewaStudent.lastName = "Utracka";
  ewaStudent.house = "slytherin";
  ewaStudent.gender = "girl";
  ewaStudent.id = "666";
  allStudents.push(ewaStudent);
  rebuildList();
}

function rebuildList() {
  filterListBy("all");
  sortListBy("all");
  displayList(currentList);
}

function sortListBy(prop) {
  currentList.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
}

function filterList(event) {
  const filterBy = event.target.value;
  if (filterBy === "expelled") {
    displayList(expelledList);
  } else {
    filterListBy(filterBy);
    displayList(currentList);
  }
}

//FILTER DATA FUNCTION
function filterListBy(filterBy) {
  currentList = allStudents.filter(filterByHouse);
  function filterByHouse(student) {
    if (student.house === filterBy || filterBy === "all") {
      return true;
    } else {
      return false;
    }
  }
  return currentList.length;
}

//DISPLAYING THE LIST
function displayList(students) {
  DOM.parent.innerHTML = "";

  students.forEach(displayStudent);
  displayListDetails(currentList);
}

// DEFINING THE CLONE
function displayStudent(student, index) {
  //create clone
  const clone = DOM.template.cloneNode(true).content;

  //populating it
  clone.querySelector(
    "li"
  ).innerHTML = `${student.firstName} ${student.lastName}, ${student.house}`;

  // store the index on the button
  clone.querySelector("[data-action=remove]").dataset.index = index;

  // add uuid as the ID to the remove-button as a data attribute
  clone.querySelector("[data-id=uuid]").dataset.id = student.id;

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
function displayListDetails(currentList) {
  DOM.numberAllStudents.textContent = `Students: ${allStudents.length}`;
  DOM.numberExpStudents.textContent = `Expelled: ${expelledList.length}`;
  // DOM.numberGryfStudents.textContent = `Gryffindor: ${filterListBy(
  //   "gryffindor"
  // )}`;
  // DOM.numberHufStudents.textContent = `Hufflepuff: ${filterListBy(
  //   "hufflepuff"
  // )}`;
  // DOM.numberSlyStudents.textContent = `Slytherin: ${filterListBy("slytherin")}`;
  // DOM.numberRavStudents.textContent = `Ravenclaw: ${filterListBy("ravenclaw")}`;
}

//EXPELLING STUDENTS
function expellStudent(event) {
  let element = event.target;
  if (element.dataset.action === "remove" && element.dataset.id !== "666") {
    const clickedId = element.dataset.id;

    function findById(arr, index) {
      function findId(student) {
        if (index === student.id) {
          return true;
        } else {
          return false;
        }
      }
      return arr.findIndex(findId);
    }
    let listId = findById(allStudents, clickedId);
    let currentListId = findById(currentList, clickedId);

    expelledList.push(currentList[currentListId]);

    currentList.splice(currentListId, 1);
    allStudents.splice(listId, 1);

    element.parentElement.classList.add("remove");
    element.parentElement.addEventListener("animationend", function() {
      element.parentElement.remove();
    });

    displayListDetails(currentList, expelledList);
  } else if (element.dataset.id === "666") {
    element.parentElement.classList.add("cantremove");
    element.parentElement.addEventListener("animationend", function() {
      element.parentElement.classList.remove("cantremove");
    });
  }
}

//FADING BACKGROUND IMAGE WITH DELAY
function backgroundFade() {
  DOM.wrapperDiv.style.opacity = "0.2";
}

//CREATING UUID
// source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
