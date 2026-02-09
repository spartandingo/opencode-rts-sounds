# opencode-rts-sounds

RTS sound effects plugin for [OpenCode](https://opencode.ai). Plays iconic voice lines from StarCraft, Warcraft III, and Command & Conquer: Red Alert when things happen in your coding session.

## Install

Add `opencode-rts-sounds` to the `plugin` array in your OpenCode config file.

The config file is at `~/.config/opencode/opencode.json` (global) or `opencode.json` (project-level).

```json
{
  "plugin": ["opencode-rts-sounds"]
}
```

OpenCode installs npm plugins automatically at startup. No other steps needed.

### From source

```bash
git clone https://github.com/spartandingo/opencode-rts-sounds.git
cp -r opencode-rts-sounds/index.js opencode-rts-sounds/themes ~/.config/opencode/plugins/
```

## Themes

Five themes are available:

| Theme | Game | Faction |
|---|---|---|
| `starcraft` (default) | StarCraft | Terran SCV + Protoss Advisor |
| `warcraft-human` | Warcraft III | Human Peasant |
| `warcraft-orc` | Warcraft III | Orc Peon |
| `redalert-allied` | C&C Red Alert 3 | Allied EVA |
| `redalert-soviet` | C&C Red Alert 3 | Soviet EVA |

### Set theme via config file

Create `~/.config/opencode/sounds/config.json`:

```json
{
  "theme": "warcraft-orc"
}
```

### Set theme via environment variable

```bash
export OPENCODE_RTS_THEME=redalert-soviet
```

The environment variable overrides the config file.

## Events

### StarCraft

| Event | Sound |
|---|---|
| `session.created` | "SCV good to go, sir" |
| `session.idle` | "Yes sir" / "Affirmative" |
| `session.compacted` | **"You must construct additional pylons!"** |
| `session.error` | "Not enough minerals" / "Insufficient vespene gas" |
| `permission.asked` | "Whaddya want?" |

### Warcraft III (Human / Orc)

| Event | Sound |
|---|---|
| `session.created` | "Ready to work" |
| `session.idle` | "Job's done!" / "Work complete" |
| `session.compacted` | "We need more food" |
| `session.error` | "Not enough gold" / "Not enough lumber" |
| `permission.asked` | "Yes me lord?" / "What is it?" |

### Red Alert 3 (Allied / Soviet)

| Event | Sound |
|---|---|
| `session.created` | "Building" |
| `session.idle` | "Construction complete" |
| `session.compacted` | "Insufficient funds" / "Low power" |
| `session.error` | "Cannot deploy here" |
| `permission.asked` | "On hold" / "Select unit" |

## How it works

Sound files are downloaded automatically on first run from [The Sounds Resource](https://www.sounds-resource.com/) and cached in `~/.config/opencode/sounds/<theme-name>/`. No sound files are distributed with this package. Switching themes downloads a new set of sounds.

Audio playback uses `child_process.spawn` with platform-native commands -- no additional dependencies required.

## Platform support

| Platform | Audio command | Status |
|---|---|---|
| macOS | `afplay` (built-in) | Tested |
| Linux | `paplay` (PulseAudio) | Should work |

## Migrating from opencode-starcraft

Replace `opencode-starcraft` with `opencode-rts-sounds` in your config. The StarCraft theme is the default, so it works identically out of the box.

## Credits

- Sound files from their respective games via [The Sounds Resource](https://www.sounds-resource.com/)
- StarCraft is a trademark of Blizzard Entertainment, Inc.
- Warcraft is a trademark of Blizzard Entertainment, Inc.
- Command & Conquer is a trademark of Electronic Arts Inc.
- Sounds are downloaded on demand and not distributed with this package

## License

MIT
