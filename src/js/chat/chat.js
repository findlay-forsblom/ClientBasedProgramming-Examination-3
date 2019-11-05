import { User } from '../app.js'

const templMain = document.createElement('template')
templMain.innerHTML = `
<style>
@import "js/chat/css/css1.css"
</style>
<div class="wrapper">
  <div class= "box1">
    <div class="yolo">
      <div class="topTop">
        <label class="top">Srack</label>
        <img src="image/logo.png" alt="logo">
      </div>
      <label id="userOnNav">user</label>
      <button id="logout">Change Username</button>
      <label id="channelInfo">Current channel</label>
      <label id="channel">All channel</label>
    </div>
  </div>
  <div class="box2">
    <div class="subWrapper">
      <div class="subBox1">
        <div class="broken-Fix-For-JustifyContent_flexend"></div>   
      </div>
      <div class="subBox2">
          <textarea name="Text1" class="message"></textarea>
      </div>
  </div>
  </div>
</div>
`
const templChatFront = document.createElement('template')
templChatFront.innerHTML = `
<style>
@import "js/chat/css/css2.css"
</style>
<div class="chat">
<div class="home">
  <label>Srack</label>
  <img src="./image/logo.png" alt="logo" class="logo">
  <div class="tags">
    <input type="text" class="username" placeholder="Enter username">
    <p id="warning" class="hide"></p>
    <button class="join">Join</button>
  </div>
</div>
</div>
`
/*
The chatApp class
*/
export class ChatApp extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.storageIdentifier = 'chat-app_User-profile'
    this.sessionId = null
    this.connected = false
    this.isLoggedIn = true
    this.localStorage = localStorage
  }
  /*
  Checks if there is a user already in local storage.
  If there is it feches the data of the user.
  If there is not then it creates a new user
  */

  connectedCallback () {
    this.userProfile = this.localStorage.getItem(this.storageIdentifier)
    this.userProfile = JSON.parse(this.userProfile)
    if (this.userProfile === null || this.changeUsername) {
      this.changeUsername = false
      this.shadowRoot.append(templChatFront.content.cloneNode(true))
      const button = this.shadowRoot.querySelector('button')
      this._onNewUser(button)
    } else {
      this._chat()
    }
    console.log(this.user)
  }

  /*
  where the code jumps to if there is not a new user
  */

  _onNewUser (button) {
    const bind = doThis.bind(this)
    button.addEventListener('click', bind, true)
    let username = this.shadowRoot.querySelector('.username')
    function doThis () {
      console.log(username.value)
      const p = this.shadowRoot.querySelector('#warning')
      console.log(username)
      if (username.value.length === 0) {
        console.log(p)
        p.textContent = 'Username can not be empty'
        p.classList.remove('hide')
        return
      } else if (username.value.length < 3) {
        p.textContent = 'Username can be less than 3 characters'
        p.classList.remove('hide')
        return
      }
      username = username.value
      this.user = new User(username)
      console.log('session id is ', this.sessionId)
      this.localStorage.setItem(this.storageIdentifier, JSON.stringify(this.user))
      this._chat()
    }
  }

  /*
  when there is a user that is ready to chat
  */

  async _chat () {
    this.shadowRoot.innerHTML = ''
    this.shadowRoot.append(templMain.content.cloneNode(true))
    const usernameOnNav = this.shadowRoot.querySelector('#userOnNav')
    let user = this.localStorage.getItem(this.storageIdentifier)
    user = JSON.parse(user)
    console.log(this.sessionId)
    user = user.name
    console.log(user)
    usernameOnNav.textContent = user
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
      this.disconnectedCallback()
      this.changeUsername = true
      this.connectedCallback()
    }.bind(this))
    console.log(logout)
  }
  /*
 Connects to the socket
  */

  _connect () {
    const subBox1 = this.shadowRoot.querySelector('.subBox1')
    this.user = this.localStorage.getItem(this.storageIdentifier)
    this.user = JSON.parse(this.user)

    this.message = {
      type: 'message',
      data: '',
      username: this.user.name,
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
      const bind = doThis.bind(this)
      this.socket.onopen = (event) => {
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

  /*
  Sends message
  */

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
          textArea.value = ''
        }
      }
    }.bind(this), true)
    console.log(textArea)
  }

  /*
  Displays messages recieved by the socket
  */

  _displayMessage (recieved, subBox1) {
    let messageBox = document.getElementById('msgBox')
    messageBox = messageBox.content.cloneNode(true)
    const message = messageBox.querySelector('#message')
    const user = messageBox.querySelector('#user')
    if (recieved.username.trim().length > 0) {
      if (recieved.username === this.user.name) {
        user.textContent = 'You'
      } else {
        user.textContent = recieved.username
      }
    } else {
      user.textContent = 'Unknown'
    }
    console.log(user)
    if (recieved.data.trim().length > 0) {
      message.textContent = recieved.data
      subBox1.append(messageBox)
    }
  }

  /*
  What happens when the app is removed fron the dom
  */

  disconnectedCallback () {
    console.log(this.isLoggedIn)
    if (this.socket !== null) {
      this.socket.close()
      console.log('socket closed')
    }
    this.shadowRoot.innerHTML = ''
  }
}

window.customElements.define('chat-app', ChatApp)
