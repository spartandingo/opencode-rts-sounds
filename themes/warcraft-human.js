// Warcraft III (Human) theme
export default {
  name: "warcraft-human",
  label: "Warcraft III (Human)",
  soundPacks: {
    peasant: {
      url: "https://sounds.spriters-resource.com/media/assets/422/425493.zip",
      files: {
        "Human/Peasant/PeasantReady1.wav": "peasant-ready.wav",
        "Human/Peasant/PeasantYes1.wav": "peasant-yes-1.wav",
        "Human/Peasant/PeasantYes2.wav": "peasant-yes-2.wav",
        "Human/Peasant/PeasantYes3.wav": "peasant-yes-3.wav",
        "Human/Peasant/PeasantWhat1.wav": "peasant-what-1.wav",
        "Human/Peasant/PeasantWhat2.wav": "peasant-what-2.wav",
        "Human/Peasant/PeasantWhat3.wav": "peasant-what-3.wav",
      },
    },
    interface: {
      url: "https://sounds.spriters-resource.com/media/assets/422/425499.zip",
      files: {
        "Interface/Warning/Human/KnightNoGold1.wav": "no-gold.wav",
        "Interface/Warning/Human/KnightNoLumber1.wav": "no-lumber.wav",
        "Interface/Warning/Human/KnightNoFood1.wav": "no-food.wav",
      },
    },
  },
  eventSounds: {
    "session.created": ["peasant-ready.wav"],
    "session.idle": ["peasant-yes-1.wav", "peasant-yes-2.wav", "peasant-yes-3.wav"],
    "session.compacted": ["no-food.wav"],
    "session.error": ["no-gold.wav", "no-lumber.wav"],
    "permission.asked": ["peasant-what-1.wav", "peasant-what-2.wav", "peasant-what-3.wav"],
  },
}
