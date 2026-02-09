// StarCraft (Terran) theme
export default {
  name: "starcraft",
  label: "StarCraft (Terran)",
  soundPacks: {
    "protoss-advisor": {
      url: "https://sounds.spriters-resource.com/media/assets/416/419544.zip",
      files: {
        "advisor/paderr02.wav": "additional-pylons.wav",
        "advisor/paderr00.wav": "not-enough-minerals-protoss.wav",
        "advisor/paderr01.wav": "not-enough-vespene-gas.wav",
      },
    },
    "terran-advisor": {
      url: "https://sounds.spriters-resource.com/media/assets/416/419574.zip",
      files: {
        "advisor/taderr00.wav": "not-enough-minerals-terran.wav",
      },
    },
    scv: {
      url: "https://sounds.spriters-resource.com/media/assets/416/419592.zip",
      files: {
        "scv/tscrdy00.wav": "scv-ready.wav",
        "scv/tscyes00.wav": "scv-yes-sir.wav",
        "scv/tscyes02.wav": "scv-affirmative.wav",
        "scv/tscwht00.wav": "scv-whaddya-want.wav",
        "scv/tscwht01.wav": "scv-im-not-listening.wav",
      },
    },
  },
  eventSounds: {
    "session.created": ["scv-ready.wav"],
    "session.idle": ["scv-yes-sir.wav", "scv-affirmative.wav"],
    "session.compacted": ["additional-pylons.wav"],
    "session.error": [
      "not-enough-minerals-protoss.wav",
      "not-enough-minerals-terran.wav",
      "not-enough-vespene-gas.wav",
    ],
    "permission.asked": ["scv-whaddya-want.wav", "scv-im-not-listening.wav"],
  },
}
