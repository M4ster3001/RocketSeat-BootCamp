import React, { useEffect, useState } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])

  useEffect( () => {

    async function handleGetRepositories() {
      await api.get('repositories').then( response => {

        setRepositories(response.data)
      })
    }

    handleGetRepositories()    
  }, [])

  async function handleAddRepository() {
    const data = {
      'title': `Novo repositorio ${Date.now()}`,
      'url': `https://github.com/M4ster3001/Novo_repositorio ${Date.now()}`,
      'techs': ['ReactJS']
    }

    await api.post('repositories', data).then( response => {

      setRepositories([...repositories, response.data])
    })
  }

  async function handleRemoveRepository(id) {
    
    await api.delete(`repositories/${id}`).then( response => {      
      
      setRepositories(repositories.filter( repository => repository.id !== id))
    } )
  }

  return (
    <div>
      <ul data-testid="repository-list">

        { repositories &&
          repositories.map( repository =>  

            <li key={repository.id}>
              { repository.title }
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button></li>          
          )
        }
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
