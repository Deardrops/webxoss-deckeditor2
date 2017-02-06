if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = callback => {
    // 30 fps only.
    // Because browsers without RAF support generally have low performance.
    return window.setTimeout(callback, 1000 / 30)
  }
  window.cancelAnimationFrame = id => {
    return window.clearTimeout(id)
  }
}

history.scrollRestoration = 'manual'
