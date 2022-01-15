import React, { useState, useLayoutEffect } from 'react'
import noteService from './services/persons'
import './index.css'

const Button = ({ handleClick, text, className }) => {
  return (
    <button onClick={handleClick} className={className}>
      {text}
    </button>
  )
}

const RenderPersons = ({ persons, search, setPersons, setNotif }) => {
  return persons
    .filter((p) => {
      if (search === '') {
        return p
      } else if (p.name.toLowerCase().includes(search.toLowerCase())) {
        return p
      } else {
        return null
      }
    })
    .map((person) => {
      return (
        <div key={person.name} className="person">
          {person.name + ' - ' + person.number} &nbsp;
          <Button
            className="delButton"
            text="delete"
            handleClick={() => {
              if (window.confirm(`Really want to delete ${person.name}?`)) {
                setNotif(`${person.name} has been deleted`)
                setTimeout(() => {
                  setNotif(null)
                }, 3000)
                noteService.deletePerson(person)
                const copy = persons.filter((p) => p.name !== person.name)
                setPersons(copy)
              }
            }}
          />
        </div>
      )
    })
}

const Form = ({
  addName,
  newName,
  newNumber,
  onNameChange,
  onNumberChange,
}) => {
  return (
    <form onSubmit={addName} className="form">
      <div className="f">
        <input value={newName} placeholder="name" onChange={onNameChange} />
      </div>
      <div className="f">
        <input
          placeholder="number"
          value={newNumber}
          onChange={onNumberChange}
        />
      </div>
      <div className="addDiv">
        <button type="submit" className="add">
          add
        </button>
      </div>
    </form>
  )
}

const Notification = ({ notif }) => {
  if (notif === null) {
    return null
  }
  return <div className="notif">{notif}</div>
}

const Search = ({ search, onSearchChange }) => {
  return (
    <div className="se">
      <input value={search} onChange={onSearchChange} placeholder="search" />
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notif, setNotif] = useState(null)

  useLayoutEffect(() => {
    noteService.getAll().then((p) => {
      setPersons(p)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
    setNewNumber(event.target.value)

    const nameObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.find((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already there, wanna change the number to the new one?`
        )
      ) {
        noteService.updatePerson(newName, newNumber, setNotif, notif)
        const copy2 = [...persons]
        copy2.map((per) =>
          per.name === newName ? (per.number = newNumber) : void 0
        )
        setPersons(copy2)
      }
    } else {
      noteService
        .create(nameObject)
        .then((createdPerson) => {
          setPersons(persons.concat(nameObject))
          setNotif(`${newName} has been created`)
          setTimeout(() => {
            setNotif(null)
          }, 3000)
        })
        .catch((e) => {
          setNotif(e.response.data.error)
          setTimeout(() => {
            setNotif(null)
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const onNameChange = (event) => {
    setNewName(event.target.value)
  }

  const onNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const onSearchChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <h1 className="h1">Phonebook</h1>
      <Notification notif={notif} />
      <h3>Search</h3>
      <Search search={search} onSearchChange={onSearchChange} />
      <h3>New number</h3>
      <Form
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        onNameChange={onNameChange}
        onNumberChange={onNumberChange}
      />
      <h3 className="h3">Numbers</h3>
      <RenderPersons
        persons={persons}
        search={search}
        setPersons={setPersons}
        notif={notif}
        setNotif={setNotif}
      />
    </div>
  )
}

export default App
