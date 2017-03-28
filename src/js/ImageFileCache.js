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

/* locals */
let urlMap = {}
let fetchingMap = {}

/* private methods */
const cache = (pid, blob) => {
  if (!ImageFileCache.supportBlob) return
  if (pid in urlMap) return
  let url = window.URL.createObjectURL(blob)
  urlMap[pid] = url
  let open = indexedDB.open('card images', 2)
  // open.onupgradeneeded = function () {
  //   let objectStore = this.result.createObjectStore('images', {
  //     keyPath: 'pid',
  //   })
  //   objectStore.createIndex('date', 'date', {
  //     unique: false,
  //   })
  //   objectStore.createIndex('blob', 'blob', {
  //     unique: true,
  //   })
  // }
  open.onsuccess = function () {
    let objectStore = this.result
      .transaction(['images'], 'readwrite')
      .objectStore('images')
    objectStore.count().onsuccess = function() {
      keepDbSize(this.result, objectStore).then(() => {
        objectStore.add({
          pid,
          blob,
          date: Date.now(),
        })
      })
    }
  }
}
const updateRecentUse = (pid) => {
  indexedDB.open('card images', 2)
    .onsuccess = function () {
      let objectStore = this.result
        .transaction(['images'], 'readwrite')
        .objectStore('images')
      objectStore.get(pid).onsuccess = function () {
        let data = this.result
        if (!data) {
          return
        }
        data.date = Date.now()
        objectStore.put(data)
      }
    }
}
const keepDbSize = (count, objectStore) => {
  let limit = 50 //test use
  let deleteCount = parseInt(limit * 0.1)
  return new Promise(resolve => {
    if (count > limit) {
      objectStore.index('date').openCursor().onsuccess = function () {
        let cursor = this.result
        if (!cursor || deleteCount < 0) {
          return resolve()
        }
        objectStore.delete(cursor.value.pid)
        deleteCount--
        cursor.continue()
      }
    }
    resolve()
  })
}
// Read all images form DB to cached blob urls.
const readAll = () => {
  return new Promise(resolve => {
    let open = indexedDB.open('card images', 2)
    open.onupgradeneeded = function () {
      let db = this.result
      if ('images' === db.objectStoreNames[0]) {
        db.deleteObject('images')
      }
      let objectStore = db.createObjectStore('images', {keyPath: 'pid'})
      objectStore.createIndex('date', 'date', {
        unique: false,
      })
      objectStore.createIndex('blob', 'blob', {
        unique: true,
      })
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
        let blob = cursor.value.blob
        let url = window.URL.createObjectURL(blob)
        urlMap[pid] = url
        cursor.continue()
      }
    }
  })
}

const ImageFileCache = {
  supportIndexedDB: false,
  supportBlob: !!window.Blob && !!window.URL,
  getUrlByPid(pid) {
    updateRecentUse(pid)
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
