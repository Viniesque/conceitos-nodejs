const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req, res, next){
    const { id } = req.params

    if(!isUuid(id))
        return res.status(400).json({error: 'Invalid repository id'})
    
    return next()
}

app.get("/repositories", (request, response) => {
    return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body
    const likes = 0

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes
    }
    repositories.push(repository)
    return response.status(201).json(repository)
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
    const { id } = request.params
    const {title, url, techs } = request.body

    const repositoryIndex = repositories.findIndex(repo => {
        return repo.id == id
    })

    if(repositoryIndex < 0)
        return response.status(400).json({error: 'Repository not found!'})

    repositories[repositoryIndex].title = title
    repositories[repositoryIndex].url = url
    repositories[repositoryIndex].techs = techs

    return response.status(200).json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", validateRepositoryId,(request, response) => {
    const { id } = request.params

    const repositoryIndex = repositories.findIndex(repo => {
        return repo.id == id
    })

    if(repositoryIndex < 0)
        return response.status(400).json({error: 'Repository not found!'})

    repositories.splice(repositoryIndex, 1)
    return response.status(204).json({})
    
});

app.post("/repositories/:id/like", validateRepositoryId,(request, response) => {
    const { id } = request.params

    const repositoryIndex = repositories.findIndex(repo => {
        return repo.id == id
    })

    if(repositoryIndex < 0)
        return response.status(400).json({error: 'Repository not found!'})

    repositories[repositoryIndex].likes++
    return response.status(200).json({likes: repositories[repositoryIndex].likes})
});

module.exports = app;