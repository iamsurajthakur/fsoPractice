import express from 'express'
import cors from 'cors'
import Note from './models/note.js'

const app = express()
const PORT = process.env.PORT || 3000

const requestLogger = (req,_,next) => {
  console.log('Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Body: ', req.body);
  console.log('---');
  next()
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.get('/', (_,res) => {
  res.send('<h1>Hello world suraj thakur</h1>')
})

app.put('/api/notes/:id', (req, res) => {
  const body = req.body
  
  Note.findByIdAndUpdate(
    req.params.id,
    {content: body.content, important: body.important },
    {new: true}
  ).then(updatedNote => {
    res.json(updatedNote)
  })
})

app.get('/api/notes/:id', (req,res,next ) => {
  Note.findById(req.params.id)
  .then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  })
  .catch(e => next(e))
})

app.post('/api/notes', (req, res) => {
  const body = req.body
  
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }
  
  const note = new Note({
    content: body.content,
    important: body.important || false
  })
  
  note.save()
  .then(savedNote => {
    res.json(savedNote)
  })
  .catch(e => next(e))
})

app.get('/api/notes', (_,res) => {
  Note.find({}).then(note => {
    res.json(note)
  })
})

app.delete('/api/notes/:id', (req,res) => {
  Note.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  })
})

//   middleware defination
const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, _, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)


app.listen(PORT,() => {
  console.log(`Server is running at port ${PORT}`);
  
})

