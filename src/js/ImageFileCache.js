const ImageFileCache = (() => {

  function checkIndexedDBSupport (callback) {
    let db = null
    function done(supportIndexedDB, supportBlob) {
      if (db) db.close()
      callback(!!supportIndexedDB, !!supportBlob)
    }
    if (!window.indexedDB) return done()
    if (!window.IDBKeyRange) return done()
    if (!window.IDBOpenDBRequest) return done()
    // shit iOS
    // var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    // if (iOS) return done();
    // ios 8
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

  function get (url, type, callback, err) {
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

  function cache (pid, blob) {
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

  let urlMap = {}
  let fetchingMap = {}
  let ImageFileCache = {
    supportIndexedDB: false,
    supportBlob: false,
  }
  let supportObjectURL = false // 在360浏览器上,ObjectURL可能不能用.

// 检查支持并读取缓存
  checkIndexedDBSupport(function (supportIndexedDB, supportBlob) {
    ImageFileCache.supportIndexedDB = supportIndexedDB
    ImageFileCache.supportBlob = supportBlob
    if (!supportBlob) return
    let open = indexedDB.open('card images', 1)
    open.onupgradeneeded = function () {
      this.result.createObjectStore('images')
    }
    open.onsuccess = function () {
      let db = this.result
      let checked = false
      db.transaction(['images']).objectStore('images').openCursor().onsuccess = function () {
        let cursor = this.result
        if (!cursor) return
        let pid = cursor.key
        let blob = cursor.value
        let url = window.URL.createObjectURL(blob)
        if (!checked) {
          checked = true
          let img = new Image()
          img.onload = function () {
            supportObjectURL = true
            console.log('supportObjectURL')
          }
          img.src = url
        }
        urlMap[pid] = url
        cursor.continue()
      }
    }
  })

  ImageFileCache.getUrlByPid = function (pid) {
    if (!supportObjectURL) return ''
    return urlMap[pid] || ''
  }

  ImageFileCache.fetchAndCache = function (pid, url) {
    if (!ImageFileCache.supportBlob) return
    if (fetchingMap[pid]) return
    fetchingMap[pid] = true
    get(url, 'blob', function (xhr) {
      let blob = xhr.response
      cache(pid, blob)
    }, function () {
      console.log('Failed to load "' + url + '"')
      fetchingMap[pid] = false
    })
  }

  return ImageFileCache
})()

export default ImageFileCache
