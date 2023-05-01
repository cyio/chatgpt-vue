const isDev = location.port !== ''
const enableSW = 1 || !isDev

if ('serviceWorker' in navigator && enableSW) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
  }
  )
}
