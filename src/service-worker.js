'use strict'

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
    // Remove outdated dynamic assets
    caches.keys()
    .then(keys => {
      console.group('Delete outdated dynamic cache')
      return Promise.all(keys.map(key => {
        if (key.startsWith('dynamic ') && key !== `dynamic ${hash}`) {
          console.log(key)
          return caches.delete(key)
        }
      }))
      .then(() => {
        console.groupEnd()
      })
    })
    .then(() => {
      // Remove no longer used static assets
      let absoluteUrls = staticAssets.map(relatedUrl => {
        return (new URL(relatedUrl, self.location)).href
      })
      return caches.open('static').then(cache => {
        return cache.keys().then(requests => {
          console.group('Delete unused static assets')
          return Promise.all(requests.map(request => {
            if (!absoluteUrls.includes(request.url)) {
              console.log(request.url)
              return cache.delete(request)
            }
          }))
          .then(() => {
            console.groupEnd()
          })
        })
      })
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

  return event.respondWith(
    caches.match(request)
    .then(response => {
      if (response) {
        console.log(`From cache: ${request.url}`)
        return response
      }
      // console.log(`From network: ${request.url}`)
      return fetch(request)
    })
  )
})
