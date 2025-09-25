import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
const PORT = process.env.PORT || 3000
const password = process.argv[2]
const url = `mongodb+srv://suraj:${password}@youtube.3jgyu4s.mongodb.net/noteApp?retryWrites=true&w=majority&appName=youtube`

mongoose.set('strictQuery', false)

try {
  const connectionInstance = await mongoose.connect(url)
  console.log(`\n mongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);
    
} catch (e) {
  console.log('Something went wrong, ',e);
  process.exit(1)
  
}

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const requestLogger = (req,_,next) => {
  console.log('Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Body: ', req.body);
  console.log('---');
  next()
}

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('dist'))

let notes = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: false },
  { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
]

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.get('/', (_,res) => {
  res.send('<h1>Hello world suraj thakur</h1>')
})

app.get('/api/notes', (_,res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const body = req.body
  const noteIndex = notes.findIndex(note => note.id === id)

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' })
  }

  const updatedNote = { ...notes[noteIndex], ...body }
  notes[noteIndex] = updatedNote

  res.json(updatedNote)
})

app.get('/api/notes/:id', (req,res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === id)
  if(note){
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.post('/api/notes', (req, res) => {
  const body = req.body
  
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }
  
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }
  
  notes = notes.concat(note)
  
  res.json(note)
})

app.delete('/api/notes/:id', (req,res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  
  res.status(204).end()
})

app.listen(PORT,() => {
  console.log(`Server is running at port ${PORT}`);
  
})

