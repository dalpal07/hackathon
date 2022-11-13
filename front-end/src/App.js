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
  const [subjects, setSubjects] = useState([]);
  const [times, setTimes] = useState([]);
    const [currentMentor, setCurrentMentor] = useState({});

    const fetchSubjects = async() => {
	try {
	    const response = await axios.get("/api/subjects");
	    setSubjects(response.data.subjects);
	} catch(error) {
	    setError("error retrieving subjects: " + error);
	}
    }
 
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
      await axios.delete("/api/mentors/" + mentor._id);
    } catch(error) {
      setError("error deleting a mentor" + error);
    }
  }

  //Get a single mentor
  const getOneMentor = async(mentor) => {
    try {
      const data  = await axios.get('/api/mentors/' + mentor.userName);
      return data
    } catch(error) {
      setError("error getting the mentor" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchMentors();
  },[]);

    useEffect(() => {
    fetchSubjects();
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
    if (currentMentor.id === undefined) {
    return (
      <div className="App">
            {error}
	<h1>The Human Library</h1> 
        <form onSubmit={addMentor}>
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
	    {subjects.map( subject => {
		if (subject.name !== undefined) {
		    return (<option value={subject.name} key={subject.id}>{subject.name}</option>)
		}
	    })}
	   </select>
          </div>
          </form>
        <h1>Mentors</h1>
          {mentors.map( mentor => (
          <Mentor mentor={mentor} deleteOneMentor={deleteOneMentor} fetchMentors={fetchMentors} setCurrentMentor={setCurrentMentor}/>
          ))}   
      </div>
    );
  }
    else {
      return (
        <div className="App">
          {error}
              <h1>{currentMentor.lastName}, {currentMentor.firstName}</h1>
	      <h2>@{currentMentor.userName}</h2>
	      <h3>Subjects:</h3>
	      <p>
	      {currentMentor.Subjects.map(subject => (
		      <span>{subject}<br/></span>
	      ))}
	  </p>
	      <h3>Available Times:</h3>
	      <p>
	      {currentMentor.Times.map(time => (
		      <span>{time.day}: {time.start} - {time.end}<br/></span>
	      ))}
	  </p>
              <button onClick={e => setCurrentMentor({})}>Back</button>
          </div>
      );
      }
}

export default App;
