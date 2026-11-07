import { watch } from 'node:fs'
import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'
import { generateContent } from './generate-content.mjs'

let server
let closing = false
let running = false
let dirty = false
let timer
let generationTask

function stopServer() {
  if (!server) return
  const child = server
  server = undefined
  if (process.platform === 'win32') {
    const taskkill = path.join(process.env.SystemRoot ?? 'C:/Windows', 'System32/taskkill.exe')
    const result = spawnSync(taskkill, ['/pid', String(child.pid), '/t', '/f'], {
      windowsHide: true,
      stdio: 'ignore',
    })
    if (result.error || result.status !== 0) {
      try {
        process.kill(child.pid, 0)
      } catch (error) {
        if (error.code === 'ESRCH') return
        throw error
      }
      server = child
      throw new Error('Could not stop the existing Next.js process; refusing to start another one')
    }
  } else {
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {
      /* Already exited. */
    }
  }
}

function startServer() {
  if (server || closing) return
  const child = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'dev', '--webpack', ...process.argv.slice(2)],
    {
      stdio: 'inherit',
      windowsHide: true,
      detached: process.platform !== 'win32',
    }
  )
  server = child
  child.on('exit', (code) => {
    if (server !== child) return
    server = undefined
    if (!closing) {
      watcher.close()
      process.exitCode = code ?? 1
    }
  })
}

async function regenerate() {
  if (running) {
    dirty = true
    return
  }
  running = true
  try {
    do {
      dirty = false
      // Keep Next from reading between removal and replacement of generated data.
      stopServer()
      try {
        const result = await generateContent()
        console.log(`Generated ${result.allDocuments.length} documents`)
        startServer()
      } catch (error) {
        stopServer()
        console.error(
          'Content generation failed; dev server stopped until the sources are fixed.',
          error.message
        )
      }
    } while (dirty && !closing)
  } finally {
    running = false
  }
}

function queueGeneration() {
  if (running) {
    dirty = true
    return generationTask
  }
  generationTask = regenerate()
  return generationTask
}

const watcher = watch(path.resolve('data'), { recursive: true }, (event, filename) => {
  if (closing || (event !== 'rename' && filename && !filename.endsWith('.mdx'))) return
  clearTimeout(timer)
  timer = setTimeout(queueGeneration, 150)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    if (closing) return
    closing = true
    clearTimeout(timer)
    watcher.close()
    stopServer()
    await generationTask
    process.exit(0)
  })
}
await queueGeneration()
