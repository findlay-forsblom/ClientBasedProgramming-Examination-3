import { User } from '../app.js'
class ChatApp extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.storageIdentifier = 'chat_user'
  }

  connectedCallback () {
    this.storage = window.localStorage
    // this.storage.clear()
    this.user = this.storage.getItem(this.storageIdentifier)
    console.log(this.user)
    console.log((Object.keys(this.user.length)))
    if (this.user === null) {
      console.log('urnoi')
      const templ = document.getElementById('chatFront')
      this.shadowRoot.append(templ.content.cloneNode(true))
      const button = this.shadowRoot.querySelector('button')
      console.log(templ)
      this._onNewUser(button)
    } else {
      console.log('i am here lol')
      this._chat()
    }
  }

  _onNewUser (button) {
    const bind = doThis.bind(this)
    button.addEventListener('click', bind, true)
    let username = this.shadowRoot.querySelector('.username')
    function doThis () {
      console.log(username.value)
      const p = this.shadowRoot.querySelector('#warning')
      console.log(p)
      if (username.value.length === 0) {
        console.log(p)
        p.textContent = 'Username can not be empty'
        p.classList.remove('hide')
      } else if (username.value.length < 3) {
        p.textContent = 'Username can be less than 3 characters'
        p.classList.remove('hide')
        return
      }
      username = username.value
      this.user = new User(username)
      console.log(username)
      this.storage.setItem(this.storageIdentifier, username)
      this._chat()
    }
  }

  _chat () {
    this.shadowRoot.innerHTML = ''
    const templ = document.getElementById('chatMain')
    this.shadowRoot.append(templ.content.cloneNode(true))
    const usernameOnNav = this.shadowRoot.querySelector('#userOnNav')
    usernameOnNav.textContent = this.storage.getItem(this.storageIdentifier)
    console.log(usernameOnNav)
    this._connect()
  }

  _connect () {
    const subBox1 = this.shadowRoot.querySelector('.subBox1')
    let message = {
      type: 'message',
      data: 'lol',
      username: 'urboi',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    const socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
    const bind = doThis.bind(this)
    socket.onopen = function (event) {
    // Send an initial message
      message = JSON.stringify(message)
      socket.send(message)
    }

    socket.addEventListener('message', bind)
    function doThis (event) {
      let recieved = event.data
      recieved = JSON.parse(recieved)
      console.log('Message from server ', recieved)
      if (recieved.type !== 'heartbeat' && recieved.type !== 'notification') {
        this._displayMessage(recieved, subBox1)
      }
    }
  }

  _displayMessage (recieved, subBox1) {
    let messageBox = document.getElementById('msgBox')
    messageBox = messageBox.content.cloneNode(true)
    const message = messageBox.querySelector('#message')
    const user = messageBox.querySelector('#user')
    console.log(user)
    message.textContent = recieved.data
    subBox1.append(messageBox)
  }

  disconnectedCallback () {

  }
}

window.customElements.define('chat-app', ChatApp)
