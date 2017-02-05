/*
  Cache image files in IndexedDB
*/

function checkIndexedDBSupport(callback) {
  let db = null
  function done(supportIndexedDB, supportBlob) {
    if (db) db.close()
    callback(!!supportIndexedDB, !!supportBlob)
  }
  if (!window.indexedDB) return done()
  if (!window.IDBKeyRange) return done()
  if (!window.IDBOpenDBRequest) return done()

  // IndexedDB is seriously broken on iOS 8,9
  let open = indexedDB.open('test indexedDB support', 1)
  if (!('onupgradeneeded' in open)) return done()
  open.onupgradeneeded = function () {
    db = this.result
    db.createObjectStore('one')
    db.createObjectStore('two', {keyPath: 'key'})
  }
  open.onerror = function () {
    done()
  }
  open.onsuccess = function () {
    db = this.result
    db.onerror = function () {
      done()
    }
    let transaction
    try {
      transaction = db.transaction(['one', 'two'], 'readwrite')
    } catch (e) {
      return done()
    }
    let req = transaction.objectStore('two').put({key: 1})
    req.onsuccess = function () {
      let xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      if (!window.Blob || !window.URL || (xhr.responseType !== 'blob')) {
        db.close()
        return done(true, false)
      } else {
        let blob = new Blob(['text'], {type: 'text/plain'})
        try {
          req = transaction.objectStore('one').put(blob, 'blob')
          transaction.onabort = function (event) {
            event.stopPropagation()
            done(true, false)
          }
          transaction.onerror = function (event) {
            event.stopPropagation()
            done(true, false)
          }
          transaction.oncomplete = function () {
            return done(true, true)
          }
        } catch (e) {
          return done(true, false)
        }
      }
    }
  }
}

function get(url, type, callback, err) {
  let xhr = new XMLHttpRequest()
  xhr.responseType = type
  xhr.onload = function (e) {
    if (xhr.status !== 200) {
      err(xhr, e)
    } else {
      callback(xhr, e)
    }
  }
  xhr.onerror = function (e) {
    err(xhr, e)
  }
  xhr.open('GET', url, true)
  xhr.send()
}

function cache(pid, blob) {
  if (!ImageFileCache.supportBlob) return
  if (pid in urlMap) return
  let url = window.URL.createObjectURL(blob)
  urlMap[pid] = url
  let open = indexedDB.open('card images', 1)
  open.onupgradeneeded = function () {
    this.result.createObjectStore('images')
  }
  open.onsuccess = function () {
    let db = this.result
    db.transaction(['images'], 'readwrite').objectStore('images').add(blob, pid)
  }
}

/* locals */
let urlMap = {}
let fetchingMap = {}
let ImageFileCache = {
  supportIndexedDB: false,
  supportBlob: false,
  getUrlByPid(pid) {
    return urlMap[pid] || ''
  },
  fetchAndCache(pid, url) {
    if (!ImageFileCache.supportBlob) return
    if (fetchingMap[pid]) return
    fetchingMap[pid] = true
    get(url, 'blob', function (xhr) {
      let blob = xhr.response
      cache(pid, blob)
    }, function () {
      fetchingMap[pid] = false
    })
  },
  init(callback, timeout) {
    let called = false
    let done = function () {
      if (!called) {
        called = true
        callback()
      }
    }
    setTimeout(done, timeout)
    checkIndexedDBSupport(function (supportIndexedDB, supportBlob) {
      ImageFileCache.supportIndexedDB = supportIndexedDB
      ImageFileCache.supportBlob = supportBlob
      if (!supportBlob) {
        return done()
      }
      let open = indexedDB.open('card images', 1)
      open.onupgradeneeded = function () {
        this.result.createObjectStore('images')
      }
      open.onsuccess = function () {
        let db = this.result
        db.transaction(['images']).objectStore('images').openCursor().onsuccess = function () {
          let cursor = this.result
          if (!cursor) {
            return done()
          }
          let pid = cursor.key
          let blob = cursor.value
          let url = window.URL.createObjectURL(blob)
          urlMap[pid] = url
          cursor.continue()
        }
      }
    })
  },
}


export default ImageFileCache
