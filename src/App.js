import React, { useState, useEffect } from 'react';
import Header from './components/Header';

import './styles/App.css'

import api from './services/api'

function App() {
    const [projects, setProjects] = useState([])
    const [title, setTitle] = useState('');
    const [owner, setOwner] = useState('');

    async function handleProjects() {

        const data = {
            title,
            owner
        }
        
        await api.post('projects', data).then( response => {
            
            setProjects([...projects, response.data])
        } )
    }

    useEffect(() => {
        
        async function handleAllProjects() {

            await api.get('projects').then( response => {
                setProjects(response.data)
            } )
        }

        handleAllProjects()
    }, [])

    return (
        <>
            <Header title="Projects" />

            <ul>
                { projects &&
                    projects.map( project =>             
                        <li key={project.id}>{project.title} / {project.owner}</li>
                    )

                }
            </ul>
            
            <input
                type="text" 
                name="title" 
                onChange={ (e) => { setTitle(e.target.value) } }  
                value={title}             
            />
            <input 
                type="text" 
                name="onwer" 
                onChange={ (e) => { setOwner(e.target.value) } }  
                value={owner}              
            />

            <button type="button" onClick={handleProjects}>Adicionar novo projeto</button>
        </>
    )
}

export default App