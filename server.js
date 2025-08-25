const express = require('express')
const app = express()
const cors = require('cors')

const requestLogger = (req,res,next) => {
  console.log('Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Body: ', req.body);
  console.log('---');
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => Number(n.id)))
  : 0
  return String(maxId + 1)
}

app.get('/',(req,res)=>{
  res.send('<h1>Hello world suraj thakur</h1>')
})

app.get('/api/notes',(req,res)=>{
  res.json(notes)
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const body = req.body
  const noteIndex = notes.findIndex(note => note.id === id)

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' })
  }

  // Update the note
  const updatedNote = { ...notes[noteIndex], ...body }
  notes[noteIndex] = updatedNote

  res.json(updatedNote)
})


app.get('/api/notes/:id',(req,res)=>{
  const id = req.params.id
  const note = notes.find(note => note.id === id)
  if(note){
    res.json(note)
  }else{
    res.status(404).end()
  }
})

app.post('/api/notes', (request, response) => {
  const body = request.body
  
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }
  
  notes = notes.concat(note)
  
  response.json(note)
})

app.delete('/api/notes/:id',(req,res)=>{
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  
  res.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server running in port ${PORT}`);
  
})
