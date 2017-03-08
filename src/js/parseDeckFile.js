export default function parseDeckFile (file) {
  return new Promise((resolve, reject) => {
    if (!FileReader || file.size > 1024) {
      reject(null)
      return
    }
    let reader = new FileReader()
    reader.onload = () => {
      resolve(parseCode(reader.result))
    }
    reader.readAsText(file)
  })
}

function parseCode (json) {
  try {
    let obj = JSON.parse(json)
    let legal =
      (obj.format === 'WEBXOSS Deck') &&
      (+obj.version === 1) &&
      (obj.content.mainDeck.length <= 50) &&
      (obj.content.lrigDeck.length <= 20)
    if (legal) {
      return obj.content
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}