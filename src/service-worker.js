'use strict'

console.log('Service worker startup.')

let hash = self.serviceWorkerOption.hash
let assets = self.serviceWorkerOption.assets
let staticAssets = assets.filter(asset => !asset.endsWith('html'))
let dynamicAssets = assets.filter(asset => asset.endsWith('html'))
  .concat(['./', './CardInfo.json'])

console.group(`Service worker ${hash} starts up.`)

console.group('staticAssets')
console.log(staticAssets.join('\n'))
console.groupEnd()

console.group('dynamicAssets')
console.log(dynamicAssets.join('\n'))
console.groupEnd()

console.groupEnd()

self.addEventListener('install', event => {
  console.log('Installing...')
  // Prefetch
  event.waitUntil(
    Promise.all([
      caches.open('static')
        .then(cache => cache.addAll(staticAssets)),
      caches.open(`dynamic ${hash}`)
        .then(cache => cache.addAll(dynamicAssets))
    ])
    .then(() => {
      console.log('Installed.')
    })
    .then(() => {
      if (self.skipWaiting) {
        return self.skipWaiting()
      }
    })
  )
})

self.addEventListener('activate', event => {
  console.log('Activating...')
  // Remove old caches
  event.waitUntil(
    caches.keys()
    .then(keys => {
      return Promise.all(keys.map(key => {
        if (key.startsWith('dynamic ') && key !== `dynamic ${hash}`) {
          return caches.delete(key)
        }
      }))
    })
    .then(() => {
      if (self.clients.claim) {
        return self.clients.claim()
      }
    })
    .then(() => {
      console.log('Activated.')
    })
  )
})

self.addEventListener('fetch', event => {
  let request = event.request

  return caches.match(request)
    .then(response => {
      if (response) {
        console.log(`From cache: ${request.url}`)
        return response
      }
      console.log(`From network: ${request.url}`)
      return fetch(request)
    })
})
