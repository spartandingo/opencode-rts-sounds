// Warcraft III (Orc) theme
export default {
  name: "warcraft-orc",
  label: "Warcraft III (Orc)",
  soundPacks: {
    peon: {
      url: "https://sounds.spriters-resource.com/media/assets/422/425494.zip",
      files: {
        "Orc/Peon/PeonReady1.wav": "peon-ready.wav",
        "Orc/Peon/PeonYes1.wav": "peon-yes-1.wav",
        "Orc/Peon/PeonYes2.wav": "peon-yes-2.wav",
        "Orc/Peon/PeonYes3.wav": "peon-yes-3.wav",
        "Orc/Peon/PeonWhat1.wav": "peon-what-1.wav",
        "Orc/Peon/PeonWhat2.wav": "peon-what-2.wav",
        "Orc/Peon/PeonWhat3.wav": "peon-what-3.wav",
      },
    },
    interface: {
      url: "https://sounds.spriters-resource.com/media/assets/422/425499.zip",
      files: {
        "Interface/Warning/Orc/GruntNoGold1.wav": "no-gold.wav",
        "Interface/Warning/Orc/GruntNoLumber1.wav": "no-lumber.wav",
        "Interface/Warning/Orc/GruntNoFood1.wav": "no-food.wav",
      },
    },
  },
  eventSounds: {
    "session.created": ["peon-ready.wav"],
    "session.idle": ["peon-yes-1.wav", "peon-yes-2.wav", "peon-yes-3.wav"],
    "session.compacted": ["no-food.wav"],
    "session.error": ["no-gold.wav", "no-lumber.wav"],
    "permission.asked": ["peon-what-1.wav", "peon-what-2.wav", "peon-what-3.wav"],
  },
}
