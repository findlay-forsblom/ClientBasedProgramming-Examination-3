import './chat/chat.js'
import './memory-game/memory-game.js'
import './notes/note-app.js'

export function User (user) {
  this.name = user
  this.isLoggedIn = false
}

const main = document.querySelector('.main')
console.log(main)
const footer = document.querySelector('footer')
const items = document.querySelector('#items')
let minimizedApps = []
const div = 
console.log(items)
let currentApps = []
let zIndex = 0
let lastX = 0
let lastY = 0
let counter = 0
let recents = document.querySelector('.recents')
recents = recents.firstElementChild
const miniWindow = document.querySelector('#programs')
const body = miniWindow.querySelector('.programsBody')
console.log(miniWindow)

footer.addEventListener('click', function onClick (event) {
  const clickedItem = event.target
  let header
  if (clickedItem.tagName === 'IMG' && clickedItem !== recents) {
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
    counter++
    console.log(currentApps)
  } else if (clickedItem === recents) {
    console.log('lol')
    miniWindow.classList.remove('hide')
    console.log(body)
    minimize()
  }
})

function minimize () {
  body.innerHTML = ''
  minimizedApps.forEach((element, i) => {
    if (element !== null) {
      const div = document.createElement('div')
      div.classList.add('item')
      div.setAttribute('data', `${i}`)
      body.append(div)
      div.append(element.textContent)
      div.textContent = 'App ' + i
    }
    // console.log(element)
    // const item = items.content.cloneNode(true)
    // body.append(item)
    // const p = item.querySelector('p')
    // console.log(item)
    // p.textContent = 'App ' + counter
  })
}

miniWindow.addEventListener('click', function onClick (event) {
  console.log(event.target)
  if (event.target.classList.contains('item')) {
    console.log('lol')
    const div = event.target
    const id = div.getAttribute('data')
    console.log(id)
    const app = minimizedApps[id]
    console.log(app)
    app.classList.remove('hide')

   // minimizedApps = minimizedApps.filter(item => item !== app)
    const index = minimizedApps.indexOf(app)
    minimizedApps[index] = null

    app.style.top = `${lastY + 20}px`
    app.style.left = `${lastX + 10}px`
    lastX = app.getBoundingClientRect().x
    lastY = app.getBoundingClientRect().y

    app.style.zIndex = ++zIndex
    app.focus()

    div.remove()
    console.log(id)
  }
  if (event.target.getAttribute('id') === 'close') {
    console.log('yea')
    miniWindow.classList.add('hide')
  }
  miniWindow.style.zIndex = ++zIndex
})

recents.addEventListener('mouseover', function onMouseOver () {
  console.log('i am here boi')
})

main.addEventListener('click', function listening (e) {
  let node = e.target
  console.log(node)
  if (node.classList.contains('main')) {
    return
  }
  if (node.getAttribute('id') === 'kryss') {
    node = getParentNode(node)
    currentApps = currentApps.filter(item => item !== node)
    node.remove()
    console.log(currentApps)
    counter--
  } else if (node.getAttribute('id') === 'minimize') {
    node = getParentNode(node)
    node.classList.add('hide')
    minimizedApps.push(node)
    minimize()
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

    window.addEventListener('mousemove', mouseMove)

    function mouseMove (e) {
      const distanceMovedX = e.clientX - prevX
      const distanceMovedY = e.clientY - prevY
      div.style.left = `${rect.x + distanceMovedX}px`
      div.style.top = `${rect.y + distanceMovedY}px`
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
window.addEventListener('keydown', function (e) {
  // space and arrow keys
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault()
  }
}, false)

function getParentNode (node) {
  const parent = node.parentNode
  if (parent.classList.contains('drag')) {
    return parent
  } else {
    return getParentNode(parent)
  }
}
