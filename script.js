"use strict";

// GLOBAL VARIABLES
const myLink = "http://petlatkea.dk/2019/students1991.json";
const parent = document.querySelector("ol");
const template = document.querySelector("template");
const modal = document.querySelector(".modal");
const img = document.querySelector(".header-img");

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadJSON();

  //SETUP
  let students = [];
  let filter = "all";
  let sort;

  //EVENT FOR SORT AND FILTER SELECTION
  document.querySelectorAll("#filter").forEach(option => {
    option.addEventListener("change", filterBy);
  });
  document.querySelectorAll("#sort").forEach(option => {
    option.addEventListener("change", sortBy);
  });

  //FETCHING DATA FROM JSON
  async function loadJSON() {
    let jsonData = await fetch(myLink);
    students = await jsonData.json();
    //DISPLAY LIST
    displayData();
  }

  //DISPLAYING THE LIST
  function displayData() {
    console.log(students);
    parent.innerHTML = "";

    students.forEach(object => {
      //SEPARATING FIRST NAME AND LAST NAME
      const firstSpace = object.fullname.indexOf(" ");
      let firstName = object.fullname.substring(0, firstSpace);
      let lastName = object.fullname.substring(firstSpace + 1);
      object.firstName = firstName;
      object.lastName = lastName;

      //IF STATEMENT FOR FILTERING THE LIST
      if (filter == object.house || filter == "all") {
        //cloning the template
        const clone = template.cloneNode(true).content;

        //populating it
        clone.querySelector("li").innerHTML =
          firstName + " " + lastName + ", " + object.house;

        //appending to DOM
        parent.appendChild(clone); // puts the tamplate in my <ol>
      }
    });
  }

  //FILTER DATA FUNCTION
  function filterBy() {
    filter = this.value;
    displayData();
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
    displayData();
  }
}

function backgroundFade() {
  setTimeout(function() {
    document.querySelector(".background").style.backgroundImage =
      "linear-gradient(rgba(63, 63, 63, 0.7) 100%, transparent 50%)";
  }, 3000);
}

// const button = document.querySelector(".main-list__button");
// button.addEventListener("click", console.log("clicked"));
