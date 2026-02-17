import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import { createLogger } from './server/utils/logger.js'
import { createCookRoute } from './server/routes/cook.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 4000)
const PROJECT_CWD = process.env.PROJECT_CWD

if (!PROJECT_CWD) {
  console.error('PROJECT_CWD not set')
  process.exit(1)
}

process.chdir(PROJECT_CWD)

// Setup Express app
const app = express()
const httpServer = createServer(app)

// Setup Socket.io
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

// Middleware
app.use(cors())
app.use(express.json())

// Create logger
const logger = createLogger(io)

// Routes
app.get('/health', (_, res) => {
  res.sendStatus(200)
})

app.post('/cook', createCookRoute(io, logger))

// Track if we've shown the stop prompt
let hasShownStopPrompt = false

// Listen for cooking completion to show stop prompt
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    // When all clients disconnect after cooking, show the prompt
    if (io.engine.clientsCount === 0 && !hasShownStopPrompt) {
      hasShownStopPrompt = true
      setTimeout(() => {
        console.log('\n👨‍🍳 Project ready! Press q or Ctrl+C to stop the server.\n')
      }, 1000)
    }
  })
})

// Serve static files
const staticPath = path.resolve(__dirname, '../app')
app.use(express.static(staticPath))

app.get('*', (_, res) => {
  res.sendFile(path.join(staticPath, 'index.html'))
})

// Start server
httpServer.listen(PORT, () => {
  logger.log(`Server running on ${PORT}`)
})