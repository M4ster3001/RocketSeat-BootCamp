const express = require('express')
const {uuid} = require( 'uuidv4' )
const cors = require('cors')

const app = express();


app.use(express.json())
app.use(cors())

const projects = []

function logReq( req, resp, next ) {
    const {method, url} = req

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.time(logLabel)

    next()

    console.timeEnd(logLabel)
}

app.use('/projects', logReq)

app.get('/projects',  (req, resp) => {
    const {title} = req.query

    const results = title 
    ? projects.filter(project => project.title.includes(title)) 
    : projects

    return resp.json(results)
})


app.post('/projects',  (req, resp) => {
    const {title, owner} = req.body

    const project = { id: uuid(), title, owner }

    projects.push(project)

    return resp.json(project)
})


app.put('/projects/:id',  (req, resp) => {
    const {title, owner} = req.body

    const {id} = req.params

    projectIndex = projects.findIndex( project => project.id === id )

    if(projectIndex < 0){
        return resp.status(400).json({ error: 'Project not found' })
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project

    return resp.json(project)

})


app.delete('/projects/:id',  (req, resp) => {
    const {id} = req.params

    projectIndex = projects.findIndex( project => project.id === id )

    if(projectIndex < 0){
        return resp.status(400).json({ error: 'Project not found' })
    }

    projects.splice( projectIndex, 1 )

    return resp.status(204).send()
})

if(app.listen()) {
    app.listen().close()
}

app.listen( '7777', () => { console.log( 'Servidor rodando na porta 7777' ) } )
