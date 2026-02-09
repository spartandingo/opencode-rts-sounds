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
import { tool } from "@opencode-ai/plugin/tool"

// Import built-in themes
import starcraft from "./themes/starcraft.js"
import protossZealot from "./themes/protoss-zealot.js"
import warcraftHuman from "./themes/warcraft-human.js"
import warcraftOrc from "./themes/warcraft-orc.js"
import redalertAllied from "./themes/redalert-allied.js"
import redalertSoviet from "./themes/redalert-soviet.js"

const BUILTIN_THEMES = {
  starcraft,
  "protoss-zealot": protossZealot,
  "warcraft-human": warcraftHuman,
  "warcraft-orc": warcraftOrc,
  "redalert-allied": redalertAllied,
  "redalert-soviet": redalertSoviet,
}

const SOUNDS_BASE = join(homedir(), ".config", "opencode", "sounds")
const CUSTOM_THEMES_DIR = join(SOUNDS_BASE, "themes")
const CONFIG_PATH = join(SOUNDS_BASE, "config.json")
const DEFAULT_THEME = "starcraft"

function loadCustomThemes() {
  const custom = {}
  if (!existsSync(CUSTOM_THEMES_DIR)) return custom

  try {
    for (const file of readdirSync(CUSTOM_THEMES_DIR)) {
      if (!file.endsWith(".json")) continue
      try {
        const theme = JSON.parse(readFileSync(join(CUSTOM_THEMES_DIR, file), "utf8"))
        if (theme.name && theme.eventSounds) {
          custom[theme.name] = theme
        }
      } catch {
        // Skip malformed theme files
      }
    }
  } catch {
    // Ignore read errors
  }

  return custom
}

function getAllThemes() {
  const custom = loadCustomThemes()
  // Custom themes override built-in themes with the same name
  return { ...BUILTIN_THEMES, ...custom }
}

function getThemeNameAndThemes() {
  const themes = getAllThemes()

  // Env var takes priority
  const envTheme = process.env.OPENCODE_RTS_THEME
  if (envTheme && themes[envTheme]) return { themeName: envTheme, themes }

  // Then config file
  try {
    if (existsSync(CONFIG_PATH)) {
      const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"))
      if (config.theme && themes[config.theme]) return { themeName: config.theme, themes }
    }
  } catch {
    // Ignore malformed config
  }

  return { themeName: DEFAULT_THEME, themes }
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

  // If no soundPacks defined (local-only theme), just check the dir exists
  if (!theme.soundPacks || Object.keys(theme.soundPacks).length === 0) return true

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
  if (!theme.soundPacks || Object.keys(theme.soundPacks).length === 0) {
    log(`Theme ${theme.name} has no soundPacks to download`)
    return
  }

  const dir = join(SOUNDS_BASE, theme.name)
  log(`Downloading ${theme.label || theme.name} sounds...`)
  mkdirSync(dir, { recursive: true })

  const { default: JSZip } = await import("jszip")

  // Dedupe URLs -- multiple packs may share the same zip
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

  log(`${theme.label || theme.name} sounds ready!`)
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

  const { themeName, themes } = getThemeNameAndThemes()
  let theme = themes[themeName]
  let soundsDir = join(SOUNDS_BASE, theme.name)

  await log(`Using theme: ${theme.label || theme.name}`)

  // Download sounds on first run
  if (!soundsExist(theme)) {
    try {
      await downloadSounds(theme, (msg) => log(msg))
    } catch (err) {
      await log(`Failed to download sounds: ${err.message}`)
    }
  }

  // Helper to switch themes (used by both tool and command)
  const switchTheme = async (themeName) => {
    const available = getAllThemes()
    if (!available[themeName]) {
      const names = Object.keys(available).join(", ")
      return { success: false, message: `Unknown theme "${themeName}". Available: ${names}` }
    }

    const newTheme = available[themeName]

    // Download sounds if needed
    if (!soundsExist(newTheme)) {
      await downloadSounds(newTheme, (msg) => log(msg))
    }

    // Switch at runtime
    theme = newTheme
    soundsDir = join(SOUNDS_BASE, newTheme.name)

    // Persist to config
    mkdirSync(SOUNDS_BASE, { recursive: true })
    writeFileSync(CONFIG_PATH, JSON.stringify({ theme: themeName }, null, 2))

    await log(`Switched to theme: ${newTheme.label || newTheme.name}`)
    return { success: true, message: `Switched to ${newTheme.label || newTheme.name} theme` }
  }

  return {
    config: async (input) => {
      input.command ??= {}
      const themeList = Object.entries(getAllThemes())
        .map(([k, v]) => `  ${k} - ${v.label || k}`)
        .join("\n")
      input.command["rts-theme"] = {
        description: "Switch RTS sound theme",
        template: `Available themes:\n${themeList}\n\nUsage: /rts-theme <theme-name>`,
      }
    },
    "command.execute.before": async (input, output) => {
      if (input.command !== "rts-theme") return

      const themeName = input.arguments?.trim()
      if (!themeName) {
        // No argument - list themes via toast
        const themeList = Object.entries(getAllThemes())
          .map(([k, v]) => `${k}${k === theme.name ? " (current)" : ""}`)
          .join(", ")
        await client.tui.showToast({
          body: { message: `RTS themes: ${themeList}`, variant: "info" },
        })
        // Clear parts so AI doesn't respond
        output.parts = []
        return
      }

      const result = await switchTheme(themeName)
      await client.tui.showToast({
        body: {
          message: result.message,
          variant: result.success ? "success" : "error",
        },
      })
      // Clear parts so AI doesn't respond
      output.parts = []
    },
    event: async ({ event }) => {
      const sounds = theme.eventSounds[event.type]
      if (!sounds || sounds.length === 0) return

      playSound(join(soundsDir, pick(sounds)))
    },
    tool: {
      rts_set_theme: tool({
        description:
          "Switch the RTS sound effects theme. Available themes: " +
          Object.entries(getAllThemes())
            .map(([k, v]) => `"${k}" (${v.label || k})`)
            .join(", "),
        args: {
          theme: tool.schema.string(),
        },
        async execute(args) {
          const result = await switchTheme(args.theme)
          return result.message
        },
      }),
    },
  }
}
