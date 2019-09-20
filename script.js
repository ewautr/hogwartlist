"use strict";

//INITIAL SETUP
const allStudents = [];
let currentList = [];
let expelledList = [];
let prefectsList = [];

//STUDENT PROTOTYPE
const Student = {
  firstName: "-firstname-",
  middleName: "-middlename-",
  lastName: "-lastname-",
  house: "-house-",
  gender: "-gender",
  id: "-id-",
  expelled: false,
  prefect: false,
  squad: false
};

//OBJECT CONTAINING ALL GLOBAL VARIABLES
const DOM = {
  jsonLink: "http://petlatkea.dk/2019/hogwartsdata/students.json",
  jsonLinkFamilies: "http://petlatkea.dk/2019/hogwartsdata/families.json",
  parent: document.querySelector("ol"),
  template: document.querySelector("template"),
  wrapperDiv: document.querySelector(".background"),
  filterDropdown: document.querySelector("#filter"),
  sortDropdown: document.querySelector("#sort"),
  modal: document.querySelector(".modal"),
  modalClose: document.querySelector(".modal__close"),
  modalHeading: document.querySelector(".modal__heading"),
  modalDesc: document.querySelector(".modal__text"),
  modalImg: document.querySelector(".modal__img--student"),
  modalHouseImg: document.querySelector(".modal__img--symbol"),
  modalButton: document.querySelector(".button"),
  modalExpelledInfo: document.querySelector(".expelledInfo"),
  html: document.querySelector("html"),
  modalBloodStatus: document.querySelector(".bloodStatus"),
  modalPrefectBtn: document.querySelector(".prefect-button"),
  modalPrefectImg: document.querySelector(".modal__img--prefect"),
  modalSquadBtn: document.querySelector(".squad-button"),
  modalSquadText: document.querySelector(".squad-text"),
  numberAllStudents: document.querySelector(".numberAllStudents"),
  numberExpStudents: document.querySelector(".numberExpStudents"),
  numberGryfStudents: document.querySelector(".numberGrifStudents"),
  numberHufStudents: document.querySelector(".numberHufStudents"),
  numberRavStudents: document.querySelector(".numberRavStudents"),
  numberSlyStudents: document.querySelector(".numberSlyStudents"),
  mainList: document.querySelector(".main-list")
};

//CALLING INIT FUNCTION ON PAGE LOAD
document.addEventListener("DOMContentLoaded", init);

function init() {
  //Event listener for sorting and filtering
  DOM.sortDropdown.addEventListener("change", sortList);
  DOM.filterDropdown.addEventListener("change", filterList);
  //Event listener for expelling students
  DOM.mainList.addEventListener("click", expellStudent);
  backgroundFade();
  loadJSON();
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
    student.expelled = false;
    student.prefect = false;
    student.squad = false;
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
  ewaStudent.expelled = false;
  ewaStudent.prefect = false;
  ewaStudent.squad = false;
  allStudents.push(ewaStudent);
  rebuildList();
}

//CREATING CURRENTLIST ARRAY WITH MODIFIED DATA
function rebuildList() {
  filterListBy("all");
  sortListBy("all");
  displayList(currentList);
}

//SORTING FUNCTION
function sortList(event) {
  const sortBy = event.target.value;
  sortListBy(sortBy);
  displayList(currentList);
}
function sortListBy(prop) {
  currentList.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
}

//FILTERING FUNCTION
function filterList(event) {
  const filterBy = event.target.value;
  if (filterBy === "expelled") {
    displayList(expelledList);
  } else {
    filterListBy(filterBy);
    displayList(currentList);
  }
}
function filterListBy(filterBy) {
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
  //Emptying the list
  DOM.parent.innerHTML = "";

  students.forEach(displayStudent);
  displayListDetails(currentList);
}

