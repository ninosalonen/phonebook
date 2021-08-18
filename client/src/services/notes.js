import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const deletePerson = (person) => {
    getAll().then(res => {
        res.forEach(r => r.name === person.name ? axios.delete(`${baseUrl}/${r.id}`) : void(0))
    })
}

const updatePerson = (newName, newNumber, setNotif) => {
  let found = false
    getAll().then(res => {
        res.forEach(r => {
            if(r.name === newName){
                found = true
                r.number = newNumber
                axios.put(`${baseUrl}/${r.id}`, r)
            }
            if(!found){
              setNotif(`${newName} has already been deleted from the server, please refresh`)
              setTimeout(() => {
                setNotif(null)
              }, 3000)
            }else{
              setNotif(`${newName}'s number has been changed`)
              setTimeout(() => {
                setNotif(null)
              }, 3000)
            }
        })
    })
}

const noteService = { 
  getAll: getAll, 
  create: create,
  deletePerson: deletePerson,
  updatePerson: updatePerson,
  baseUrl: baseUrl
}

export default noteService
