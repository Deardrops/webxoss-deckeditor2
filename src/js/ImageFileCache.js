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

  checkSize().then(() => {
    openStore('images', 'records')
    .then(([imagesStore, recordsStore]) => {
      imagesStore.add(blob, pid)
      recordsStore.add({
        pid,
        date: Date.now(),
      })
    })
  })
}
const openStore = (...names) => {
  return new Promise(resolve => {
    indexedDB.open('card images', 2)
    .onsuccess = function () {
      return resolve(names.map(name => this.result
        .transaction([name], 'readwrite')
        .objectStore(name)
      ))
    }
  })
}

const checkSize = () => {
  let limit = 100 // test use
  let deleteCount = parseInt(limit * 0.1)
  return new Promise(resolve => {
    openStore('images').then(([imagesStore]) => {
      imagesStore.count().onsuccess = function() {
        if (this.result > limit) {
          openStore('records').then(([recordsStore]) => {
            let pids = []
            new Promise(resolve => {
              recordsStore.index('date')
              .openCursor().onsuccess = function () {
                let cursor = this.result
                if (!cursor || deleteCount < 0) {
                  return resolve(pids)
                }
                pids.push(cursor.value.pid)
                deleteCount--
                cursor.continue()
              }
            }).then(pids => {
              openStore('images', 'records')
              .then(([imagesStore, recordsStore]) => {
                pids.forEach(pid => {
                  imagesStore.delete(pid)
                  recordsStore.delete(pid)
                })
              })
            })
          })
        } else {
          resolve()
        }
      }
    })
  })
}
const initRecord = () => {
  new Promise(resolve => {
    openStore('images').then(([imagesStore]) => {
      let pids = []
      imagesStore.openCursor().onsuccess = function () {
        let cursor = this.result
        if (!cursor) {
          return resolve(pids)
        }
        pids.push(cursor.key)
        cursor.continue()
      }
    })
  }).then(pids => {
    openStore('records').then(([recordsStore]) => {
      pids.forEach(pid => {
        recordsStore.put({
          pid,
          date: Date.now(),
        })
      })
    })
  })
}

// Read all images form DB to cached blob urls.
const readAll = () => {
  return new Promise(resolve => {
    let initRecordNeeded = false
    let open = indexedDB.open('card images', 2)
    open.onupgradeneeded = function () {
      let db = this.result
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images')
      } else {
        // upgrade from version 1 to 2
        initRecordNeeded = true
      }
      db.createObjectStore('records', {
        keyPath: 'pid',
      }).createIndex('date', 'date', {
        unique: false,
      })
    }
    open.onsuccess = function () {
      let db = this.result
      if (initRecordNeeded) {
        initRecord()
      }
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
        cursor.continue()
      }
    }
  })
}
const updateRecentUse = (pid) => {
  openStore('records').then(([recordsStore]) => {
    recordsStore.get(pid).onsuccess = function () {
      let data = this.result
      if (!data) {
        return
      }
      data.date = Date.now()
      recordsStore.put(data)
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

// test use
window.showCount = () => {
  openStore('images', 'records')
  .then(([imagesStore, recordsStore]) => {
    imagesStore.count().onsuccess = function() {
      console.log('image count:' + this.result)
    }
    recordsStore.count().onsuccess = function() {
      console.log('record count:' + this.result)
    }
    console.log('urlMap count:'+ Object.values(urlMap).length)
  })
}
