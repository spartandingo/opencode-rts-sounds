// C&C Red Alert 3 (Soviet) theme
export default {
  name: "redalert-soviet",
  label: "Red Alert 3 (Soviet)",
  soundPacks: {
    eva: {
      url: "https://sounds.spriters-resource.com/media/assets/437/440572.zip",
      files: {
        "Commanders and Eva/Soviet/Soviet Eva/Seva_ConComplete.wav": "construction-complete.wav",
        "Commanders and Eva/Soviet/Soviet Eva/Seva_Building.wav": "building.wav",
        "Commanders and Eva/Soviet/Soviet Eva/Seva_InsufficFunds.wav": "insufficient-funds.wav",
        "Commanders and Eva/Soviet/Soviet Eva/Seva_LowPower.wav": "low-power.wav",
        "Commanders and Eva/Soviet/Soviet Eva/Seva_CantDeploHere.wav": "cannot-deploy-here.wav",
        "Commanders and Eva/Soviet/Soviet Eva/Seva_OnHold.wav": "on-hold.wav",
        "Commanders and Eva/Soviet/Soviet Eva/Seva_SelectUnit.wav": "select-unit.wav",
      },
    },
  },
  eventSounds: {
    "session.created": ["building.wav"],
    "session.idle": ["construction-complete.wav"],
    "session.compacted": ["insufficient-funds.wav", "low-power.wav"],
    "session.error": ["cannot-deploy-here.wav"],
    "permission.asked": ["on-hold.wav", "select-unit.wav"],
  },
}
