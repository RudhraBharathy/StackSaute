import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 4000)
const PROJECT_CWD = process.env.PROJECT_CWD

if (!PROJECT_CWD) {
    console.error('PROJECT_CWD not set')
    process.exit(1)
}

process.chdir(PROJECT_CWD)

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
})

app.use(cors())
app.use(express.json())

const log = (
    message: string,
    type: 'info' | 'success' | 'error' | 'warn' = 'info'
) => {
    const stamp = new Date().toLocaleTimeString()
    const line = `[${stamp}] ${message}`

    const color = {
        info: chalk.blue,
        success: chalk.green,
        error: chalk.red,
        warn: chalk.yellow
    }[type]

    console.log(color(line))
    io.emit('log', { message: line, type })
}

app.get('/health', (_, res) => {
    res.sendStatus(200)
})

app.post('/cook', async (req, res) => {
    const { framework, manager, typescript, packages } = req.body

    if (!framework || !manager) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    }

    if (!['react', 'nextjs'].includes(framework)) {
        res.status(400).json({ error: 'Unsupported framework' })
        return
    }

    if (!['npm', 'pnpm', 'yarn'].includes(manager)) {
        res.status(400).json({ error: 'Unsupported package manager' })
        return
    }

    res.json({ status: 'cooking_started' })

    try {
        log(`Order received: ${framework}`, 'info')

        if (framework === 'react') {
            await run(
                'npx',
                ['create-vite@latest', '.', '--template', typescript ? 'react-ts' : 'react']
            )
        }

        if (framework === 'nextjs') {
            await run(
                'npx',
                [
                    'create-next-app@latest',
                    '.',
                    typescript ? '--typescript' : '--js',
                    '--eslint',
                    '--no-src-dir',
                    '--import-alias',
                    '@/*'
                ]
            )
        }

        log('Base framework ready', 'success')

        if (Array.isArray(packages) && packages.length) {
            // Append @latest to each package to ensure latest versions are installed
            const packagesWithLatest = packages.map(pkg => `${pkg}@latest`)

            const args =
                manager === 'npm'
                    ? ['install', ...packagesWithLatest]
                    : manager === 'pnpm'
                        ? ['add', ...packagesWithLatest]
                        : ['add', ...packagesWithLatest]

            await run(manager, args)
            log(`Installed packages (latest): ${packages.join(', ')}`, 'success')
        }

        io.emit('cooking_complete', { success: true })
        log('Order completed', 'success')
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        log(msg, 'error')
        io.emit('cooking_complete', { success: false, error: msg })
    }
})

function run(cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })

        p.stdout.on('data', d =>
            d
                .toString()
                .split('\n')
                .filter(Boolean)
                .forEach((l: string) => log(l, 'info'))
        )

        p.stderr.on('data', d =>
            d
                .toString()
                .split('\n')
                .filter(Boolean)
                .forEach((l: string) => log(l, 'warn'))
        )

        p.on('close', c => (c === 0 ? resolve() : reject(new Error(`Exit ${c}`))))
        p.on('error', reject)
    })
}

const staticPath = path.resolve(__dirname, '../../src/app/dist')

app.use(express.static(staticPath))

app.get('*', (_, res) => {
    res.sendFile(path.join(staticPath, 'index.html'))
})

httpServer.listen(PORT, () => {
    log(`Server running on ${PORT}`, 'info')
})
