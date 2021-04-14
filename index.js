const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const OUTPUT_DIR = path.resolve(__dirname, "dist");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");



const employeesData = [];
const questionsArray = [
  {
    type: "input",
    name: "name",
    message: "Enter the employee's name:",
  },
  {
    type: "list",
    name: "role",
    message: "Choose the employee's role:",
    choices: ["Manager", "Engineer", "Intern"],
  },
  {
    type: "input",
    name: "id",
    message: "Enter the employee's ID:",
  },
  {
    type: "input",
    name: "email",
    message: "Enter the employee's email:",
  },
  {
    type: "input",
    name: "officeNumber",
    message: "Enter this manager's office number:",
    when: function (response) {
      return response.role == "Manager";
    },
  },
  {
    type: "input",
    name: "github",
    message: "Enter this engineer's GitHub username:",
    when: function (response) {
      return response.role == "Engineer";
    },
  },
  {
    type: "input",
    name: "school",
    message: "Enter this intern's school name:",
    when: function (response) {
      return response.role == "Intern";
    },
  },
  {
    type: "list",
    name: "addAnother",
    message: "Add another employee?",
    choices: ["Yes, add another.", "No, render my new page."],
  },
];


const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

function runInquirer() {
  inquirer
    .prompt(questionsArray)
    .then(function (answers) {
      employeesData.push(answers);

      if (answers.addAnother == "Yes, add another.") {
        runInquirer();
      } else {
    
        const managersData = employeesData.filter(({ role }) => {
          return role == "Manager";
        });

        const managersArray = [];

        managersData.forEach((manager) => {
          const member = new Manager(
            manager.name,
            manager.id,
            manager.email,
            manager.officeNumber
          );
          managersArray.push(member);
        });

        const engineersData = employeesData.filter(({ role }) => {
          return role == "Engineer";
        });

        const engineersArray = [];

        engineersData.forEach((engineer) => {
          const member = new Engineer(
            engineer.name,
            engineer.id,
            engineer.email,
            engineer.github
          );
          engineersArray.push(member);
        });

        const internsData = employeesData.filter(({ role }) => {
          return role == "Intern";
        });

        const internsArray = [];

        internsData.forEach((intern) => {
          const member = new Intern(
            intern.name,
            intern.id,
            intern.email,
            intern.school
          );
          internsArray.push(member);
        });

        const employeesArray = [
          ...managersArray,
          ...engineersArray,
          ...internsArray,
        ];

        const renderTeam = render(employeesArray);
        fs.writeFile(outputPath, renderTeam, function (err) {
          if (err) throw err;
          console.log(
            "Render successful"
          );
        });
      }
    })
    .catch((error) => {
      if (error) throw error;
    });
}

runInquirer();
