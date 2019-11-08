const msgTemp = document.createElement('template')
msgTemp.innerHTML = `
<style>
@import "js/notes/css/css1.css";
</style>
<div class="notes">
  <header>
    <div id="account" class="icon">
    </div>
    <p>Notes (<span>0</span>)</p>
    <div class="icon2">
      <img src="./js/notes/images/add.png" alt="add">
    </div>
  </header>
  <div class="contents"></div>
</div>
`
const templMsgBox = document.createElement('template')
templMsgBox.innerHTML = `
<div class="noteBox">
  <div class="box0" title="remove note">
    <img src="./js/notes/images/cross.png" alt="lol">
  </div>
  <div class="box">
    <p class="note"></p>
  </div>
  <div class="box2">
    <p class="time">5:04pm</p>
  </div>
</div>
`
const templNoteNote = document.createElement('template')
templNoteNote.innerHTML = `
<style>
@import "js/notes/css/css3.css";
</style>
<div class="notes">
<header>
  <div id="save">
    <p>Save</p>
  </div>
</header>
<div class="contents">
  <input type="text" placeholder="Title">
  <textarea></textarea>
</div>
</div>
  `
/*
  The class for the note application
  */

class Notes extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.localStorageName = 'getNotes'
  }
  /*
  Checks for localstorage if there are notes that can be shown
  */

  connectedCallback () {
    this.shadowRoot.appendChild(msgTemp.content.cloneNode(true))
    const img = this.shadowRoot.querySelector('img')
    this.localStorage = window.localStorage
    let notes = this.localStorage.getItem(this.localStorageName)
    const contents = this.shadowRoot.querySelector('.contents')
    if (notes !== null) {
      this.counter = 0
      notes = JSON.parse(notes)
      const span = this.shadowRoot.querySelector('span')

      notes.forEach(element => {
        this.counter++
        const msgBox = templMsgBox.content.cloneNode(true)
        const note = msgBox.querySelector('.note')
        const time = msgBox.querySelector('.time')
        contents.appendChild(msgBox)
        note.innerHTML = element.title
        time.innerHTML = element.time
        element.id = this.counter
        const lol = note.parentNode.parentNode
        lol.setAttribute('id', this.counter)
        span.innerHTML = this.counter
      })

      notes = JSON.stringify(notes)
      this.localStorage.setItem(this.localStorageName, notes)
    }
    this._eventListener(img, contents)
  }

  /*
  Listens for different events
  */

  _eventListener (img, contents) {
    img.addEventListener('click', function dothis () {
      this.shadowRoot.innerHTML = ''
      this.shadowRoot.appendChild(templNoteNote.content.cloneNode(true))
      this._savefile()
    }.bind(this))
    contents.addEventListener('click', function onClick (event) {
      if (event.target.tagName === 'IMG') {
        const target = event.target
        const msgBox = target.parentNode.parentNode
        let notes = this.localStorage.getItem(this.localStorageName)
        let num = msgBox.getAttribute('id')
        num = parseInt(num)
        notes = JSON.parse(notes)
        let index
        notes.forEach((element, i) => {
          const lol = element.id
          if (num === lol) {
            index = i
          }
        })
        notes.splice(index, 1)
        msgBox.remove()
        this.counter--
        const span = this.shadowRoot.querySelector('span')
        span.innerHTML = this.counter
        notes = JSON.stringify(notes)
        this.localStorage.setItem(this.localStorageName, notes)
      }
      if (event.target.classList.contains('note')) {
        this.disconnectedCallback()
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        const title = this.shadowRoot.querySelector('.title')
        const body = this.shadowRoot.querySelector('.body')
        const box = event.target.parentNode.parentNode
        let num = box.getAttribute('id')
        num = parseInt(num)
        let arr = this.localStorage.getItem(this.localStorageName)
        arr = JSON.parse(arr)
        let index
        arr.forEach((element, i) => {
          const lol = element.id
          if (num === lol) {
            index = i
          }
        })
        title.innerHTML = arr[index].title
        body.innerHTML = arr[index].body
        this._listener2(title, body, num)
      }
    }.bind(this))
  }
  /*
  Also listens for events
  */

  _listener2 (title, body, index) {
    const header = this.shadowRoot.querySelector('header')
    header.addEventListener('click', function onClick (event) {
      if (event.target.id === 'back') {
        this.disconnectedCallback()
        this.connectedCallback()
      }
      if (event.target.id === 'edit') {
        this.disconnectedCallback()
        // const templ = document.getElementById('noteNote')
        this.shadowRoot.appendChild(templNoteNote.content.cloneNode(true))
        const input = this.shadowRoot.querySelector('input')
        const text = this.shadowRoot.querySelector('textarea')
        input.value = title.innerHTML
        text.value = body.innerHTML
        this._savefile(index)
      }
    }.bind(this))
  }
  /*
  Saves a new note
  */

  _savefile (index) {
    const save = this.shadowRoot.querySelector('#save')
    const bind = onClick.bind(this)
    const input = this.shadowRoot.querySelector('input')
    const text = this.shadowRoot.querySelector('textarea')
    save.addEventListener('click', bind)
    function onClick () {
      if (input.value.length !== 0) {
        var d = new Date()
        const hours = d.getHours()
        const minuites = d.getMinutes()
        let time
        if (hours >= 12) {
          time = hours + ':' + minuites + ' PM'
        } else {
          time = hours + ':' + minuites + ' AM'
        }
        this._upload(input.value, text.value, index, time)
        input.value = ''
        text.value = ''
      }
      save.removeEventListener('click', bind)
    }
  }

  _upload (title, body, id, time) {
    let notes = this.localStorage.getItem(this.localStorageName)
    notes = JSON.parse(notes)
    const newNote = {
      title: title,
      body: body,
      time: time
    }
    if (id !== undefined) {
      notes.forEach((element, i) => {
        if (element.id === id) {
          element.title = title
          element.body = body
        }
      })
      notes = JSON.stringify(notes)
      this.localStorage.setItem(this.localStorageName, notes)
    } else {
      if (notes === null) {
        let arr = []
        arr.push(newNote)
        arr = JSON.stringify(arr)
        this.localStorage.setItem(this.localStorageName, arr)
      } else {
        notes.push(newNote)
        notes = JSON.stringify(notes)
        this.localStorage.setItem(this.localStorageName, notes)
      }
    }
    this.disconnectedCallback()
    this.connectedCallback()
  }

  disconnectedCallback () {
    this.shadowRoot.innerHTML = ''
  }
}

window.customElements.define('note-app', Notes)

const template = document.createElement('template')
template.innerHTML = `
<style>
@import "js/notes/css/css2.css";
</style>
<div class="notes">
    <header>
      <div class="icon">
      <p id="back">Back</p>
      </div>
      <p></p>
      <div class="icon2">
        <p id="edit">Edit</p>
      </div>
    </header>
    <div class="contents">
      <div class="title"></div>
      <div class="body"></div>
    </div>
    </div>
`
