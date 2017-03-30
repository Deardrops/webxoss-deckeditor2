import _ from 'lodash'
// Check IndexedDB support.
// https://bl.ocks.org/nolanlawson/8a2ead46a184c9fae231
const checkIndexedDBSupport = () => {
  // static checks
  let notSupported =
    (typeof indexedDB === 'undefined') ||
    (window.indexedDB === null) ||
    (typeof IDBKeyRange === 'undefined')

  if (notSupported) {
    return Promise.resolve(false)
  }

  // test broken IndexedDB on iOS 8,9
  return new Promise(resolve => {
    let req = indexedDB.open('test', 1)
    req.onerror = () => resolve(false)
    req.onupgradeneeded = function (event) {
      let db = event.target.result
      db.createObjectStore('one', {
        keyPath: 'key',
      })
      db.createObjectStore('two', {
        keyPath: 'key',
      })
    }
    req.onsuccess = function (event) {
      let db = event.target.result
      let tx = null
      try {
        tx = db.transaction(['one', 'two'], 'readwrite')
      } catch (error) {
        return resolve(false)
      }
      tx.objectStore('two').put({
        'key': Date.now(),
      })
      tx.oncomplete = function () {
        db.close()
        resolve(true)
      }
    }
  })
}

/* Helper functions */
const get = (url, type, callback, err) => {
  let xhr = new XMLHttpRequest()
  xhr.responseType = type
  xhr.onload = () => {
    if (xhr.status !== 200) {
      err(xhr, event)
    } else {
      callback(xhr, event)
    }
  }
  xhr.onerror = event => {
    err(xhr, event)
  }
  xhr.open('GET', url, true)
  xhr.send()
}
const wait = timeout => {
  return new Promise(resolve => {
    window.setTimeout(resolve, timeout)
  })
}

// test use
window.showCacheCount = () => {
  console.log(cacheManager.usedQueue.length + ' in usedQueue')
  indexedDB.open('card images', 1).onsuccess = function () {
    this.result
    .transaction(['images'], 'readwrite')
    .objectStore('images')
    .count().onsuccess = function() {
      console.log(this.result + ' in indexedDB')
    }
  }
}
// manage image cache in indexedDB by LRU 最近最久未使用算法
const cacheManager = {
  usedQueue: [],
  limit: 100, // test use
  deleteCount: 10,
  update(pid) {
    // remove pid if it already in usedQueue, then add it to the tail of usedQueue
    _.pull(this.usedQueue, pid)
    this.usedQueue.push(pid)
    localStorage.setItem('usedQueue', JSON.stringify(this.usedQueue))
  },
  checkSize() {
    // for keeping indexedDB's size (used storage)
    // delete some images and free the space
    let count = this.usedQueue.length - this.limit
    if (count > this.deleteCount) {
      // delete some items from the head of usedQueue
      let pids = this.usedQueue.splice(0, count)

      // due to the operation to indexedDB is mutually-exclusive (互斥的)
      // use Promise to ensure that dealing with transaction one by one
      // here: delete some cards, and then add one cards to DB
      return new Promise(resolve => {
        indexedDB.open('card images', 1).onsuccess = function () {
          let objectStore = this.result
          .transaction(['images'], 'readwrite')
          .objectStore('images')
          Promise.all(pids.map(pid => {
            return new Promise(resolve => {
              objectStore.delete(pid).onsuccess = function () {
                resolve()
              }
            })
          })).then(() => {
            resolve()
          })
        }
      })
    } else {
      return Promise.resolve()
    }
  },
  init() {
    let usedQueueJson = localStorage.getItem('usedQueue')
    this.usedQueue = usedQueueJson ? JSON.parse(usedQueueJson) : []
  },
}

/* locals */
let urlMap = {}
let fetchingMap = {}

/* private methods */
const cache = (pid, blob) => {
  if (!ImageFileCache.supportBlob) return
  if (pid in urlMap) return
  let url = window.URL.createObjectURL(blob)
  urlMap[pid] = url
  cacheManager.checkSize().then(() => {
    let open = indexedDB.open('card images', 1)
    open.onupgradeneeded = function () {
      this.result.createObjectStore('images')
    }
    open.onsuccess = function () {
      let db = this.result
      db.transaction(['images'], 'readwrite').objectStore('images').add(blob, pid)
    }
  })
}
// Read all images form DB to cached blob urls.
const readAll = () => {
  cacheManager.init()
  return new Promise(resolve => {
    let open = indexedDB.open('card images', 1)
    open.onupgradeneeded = function () {
      this.result.createObjectStore('images')
    }
    open.onsuccess = function () {
      let db = this.result
      db.transaction(['images'])
      .objectStore('images')
      .openCursor()
      .onsuccess = function () {
        let cursor = this.result
        if (!cursor) {
          return resolve()
        }
        let pid = cursor.key
        let blob = cursor.value
        let url = window.URL.createObjectURL(blob)
        urlMap[pid] = url

        // add new images (added by old webxoss page) to cacheManager
        // images already in usedQueue will not be updated
        if (!cacheManager.usedQueue.includes(pid)) {
          cacheManager.update(pid)
        }

        cursor.continue()
      }
    }
  })
}

const ImageFileCache = {
  supportIndexedDB: false,
  supportBlob: !!window.Blob && !!window.URL,
  getUrlByPid(pid) {
    cacheManager.update(pid)
    return urlMap[pid] || ''
  },
  fetchAndCache(pid, url) {
    if (!this.supportBlob) return
    if (fetchingMap[pid]) return
    fetchingMap[pid] = true
    get(url, 'blob', function (xhr) {
      let blob = xhr.response
      cache(pid, blob)
    }, function () {
      fetchingMap[pid] = false
    })
  },
  init(timeout = 1000) {
    if (!this.supportBlob) {
      return Promise.resolve(false)
    }
    return Promise.race([
      wait(timeout).then(() => false),
      checkIndexedDBSupport().then(support => {
        if (!support) {
          return false
        }
        this.supportIndexedDB = true
        return readAll().then(() => true)
      }),
    ])
  },
}

export default ImageFileCache
