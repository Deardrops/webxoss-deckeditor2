import ImageFileCache from './ImageFileCache.js'

const newImage = src => {
  let img = new Image()
  img.src = src
  return img
}

let cache = {}
let noImage = newImage(require('media/noImage.jpg'))
// let black = newImage(require('media/WIXOSS_BLACK.jpg'))
// let white = newImage(require('media/WIXOSS_WHITE.jpg'))

export const getUrlByPid = pid => {
  let url = ImageFileCache.getUrlByPid(pid)
  if (url) {
    return url
  }
  url = './images/' + ('0000' + pid).slice(-4) + '.jpg'
  ImageFileCache.fetchAndCache(pid, url)
  return url
}

export const getImageByPid = pid => {
  if (!pid) {
    return noImage
  }
  if (pid in cache) {
    return cache[pid]
  }
  let src = getUrlByPid(pid)
  let img = newImage(src)
  cache[pid] = img
  return img
}
