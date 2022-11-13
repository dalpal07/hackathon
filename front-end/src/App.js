import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Mentor from './Mentor.js'

var targetTime = ""
var targetDay = ""
var targetSubject = ""

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
    const [filteredMentors, setFilteredMentors] = useState([]);

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
      setFilteredMentors(response.data.mentors);
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
    
//Filter on all
    function filterOnAll() {
	console.log(targetDay + ", " + targetSubject + ", " + targetTime)
	let dayMentors = []
    let subjectMentors = []
    let timeMentors = []
    if (targetDay !== "") {
      for (let i = 0; i < mentors.length; ++i) {
        let containsDay = false
        for (let j = 0; j < mentors[i].Times.length; ++j) {
          if (mentors[i].Times[j].day === targetDay) {
            containsDay = true
          }
        }
        if (containsDay) {
          dayMentors.push(mentors[i])
        }
      }
    }
	else {
	    dayMentors = mentors.slice()
	}
    if (targetSubject !== "") {
      for (let i = 0; i < dayMentors.length; ++i) {
        if (dayMentors[i].Subjects.includes(targetSubject)) {
          subjectMentors.push(dayMentors[i])
        }
      }
    }
    else {
	subjectMentors = dayMentors.slice();
    }
    if (targetTime !== "") {
      for (let i = 0; i < subjectMentors.length; ++i) {
        let withinRange = false
        for (let j = 0; j < subjectMentors[i].Times.length; ++j) {
          let start = subjectMentors[i].Times[j].start[0] + subjectMentors[i].Times[j].start[1]
          let end = subjectMentors[i].Times[j].end[0] + subjectMentors[i].Times[j].end[1]
          if ((Number(targetTime) < Number(end)) && (Number(targetTime) >= Number(start)) && (targetDay === "" || targetDay === subjectMentors[i].Times[j].day)) {
            withinRange = true
          }
        }
        if (withinRange) {
          timeMentors.push(subjectMentors[i])
        }
      }
    }
    else {
      timeMentors = subjectMentors.slice();
    }
    setFilteredMentors(timeMentors)
  }

  //Filter on weekday
    const filterOnDay = async(e) => {
	targetDay = e.target.value
	filterOnAll()
  }

  //Filter on subjects
    const filterOnSubject = async(e) => {
	targetSubject = e.target.value
	filterOnAll()
  }

  //Filter on time
    const filterOnTime = async(e) => {
      targetTime = e.target.value[0] + e.target.value[1]
      filterOnAll()
    }

    // render results
    if (currentMentor.id === undefined) {
    return (
      <div className="App">
            {error}
	<h1>The Human Library</h1> 
        <form onSubmit={addMentor}>
            <div>
	    <select name="subject" onChange={filterOnSubject} className="slight-design">
	    <option value="none" selected disabled hidden>Select a Subject</option>
	    {subjects.map( subject => {
        if (subject.name !== undefined) {
            return (<option value={subject.name} key={subject.id}>{subject.name}</option>)
        }
        })}
       </select>
	    <select name="days" onChange={filterOnDay} className="slight-design">
	    <option value="none" selected disabled hidden>Select a Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
	        </select>
            <input type="time" min="05:00" max="22:00" className="slight-design" onChange=(filterOnTime}/>           
           </div>
        </form>
        <h1>Mentors</h1>
          {filteredMentors.map( mentor => (
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
	      <div className="info">
	      <h3>Subjects:</h3>
	      <p>
	      {currentMentor.Subjects.map(subject => (
		      <span>{subject}<br/></span>
	      ))}
	  </p>
	      </div>
	      <div className="info">
	      <h3>Available Times:</h3>
	      <p>
	      {currentMentor.Times.map(time => (
		      <span>{time.day}: {time.start} - {time.end}<br/></span>
	      ))}
	  </p>
	      </div>
	      <div className="info">
	      <h3>Contact Information:</h3>
	      <p>
	      {currentMentor.firstName.toLowerCase()}.{currentMentor.lastName.toLowerCase()}@gmail.com<br/>
	      801-{Math.floor(100 + Math.random() * 900)}-{Math.floor(1000 + Math.random() * 9000)}
	  </p>
	</div>
	      <div id="back">
              <button onClick={e => setCurrentMentor({})} className="slight-design">Back</button>
	      </div>
          </div>
      );
      }
}

export default App;
