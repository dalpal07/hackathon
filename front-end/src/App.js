import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Mentor from './Mentor.js'

function App() {
  // setup state
  const [mentors, setMentors] = useState([]);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [subjects, setSubjects] = useState("");
  const [times, setTimes] = useState("");

  const fetchMentors = async() => {
    try {      
      const response = await axios.get("/api/mentors");
      setMentors(response.data.mentors);
    } catch(error) {
      setError("error retrieving mentors: " + error);
    }
  }
  const createMentor = async() => {
    try {
      await axios.post("/api/mentors", {firstName: firstName, lastName: lastName, userName: userName, Subjects: subjects, Times: times});
    } catch(error) {
      setError("error adding a mentor: " + error);
    }
  }
  const deleteOneMentor = async(mentor) => {
    try {
      await axios.delete("/api/mentors/" + mentor.userName);
    } catch(error) {
      setError("error deleting a mentor" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchMentors();
  },[]);

  const addMentor = async(e) => {
    e.preventDefault();
    await createMentor();
    fetchMentors();
    setFirstName("");
    setLastName("");
  }

  const deleteMentor = async(mentor) => {
    await deleteOneMentor(mentor);
    fetchMentors();
  }

  // render results
  return (
    <div className="App">
      {error}
      <h1>Add a Person</h1>
      <form onSubmit={addMentor}>
        <div>
          <label>
            First Name:
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
          </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
      <h1>Mentors</h1>
        {mentors.map( mentor => (
         <Mentor mentor={mentor} deleteOneMentor={deleteOneMentor} fetchMentors={fetchMentors}/>
        ))}   
    </div>
  );
}

export default App;