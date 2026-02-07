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

async function waitForHealth(port: number, timeout = 8000) {
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

  server.on('exit', code => {
    log.error(`Server exited (${code})`)
    process.exit(code ?? 1)
  })

  try {
    await waitForHealth(port)
    const url = `http://localhost:${port}`
    log.success(`Serving at ${url}`)
    await open(url)
  } catch (e) {
    log.error((e as Error).message)
    process.exit(1)
  }

  const cleanup = () => {
    log.info('Cleaning kitchen...')
    server.kill()
    process.exit(0)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', d => {
      if (d.toString().toLowerCase() === 'q') cleanup()
    })
  }
}

main()
