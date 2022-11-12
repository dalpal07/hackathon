const axios = require("axios");

const subjects = require("./subjects.js");

const baseURL = "http://localhost:3000";

async function execute() {
    for (i in subjects) {
	const response = await axios.post(`${baseURL}/api/subjects`, subjects[i]);
	if (response.status != 200)
	    console.log(`Error adding ${subjects[i].name}, code ${response.status}`)
	else
	    console.log(response.data)
    }
};

execute()
