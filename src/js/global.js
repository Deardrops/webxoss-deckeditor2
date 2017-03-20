/* polyfills */
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function requestAnimationFrame(callback) {
    return setTimeout(callback, 100)
  }

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  function cancelAnimationFrame(id) {
    return clearTimeout(id)
  }

window.requestIdleCallback =
  window.requestIdleCallback ||
  window.requestAnimationFrame

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  window.cancelAnimationFrame

/* settings */
history.scrollRestoration = 'manual'
