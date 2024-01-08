import express from 'express'
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import router from './routes/api/contacts-route.js';
import authRouter from './routes/api/auth-route.js';
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/users', authRouter)

app.use('/api/contacts', router)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message })
})

export default app;
