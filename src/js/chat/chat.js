import { User } from '../app.js'
class ChatApp extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.storageIdentifier = 'chat_user'
    this.connected = false
    this.isLoggedIn = true
  }

  connectedCallback () {
    this.storage = window.localStorage
    // this.storage.clear()
    this.user = this.storage.getItem(this.storageIdentifier)
    console.log(this.isLoggedIn)
    if (this.user === null || !this.isLoggedIn) {
      console.log('urnoi')
      const templ = document.getElementById('chatFront')
      this.shadowRoot.append(templ.content.cloneNode(true))
      const button = this.shadowRoot.querySelector('button')
      console.log(templ)
      this._onNewUser(button)
    } else {
      this._chat()
      this.isLoggedIn = true
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

  async _chat () {
    this.shadowRoot.innerHTML = ''
    const templ = document.getElementById('chatMain')
    this.shadowRoot.append(templ.content.cloneNode(true))
    const usernameOnNav = this.shadowRoot.querySelector('#userOnNav')
    usernameOnNav.textContent = this.storage.getItem(this.storageIdentifier)
    await this._connect()
    if (this.connected === true) {
      this._sendMessage()
    }
    this._listenForevents()
  }

  _listenForevents () {
    const logout = this.shadowRoot.querySelector('#logout')
    logout.addEventListener('click', function logOut () {
      console.log('logging out')
      this.isLoggedIn = false
      this.disconnectedCallback()
      this.connectedCallback()
    }.bind(this))
    console.log(logout)
  }

  _connect () {
    const subBox1 = this.shadowRoot.querySelector('.subBox1')
    this.message = {
      type: 'message',
      data: '',
      username: this.storage.getItem(this.storageIdentifier),
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
      const bind = doThis.bind(this)
      this.socket.onopen = (event) => {
      // Send an initial message
        const send = JSON.stringify(this.message)
        this.socket.send(send)
      }

      this.socket.addEventListener('message', bind)
      function doThis (event) {
        let recieved = event.data
        recieved = JSON.parse(recieved)
        console.log('Message from server ', recieved)
        if (recieved.data === 'You are connected!') {
          console.log(this)
          this.connected = true
          resolve()
        }
        if (recieved.type !== 'heartbeat' && recieved.type !== 'notification') {
          this._displayMessage(recieved, subBox1)
        }
      }
    })
  }

  _sendMessage () {
    const textArea = this.shadowRoot.querySelector('.message')
    textArea.addEventListener('keyup', function key (event) {
      if (event.key === 'Enter') {
        const message = textArea.value.trim()
        if (message.length !== 0) {
          console.log('not zero')
          console.log(message)
          this.message.data = message
          const send = JSON.stringify(this.message)
          this.socket.send(send)
        }
      }
    }.bind(this), true)
    console.log(textArea)
  }

  _displayMessage (recieved, subBox1) {
    let messageBox = document.getElementById('msgBox')
    messageBox = messageBox.content.cloneNode(true)
    const message = messageBox.querySelector('#message')
    const user = messageBox.querySelector('#user')
    if (recieved.username.trim().length > 0) {
      user.textContent = recieved.username
    } else {
      user.textContent = 'Unknown'
    }
    console.log(user)
    if (recieved.data.trim().length > 0) {
      message.textContent = recieved.data
      subBox1.append(messageBox)
    }
  }

  disconnectedCallback () {
    this.socket.close()
    this.shadowRoot.innerHTML = ''
  }
}

window.customElements.define('chat-app', ChatApp)
