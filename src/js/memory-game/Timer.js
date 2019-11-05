export default function Timer (dom) {
  this.domElement = dom
  this.event = event
  let currentTime = 0
  let timer
  let isON = false

  const stopwatch = function (callback, domElement) {
    const start = Date.now()
    isON = true
    timer = setInterval(() => {
      const millis = Date.now() - start
      currentTime = Math.floor(millis / 1000)
      domElement.textContent = currentTime
    }, 1000)
  }

  this.startTimer = function () {
    isON = true
    stopwatch(this.stopTimer, this.domElement)
  }

  this.stopGameTimer = function () {
    clearInterval(timer)
    isON = false
  }

  this.stopTimer = function () {
    if (isON) {
      clearInterval(timer)
      isON = false
    }
  }

  Object.defineProperty(this, 'timeElapsed', {
    get: function () {
      return this.startTime - currentTime
    }
  })
}
