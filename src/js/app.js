import './chat/chat.js'
import './memory-game/memory-game.js'
import './notes/note-app.js'

/*
  Used by the Chat Application
  */

export function User (user) {
  this.name = user
  this.isLoggedIn = false
}

const main = document.querySelector('.main')
const footer = document.querySelector('footer')
const minimizedApps = []
let currentApps = []
let zIndex = 0
let lastX = 0
let lastY = 0
let focusedApps = []
let recents = document.querySelector('.recents')
recents = recents.firstElementChild
const miniWindow = document.querySelector('#programs')
const body = miniWindow.querySelector('.programsBody')

/*
 footer eventlistener
  */

footer.addEventListener('click', function onClick (event) {
  const clickedItem = event.target
  let header
  miniWindow.classList.add('hide')
  if (clickedItem.tagName === 'IMG' && clickedItem !== recents) {
    const name = clickedItem.parentNode.getAttribute('data-app')
    const app = document.createElement(name)
    let templ = document.getElementById('window')
    templ = templ.content.cloneNode(true)
    const div = templ.querySelector('.drag')
    const innerBody = div.querySelector('#innerBody')
    div.setAttribute('tabindex', '0')
    div.setAttribute('data-name', clickedItem.parentNode.getAttribute('title'))
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
  } else if (clickedItem === recents) {
    miniWindow.classList.toggle('hide')
    miniWindow.style.zIndex = ++zIndex
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
      const dataName = element.getAttribute('data-name')
      div.textContent = dataName
    }
  })
}

miniWindow.addEventListener('click', function onClick (event) {
  if (event.target.classList.contains('item')) {
    if (focusedApps.length > 0) {
      focusedApps.forEach(element => {
        element.classList.add('hide')
      })
    }
    focusedApps = []
    const div = event.target
    const id = div.getAttribute('data')
    const app = minimizedApps[id]
    app.classList.remove('hide')

    const index = minimizedApps.indexOf(app)
    minimizedApps[index] = null

    lastX = app.getBoundingClientRect().x
    lastY = app.getBoundingClientRect().y

    app.style.zIndex = ++zIndex
    app.focus()
    div.remove()
  }
  if (event.target.getAttribute('id') === 'close') {
    miniWindow.classList.add('hide')
  }
  miniWindow.style.zIndex = ++zIndex
})

miniWindow.addEventListener('mouseover', function onMouseOver (event) {
  let app
  if (event.target.classList.contains('item')) {
    const index = event.target.getAttribute('data')
    app = minimizedApps[index]
    app.classList.remove('hide')
    app.setAttribute('data-focus', 'true')
    app.focus()
    app.style.zIndex = ++zIndex
    if (!focusedApps.includes(app)) {
      focusedApps.push(app)
    }
  }
  miniWindow.addEventListener('mouseleave', function onMouseLeave () {
    if (focusedApps.length > 0) {
      focusedApps.forEach(element => {
        element.classList.add('hide')
      })
    }
    focusedApps = []
    miniWindow.removeEventListener('mouseleave', onMouseLeave)
  })
})

main.addEventListener('click', function listening (e) {
  let node = e.target
  miniWindow.classList.add('hide')
  if (node.classList.contains('main')) {
    return
  }
  if (node.getAttribute('id') === 'kryss') {
    node = getParentNode(node)
    currentApps = currentApps.filter(item => item !== node)
    node.remove()
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
})
/*
  listens for events
  Also responsible for moving the window
  */

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
  if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
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
