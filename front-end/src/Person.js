import React from 'react'

class Person extends React.Component {
    constructor(props) {
        super(props)
        this.deletePerson = this.deletePerson.bind(this)
    }

    async deletePerson(person) {
        await this.props.deleteOnePerson(person);
        this.props.fetchPersons();
      }

    render() {
        return (
            <div key={this.props.person.id} className="person">
            <div className="names">
              <p>{this.props.person.lastName}, {this.props.person.firstName}</p>
            </div>
            <button onClick={e => this.deletePerson(this.props.person)}>Delete</button>
          </div>
        )
    }
}

export default Person
