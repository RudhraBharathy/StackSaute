#!/usr/bin/env node
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import getPort from 'get-port'
import open from 'open'
import chalk from 'chalk'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const log = {
  info: (m: string) => console.log(chalk.blue('👨‍🍳 ') + m),
  success: (m: string) => console.log(chalk.green('🥘 ') + m),
  warn: (m: string) => console.log(chalk.yellow('🔪 ') + m),
  error: (m: string) => console.log(chalk.red('🔥 ') + m)
}

function validateNodeVersion() {
  const [major] = process.versions.node.split('.').map(Number)
  if (major < 20) {
    log.error('Node.js 20 or higher is required.')
    process.exit(1)
  }
}

function waitForHealth(port: number, timeout = 10000) {
  const start = Date.now()

  return new Promise<void>((resolve, reject) => {
    const check = () => {
      http
        .get(`http://localhost:${port}/health`, res => {
          if (res.statusCode === 200) return resolve()
          retry()
        })
        .on('error', retry)
    }

    const retry = () => {
      if (Date.now() - start > timeout) {
        reject(new Error('Server failed health check'))
      } else {
        setTimeout(check, 300)
      }
    }

    check()
  })
}

async function main() {
  validateNodeVersion()

  const cwd = process.cwd()
  const port = await getPort({ port: 4000 })

  log.info(`Kitchen directory: ${cwd}`)
  log.info(`Using port ${port}`)

  const serverPath = path.resolve(__dirname, '../src/server.js')

  const server = spawn('node', [serverPath], {
    env: {
      ...process.env,
      PORT: String(port),
      PROJECT_CWD: cwd
    },
    stdio: 'inherit'
  })

  server.on('error', err => {
    log.error(`Failed to start server: ${err.message}`)
    process.exit(1)
  })

  server.on('exit', code => {
    if (code !== 0) {
      log.error(`Server exited unexpectedly (${code})`)
      process.exit(code ?? 1)
    }
  })

  try {
    await waitForHealth(port)
    const url = `http://localhost:${port}`
    log.success(`Serving at ${url}`)
    await open(url)
  } catch (err) {
    log.error((err as Error).message)
    server.kill('SIGTERM')
    process.exit(1)
  }

  const cleanup = () => {
    log.info('Cleaning kitchen...')
    if (!server.killed) {
      server.kill('SIGTERM')
    }
    process.exit(0)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', d => {
      const key = d.toString().toLowerCase()
      if (key === 'q') cleanup()
    })
  }
}

main()
