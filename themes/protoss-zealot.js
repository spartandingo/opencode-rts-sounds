// StarCraft (Protoss Zealot) theme
export default {
  name: "protoss-zealot",
  label: "StarCraft (Protoss Zealot)",
  soundPacks: {
    zealot: {
      url: "https://sounds.spriters-resource.com/media/assets/416/419570.zip",
      files: {
        "zealot/pzerdy00.wav": "my-life-for-aiur.wav",
        "zealot/pzeyes00.wav": "zealot-yes-0.wav",
        "zealot/pzeyes01.wav": "zealot-yes-1.wav",
        "zealot/pzeyes02.wav": "zealot-yes-2.wav",
        "zealot/pzeyes03.wav": "zealot-yes-3.wav",
        "zealot/pzewht00.wav": "zealot-what-0.wav",
        "zealot/pzewht01.wav": "zealot-what-1.wav",
        "zealot/pzewht02.wav": "zealot-what-2.wav",
        "zealot/pzewht03.wav": "zealot-what-3.wav",
        "zealot/pzerag00.wav": "zealot-enraged.wav",
        "zealot/pzeatt00.wav": "zealot-attack-0.wav",
        "zealot/pzeatt01.wav": "zealot-attack-1.wav",
      },
    },
    "protoss-advisor": {
      url: "https://sounds.spriters-resource.com/media/assets/416/419544.zip",
      files: {
        "advisor/paderr02.wav": "additional-pylons.wav",
        "advisor/paderr00.wav": "not-enough-minerals.wav",
        "advisor/paderr01.wav": "not-enough-vespene-gas.wav",
      },
    },
  },
  eventSounds: {
    "session.created": ["my-life-for-aiur.wav"],
    "session.idle": ["zealot-yes-0.wav", "zealot-yes-1.wav", "zealot-yes-2.wav", "zealot-yes-3.wav"],
    "session.compacted": ["additional-pylons.wav"],
    "session.error": ["not-enough-minerals.wav", "not-enough-vespene-gas.wav"],
    "permission.asked": ["zealot-what-0.wav", "zealot-what-1.wav", "zealot-what-2.wav", "zealot-what-3.wav"],
  },
}