// DEFINING THE CLONE
function displayStudent(student) {
  //Creating clone
  const clone = DOM.template.cloneNode(true).content;

  //Populating it
  clone.querySelector(
    "li"
  ).innerHTML = `${student.firstName} ${student.lastName}, ${student.house}`;

  //Adding uuid to buttons as a data attribute
  clone.querySelector("[data-id=uuid]").dataset.id = student.id;
  clone.querySelector("[data-field=prefect]").dataset.id = student.id;

  //Event listener for making prefects
  clone
    .querySelector("[data-field=prefect]")
    .addEventListener("click", makePrefect);

  //Event listener for displaying modal
  clone.querySelector(".main-list__button").addEventListener("click", () => {
    displayModal(student);
  });

  //Defining the modal content
  function displayModal() {
    //Name, last name, middle name
    if (student.middleName !== "-middlename-") {
      DOM.modalHeading.textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
    } else {
      DOM.modalHeading.textContent = `${student.firstName} ${student.lastName}`;
    }
    //Photo
    DOM.modalHouseImg.src = `assets/${student.house}.png`;
    if (student.lastName === "Patil") {
      DOM.modalImg.src = `assets/students_photos/${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
    } else {
      DOM.modalImg.src = `assets/students_photos/${student.lastName.toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    }
    //House colors (border-bottoms)
    DOM.html.setAttribute(
      "data-attribute",
      `${student.house.toLowerCase()}-colors`
    );
    //Expelled student status
    if (student.expelled) {
      DOM.modalExpelledInfo.innerHTML = "Student status: E X P E L L E D";
      DOM.modalExpelledInfo.style.color = "rgb(124, 0, 0)";
    }
    //Prefect badge
    if (student.prefect) {
      DOM.modalPrefectImg.style.opacity = "1";
    } else {
      DOM.modalPrefectImg.style.opacity = "0";
    }

    //Adding id to the inq squad making button + event listener
    DOM.modalSquadBtn.dataset.id = student.id;
    DOM.modalSquadBtn.addEventListener("click", makeSquad);

    //Inquisitorial squad display
    if (student.house === "slytherin") {
      DOM.modalSquadBtn.classList.remove("hidden");
    } else {
      DOM.modalSquadBtn.classList.add("hidden");
    }
    if (student.squad) {
      DOM.modalSquadBtn.innerHTML = `delete from Inquisitorial Squad`;
    } else {
      DOM.modalSquadBtn.innerHTML = `add to Inquisitorial Squad`;
    }
    if (student.squad === false) {
      DOM.modalSquadText.innerHTML = ``;
    }

    //Remove hiding class from the modal - showing it
    DOM.modal.classList.remove("hidden");
    DOM.modalClose.addEventListener("click", closeModal);

    //Closing the modal when 'x' clicked
    function closeModal(event) {
      event.target.parentElement.parentElement.parentElement.classList.add(
        "hidden"
      );
    }
  }

  //CHECK AND DISPLAY BLOOD STATUS
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

  //Appending clone to DOM
  DOM.parent.appendChild(clone); // puts the tamplate in my <ol>
}

//DISPLAYING LIST DETAILS
function displayListDetails() {
  DOM.numberAllStudents.textContent = `Students: ${allStudents.length}`;
  DOM.numberExpStudents.textContent = `Expelled: ${expelledList.length}`;
  DOM.numberGryfStudents.textContent = `Gryffindor: ${getNumberofStudents(
    "gryffindor"
  )}`;
  DOM.numberHufStudents.textContent = `Hufflepuff: ${getNumberofStudents(
    "hufflepuff"
  )}`;
  DOM.numberSlyStudents.textContent = `Slytherin: ${getNumberofStudents(
    "slytherin"
  )}`;
  DOM.numberRavStudents.textContent = `Ravenclaw: ${getNumberofStudents(
    "ravenclaw"
  )}`;
  //Function for getting the current number of students in each house
  function getNumberofStudents(house) {
    let group = allStudents.filter(filterByHouse);
    function filterByHouse(student) {
      if (student.house === house || house === "all") {
        return true;
      } else {
        return false;
      }
    }
    return group.length;
  }
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

    allStudents[listId].prefect = false;
    currentList[currentListId].prefect = false;

    expelledList.push(currentList[currentListId]);
    expelledList.forEach(student => {
      student.expelled = true;
    });
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

//MAKE PREFECT FUNCTION
function makePrefect(event) {
  let element = event.target;
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
  const listId = findById(allStudents, clickedId);
  const currentListId = findById(currentList, clickedId);
  const prefectsId = findById(prefectsList, clickedId);
  const personHouse = allStudents[listId].house;
  let counter = 0;
  let currentPrefects = [];

  for (let i = 0; i < prefectsList.length; i++) {
    if (personHouse == prefectsList[i].house) {
      counter++;
      currentPrefects.push(prefectsList[i]);
    }
  }

  if (
    allStudents[listId].prefect == true ||
    currentList[currentListId].prefect == true
  ) {
    allStudents[listId].prefect = false;
    currentList[currentListId].prefect = false;
    prefectsList.splice(prefectsId, 1);
    element.innerHTML = "+";
    element.classList.remove("cantremove");
  } else if (counter < 2) {
    allStudents[listId].prefect = true;
    currentList[currentListId].prefect = true;
    prefectsList.push(allStudents[listId]);
    element.innerHTML = "-";
  } else {
    document.querySelector(".alert").style.visibility = "visible";
    document.querySelector(".alert__close").addEventListener("click", () => {
      document.querySelector(".alert").style.visibility = "hidden";
    });
    document.querySelector(
      ".alert-text"
    ).innerHTML = `There can't be more than 2 prefects<span class="emName">!</span> <br><br> Current prefects are: <br> <span class="emName"> ${currentPrefects[0].firstName} ${currentPrefects[0].lastName} </span> and <span class="emName">${currentPrefects[1].firstName} ${currentPrefects[1].lastName} </span>`;
  }
}

//MAKE INQUISITORIAL SQUAD FUNCTION
function makeSquad(event) {
  let element = event.target;
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
  const listId = findById(allStudents, clickedId);
  const currentListId = findById(currentList, clickedId);
  if (
    allStudents[listId].squad == true ||
    currentList[currentListId].squad == true
  ) {
    allStudents[listId].squad = false;
    currentList[currentListId].squad = false;
    console.log("kicked out");
    DOM.modalSquadText.innerHTML = ``;
    DOM.modalSquadBtn.innerHTML = `add to Inquisitorial Squad`;
  } else if (allStudents[listId].house == "slytherin") {
    allStudents[listId].squad = true;
    currentList[currentListId].squad = true;
    console.log("made to squad");
    DOM.modalSquadText.innerHTML = `${allStudents[listId].firstName} is a member of the Inquisitorial Squad`;
    DOM.modalSquadBtn.innerHTML = `delete from Inquisitorial Squad`;
  } else {
    console.log("how tf did that even happen");
  }
}

//FADING BACKGROUND IMAGE
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
