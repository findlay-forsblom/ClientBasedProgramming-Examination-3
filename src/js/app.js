import { ChatApp } from './chat/chat.js'

export function User (user) {
  this.name = user
  this.isLoggedIn = false
}

// const body = document.querySelector('body')
const main = document.querySelector('.main')
// main.addEventListener('click', function onClick () {
//   console.log('its ur boi')
// })
console.log(main)
const footer = document.querySelector('footer')
// let div
let currentDiv

footer.addEventListener('click', function onClick (event) {
  const clickedItem = event.target
  let header
  if (clickedItem.tagName === 'IMG') {
    console.log('i am here boi')
    const name = clickedItem.getAttribute('name')
    const app = document.createElement(name)
    let templ = document.getElementById('window')
    templ = templ.content.cloneNode(true)
    console.log(app)
    const div = templ.querySelector('.drag')
    const innerBody = div.querySelector('#innerBody')
    header = div.querySelector('#top-Bar')
    innerBody.append(app)
    main.append(div)
    eventListener(div, header)
  }

})

function eventListener (div, header) {
  div.addEventListener('mousedown', mouseDown, true)
  function mouseDown (e) {
    if (e.target !== header) {
      return
    }
    console.log('urboi is loistening')
    const rect = div.getBoundingClientRect()
    const prevX = e.clientX
    const prevY = e.clientY
    // console.log(e.target)
    // console.log(prevX)
    // console.log(prevY)
  
    window.addEventListener('mousemove', mouseMove)
  
    function mouseMove (e) {
      const distanceMovedX = e.clientX - prevX
      const distanceMovedY = e.clientY - prevY
      div.style.left = `${rect.x + distanceMovedX}px`
      div.style.top = `${rect.y + distanceMovedY}px`
      // console.log('getBoundingrect ', div.getBoundingClientRect())
      // console.log('X: ', e.clientX)
      // console.log('Y: ', e.clientY)
    }
  
    window.addEventListener('mouseup', function mouseUp () {
      this.console.log('final', div.getBoundingClientRect())
      this.window.removeEventListener('mousemove', mouseMove)
      this.window.removeEventListener('mousedown', mouseDown)
      this.window.removeEventListener('mouseup', mouseUp)
    })
  }
}






/*
let templ = document.getElementById('window')
templ = templ.content.cloneNode(true)

const body = document.querySelector('body')
console.log(body)
const div = templ.querySelector('.drag')
const header = div.querySelector('#top-Bar')
const chat = document.createElement('chat-app')
const innerBody = div.querySelector('#innerBody')
body.append(div)
innerBody.append(chat)
console.log(header)
console.log(div)

div.addEventListener('mousedown', function mouseDown (e) {
  if (e.target !== header) {
    return
  }
  const rect = div.getBoundingClientRect()
  const prevX = e.clientX
  const prevY = e.clientY
  console.log(e.target)
  console.log(prevX)
  console.log(prevY)

  window.addEventListener('mousemove', mouseMove)

  function mouseMove (e) {
    const distanceMovedX = e.clientX - prevX
    const distanceMovedY = e.clientY - prevY
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


*/












// const app = document.createElement('chat-app')
// const app2 = document.createElement('chat-app')
// document.querySelector('body').append(app)
// document.querySelector('body').append(app2)
// console.log(ChatApp.getNumberOfUsers())
