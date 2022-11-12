import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Person from './Person.js'

function App() {
  // setup state
  const [persons, setPersons] = useState([]);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const fetchPersons = async() => {
    try {      
      const response = await axios.get("/api/persons");
      setPersons(response.data.persons);
    } catch(error) {
      setError("error retrieving persons: " + error);
    }
  }
  const createPerson = async() => {
    try {
      await axios.post("/api/persons", {firstName: firstName, lastName: lastName});
    } catch(error) {
      setError("error adding a person: " + error);
    }
  }
  const deleteOnePerson = async(person) => {
    try {
      await axios.delete("/api/persons/" + person.id);
    } catch(error) {
      setError("error deleting a person" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchPersons();
  },[]);

  const addPerson = async(e) => {
    e.preventDefault();
    await createPerson();
    fetchPersons();
    setFirstName("");
    setLastName("");
  }

  const deletePerson = async(person) => {
    await deleteOnePerson(person);
    fetchPersons();
  }

  // render results
    return (
	    <div className="App">
	    {error}
	    <h1>Add a Person</h1>
            <div>
            <input type="time" min="05:00" max="22:00"/>
	    <input type="time" min="05:00" max="22:00"/>
	    <select name="days">
	    <option value="Monday">Monday</option>
	    <option value="Tuesday">Tuesday</option>
	    <option value="Wednesday">Wednesday</option>
	    <option value="Thursday">Thursday</option>
	    <option value="Friday">Friday</option>
	    <option value="Saturday">Saturday</option>
	    <option value="Sunday">Sunday</option>
	    </select>
	    <select name="subject">
	    <option value="Math">Math</option>
	    <option value="Science">Science</option>
	    <option value="English">English</option>
	    <option value="Thursday">Thursday</option>
	    <option value="Friday">Friday</option>
	    <option value="Saturday">Saturday</option>
	    <option value="Sunday">Sunday</option>
	    </select>
            </div>
	    <h1>Persons</h1>
            {persons.map( person => (
		    <Person person={person} deleteOnePerson={deleteOnePerson} fetchPersons={fetchPersons}/>
            ))}
	</div>
  );
}

export default App;
