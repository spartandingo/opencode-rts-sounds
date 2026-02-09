// opencode-rts-sounds
// RTS sound effects plugin for OpenCode.
// Plays iconic voice lines from StarCraft, Warcraft III, and C&C Red Alert.
//
// Sounds are downloaded on first run from The Sounds Resource
// (sounds.spriters-resource.com). All games are property of their respective
// owners. Sounds are used under fair use for personal/fan use only.

import { join } from "path"
import { homedir } from "os"
import { existsSync, mkdirSync, readdirSync, writeFileSync, readFileSync } from "fs"
import { spawn } from "child_process"

// Import all themes
import starcraft from "./themes/starcraft.js"
import warcraftHuman from "./themes/warcraft-human.js"
import warcraftOrc from "./themes/warcraft-orc.js"
import redalertAllied from "./themes/redalert-allied.js"
import redalertSoviet from "./themes/redalert-soviet.js"

const THEMES = {
  starcraft,
  "warcraft-human": warcraftHuman,
  "warcraft-orc": warcraftOrc,
  "redalert-allied": redalertAllied,
  "redalert-soviet": redalertSoviet,
}

const SOUNDS_BASE = join(homedir(), ".config", "opencode", "sounds")
const CONFIG_PATH = join(SOUNDS_BASE, "config.json")
const DEFAULT_THEME = "starcraft"

function getThemeName() {
  // Env var takes priority
  const envTheme = process.env.OPENCODE_RTS_THEME
  if (envTheme && THEMES[envTheme]) return envTheme

  // Then config file
  try {
    if (existsSync(CONFIG_PATH)) {
      const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"))
      if (config.theme && THEMES[config.theme]) return config.theme
    }
  } catch {
    // Ignore malformed config
  }

  return DEFAULT_THEME
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function playSound(file) {
  if (!existsSync(file)) return

  const cmd = process.platform === "darwin" ? "afplay" : "paplay"
  const child = spawn(cmd, [file], {
    detached: true,
    stdio: "ignore",
  })
  child.unref()
}

function soundsExist(theme) {
  const dir = join(SOUNDS_BASE, theme.name)
  if (!existsSync(dir)) return false
  try {
    const files = readdirSync(dir)
    const expected = Object.values(theme.soundPacks).flatMap((pack) =>
      Object.values(pack.files)
    )
    return expected.every((s) => files.includes(s))
  } catch {
    return false
  }
}

async function downloadSounds(theme, log) {
  const dir = join(SOUNDS_BASE, theme.name)
  log(`Downloading ${theme.label} sounds...`)
  mkdirSync(dir, { recursive: true })

  const { default: JSZip } = await import("jszip")

  // Dedupe URLs -- multiple themes may share the same zip (e.g. interface warnings)
  const urlToEntries = {}
  for (const [, pack] of Object.entries(theme.soundPacks)) {
    if (!urlToEntries[pack.url]) {
      urlToEntries[pack.url] = {}
    }
    Object.assign(urlToEntries[pack.url], pack.files)
  }

  for (const [url, files] of Object.entries(urlToEntries)) {
    log(`  Fetching ${url.split("/").pop().split("?")[0]}...`)
    try {
      const res = await fetch(url)
      if (!res.ok) {
        log(`  Failed to download: ${res.status}`)
        continue
      }

      const buffer = await res.arrayBuffer()
      const zip = await JSZip.loadAsync(buffer)

      for (const [zipPath, outName] of Object.entries(files)) {
        const entry = zip.file(zipPath)
        if (entry) {
          const data = await entry.async("nodebuffer")
          writeFileSync(join(dir, outName), data)
        } else {
          log(`  Warning: ${zipPath} not found in archive`)
        }
      }
    } catch (err) {
      log(`  Error: ${err.message}`)
    }
  }

  log(`${theme.label} sounds ready!`)
}

export const RtsSoundsPlugin = async ({ client }) => {
  const log = async (msg) => {
    try {
      await client.app.log({
        body: {
          service: "opencode-rts-sounds",
          level: "info",
          message: msg,
        },
      })
    } catch {
      // Logging is best-effort
    }
  }

  const themeName = getThemeName()
  const theme = THEMES[themeName]
  const soundsDir = join(SOUNDS_BASE, theme.name)

  await log(`Using theme: ${theme.label}`)

  // Download sounds on first run
  if (!soundsExist(theme)) {
    try {
      await downloadSounds(theme, (msg) => log(msg))
    } catch (err) {
      await log(`Failed to download sounds: ${err.message}`)
    }
  }

  return {
    event: async ({ event }) => {
      const sounds = theme.eventSounds[event.type]
      if (!sounds || sounds.length === 0) return

      playSound(join(soundsDir, pick(sounds)))
    },
  }
}
