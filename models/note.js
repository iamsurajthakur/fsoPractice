import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
mongoose.set('strictQuery', false)

try {
  const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
  console.log(`\n mongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);
    
} catch (e) {
  console.log('Connection error:', e);
  process.exit(1)
  
}

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = new mongoose.model('Note', noteSchema)

export default Note