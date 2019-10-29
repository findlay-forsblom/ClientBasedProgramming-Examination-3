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
let currentApps = []
let zIndex = 0
let lastX = 0
let lastY = 0
const recents = document.querySelector('.recents')

footer.addEventListener('click', function onClick (event) {
  const clickedItem = event.target
  let header
  if (clickedItem.tagName === 'IMG') {
    const name = clickedItem.getAttribute('name')
    const app = document.createElement(name)
    let templ = document.getElementById('window')
    templ = templ.content.cloneNode(true)
    const div = templ.querySelector('.drag')
    const innerBody = div.querySelector('#innerBody')
    div.setAttribute('tabindex', '0')
    div.style.zIndex = ++zIndex
    header = div.querySelector('#top-Bar')
    innerBody.append(app)
    main.append(div)
    div.style.top = `${lastY + 20}px`
    div.style.left = `${lastX + 10}px`
    lastX = div.getBoundingClientRect().x
    lastY = div.getBoundingClientRect().y
    div.focus()
    eventListener(div, header)
    currentApps.push(div)
    console.log(currentApps)
  }

})

recents.addEventListener('mouseover', function onMouseOver () {
  console.log('i am here boi')
})

main.addEventListener('click', function listening (e) {
  let node = e.target
  if (node.classList.contains('main')) {
    return
  }
  if (node.getAttribute('id') === 'kryss') {
    node = getParentNode(node)
    currentApps = currentApps.filter(item => item !== node)
    node.remove()
    console.log(currentApps)
  } else if (!node.classList.contains('drag')) {
    node = getParentNode(node)
  }
  node.style.zIndex = ++zIndex
  lastX = node.getBoundingClientRect().x
  lastY = node.getBoundingClientRect().y
  // node.focus()
})

function eventListener (div, header) {
  div.addEventListener('mousedown', mouseDown, true)
  function mouseDown (e) {
    if (e.target !== header) {
      return
    }
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
      console.log('getBoundingrect ', div.getBoundingClientRect())
      // console.log('X: ', e.clientX)
      // console.log('Y: ', e.clientY)
    }
  
    window.addEventListener('mouseup', function mouseUp () {
      this.window.removeEventListener('mousemove', mouseMove)
      this.window.removeEventListener('mousedown', mouseDown)
      this.window.removeEventListener('mouseup', mouseUp)
      div.style.zIndex = ++zIndex
      div.focus()
      lastX = div.getBoundingClientRect().x
      lastY = div.getBoundingClientRect().y
      this.console.log(lastX)
      this.console.log(lastY)
    })
  }
}


function getParentNode (node) {
  const parent = node.parentNode
  if (parent.classList.contains('drag')) {
    return parent
  } else {
    return getParentNode(parent)
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
