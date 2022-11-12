const axios = require("axios");

const mentors = require("./mentors.js");

const baseURL = "http://localhost:3000";

async function execute() {
    for (i in mentors) {
	const response = await axios.post(`${baseURL}/api/mentors`, mentors[i]);
	if (response.status != 200)
	    console.log(`Error adding ${mentors[i].name}, code ${response.status}`)
	else
	    console.log(response.data)
    }
};

execute()
