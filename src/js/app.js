import { ChatApp } from './chat/chat.js'

export function User (user) {
  this.name = user
  this.isLoggedIn = false
}

const div = document.querySelector('.drag')
console.log(div)

div.addEventListener('mousedown', function mouseDown (e) {
  const rect = div.getBoundingClientRect()
  let prevX = e.clientX
  let prevY = e.clientY
  console.log(prevX)
  console.log(prevY)

  window.addEventListener('mousemove', mouseMove)

  function mouseMove (e) {
    const newX = e.clientX
    const newY = e.clientY
    const distanceMovedX = newX - prevX
    const distanceMovedY = newY - prevY
    div.style.left = `${rect.x + distanceMovedX}px`
    div.style.top = `${rect.y + distanceMovedY}px`
    console.log('getBoundingrect ', div.getBoundingClientRect())
    console.log('X: ', e.clientX)
    console.log('Y: ', e.clientY)
  }

  window.addEventListener('mouseup', function mouseUp () {
    this.console.log('final' , div.getBoundingClientRect())
    this.window.removeEventListener('mousemove', mouseMove)
    this.window.removeEventListener('mousedown', mouseDown)
    this.window.removeEventListener('mouseup', mouseUp)
  })

})
















// const app = document.createElement('chat-app')
// const app2 = document.createElement('chat-app')
// document.querySelector('body').append(app)
// document.querySelector('body').append(app2)
// console.log(ChatApp.getNumberOfUsers())
