import React from 'react'

class Mentor extends React.Component {
    constructor(props) {
        super(props)
        this.deleteMentor = this.deleteMentor.bind(this)
    }

    async deleteMentor(mentor) {
        await this.props.deleteOneMentor(mentor);
        this.props.fetchMentors();
      }

    render() {
        return (
            <div key={this.props.mentor.id} className="Mentor">
            <div className="names">
              <button className="slight-design mentorButton" onClick={e => this.props.setCurrentMentor(this.props.mentor)}>
              <p>{this.props.mentor.lastName}, {this.props.mentor.firstName}</p>
              </button>
            </div>
          </div>
        )
    }
}

export default Mentor
