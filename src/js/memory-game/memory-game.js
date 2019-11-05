import Game from './Game.js'
import { Player } from './functions.js'
import Timer from './Timer.js'

const templMain = document.createElement('template')
templMain.innerHTML = `
<style>
@import "js/memory-game/css/css1.css"
</style>
<div class="content">
  <div class="game">
    <section class="cards"></section>
    <p>Time:<span id ="timer">0</span>s</p>
    <button class="hide">Try again</button>
  </div>
</div>
 `
const templForSelect = document.createElement('template')
templForSelect.innerHTML = `
<style>
@import "js/memory-game/css/css2.css"
</style>
<div class="container">
  <div class="content">
    <label for="size-select">Choose prefered game size:</label>
    <select name="game-size" id="size-select" >
    <option value="">--Please choose an option--</option>
    <option value="4x4">4x4</option>
    <option value="2x2">2x2</option>
    <option value="2x4">2x4</option>
    </select>
    <button>Start game</button>
  </div>
</div>
`

export class Memorygame extends HTMLElement {
  constructor () {
    super()
    // this.templateForSize = document.getElementById('forSelect')
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.event = new Event('game')
    this.eventTarget = new EventTarget()
    this.shadowRoot.appendChild(templForSelect.content.cloneNode(true))
    const element = this.shadowRoot.getElementById('size-select')
    const button = this.shadowRoot.querySelector('button')
    this._onStart(button, element)
  }

  _onStart (button, element) {
    const bind = doThis.bind(this)
    button.addEventListener('click', bind)

    function doThis (event) {
      const selectedValue = element.options[element.selectedIndex].value
      if (selectedValue !== '') {
        this._getCards(selectedValue)
        button.removeEventListener('click', bind)
      }
    }
  }

  _getAllImages () {
    const AllImages = []
    const path = './image/'

    for (let i = 1; i < 9; i++) {
      const img = document.createElement('img')
      img.setAttribute('src', `${path}${i}.png`)
      img.classList.add('img')
      AllImages.push(img)
    }
    return AllImages
  }

  _getCards (value) {
    const lol = this._getAllImages()
    if (value === '2x2') {
      const arr2x2 = []
      this._takeRandomCards(lol, arr2x2, 2)
      this._shuffle(arr2x2)
      arr2x2.forEach((img) => {
        console.log(img)
      })
      this._startGame(value, arr2x2)
      this.steg = 2
    } else if (value === '2x4') {
      const arr2x4 = []
      this._takeRandomCards(lol, arr2x4, 4)
      this._shuffle(arr2x4)
      arr2x4.forEach((img) => {
        console.log(img)
      })
      this._startGame(value, arr2x4)
      this.steg = 2
    } else if (value === '4x4') {
      const arr4x4 = []
      this._takeRandomCards(lol, arr4x4, 8)
      this._shuffle(arr4x4)
      arr4x4.forEach((img) => {
        console.log(img)
      })
      console.log(arr4x4)
      this._startGame(value, arr4x4)
      this.steg = 4
    }
  }

  _takeRandomCards (lol, arr, length) {
    for (let i = 0; i < length; i++) {
      const max = lol.length
      const index = Math.floor(Math.random() * Math.floor(max))
      const img = lol[index]
      arr.push(img)
      const clone = img.cloneNode(true)
      arr.push(clone)
      lol.splice(index, 1)
    }
  }

  _startGame (size, arr) {
    this.arr = arr
    // const templ = document.getElementById('main')
    this.shadowRoot.innerHTML = ''
    this.shadowRoot.appendChild(templMain.content.cloneNode(true))
    let timeTag = this.shadowRoot.querySelector('p')
    timeTag = timeTag.querySelector('#timer')
    this.player = new Player()
    const game = new Game(size, this.shadowRoot, arr, this.event, this.eventTarget, this.player)
    this.time = new Timer(timeTag)
    this.time.startTimer()
    game.start()
    this._gameController(game)
  }

  _gameController (game) {
    const main = this.shadowRoot.querySelector('.cards')
    const bind = doThis.bind(this)
    const bind2 = gameOver.bind(this)
    let first = this.arr[0]
    first = this._getParentNode(first)
    first.parentNode.focus()
    main.addEventListener('click', bind)
    main.addEventListener('keyup', (e) => {
      let node = e.target
      if (node.classList.contains('container')) {
        const index = this._getIndex(node)
        if (e.keyCode === 38 || e.keyCode === 87) {
          let sum = index - this.steg
          if (sum < 0) {
            sum = sum * -1
            sum = this.arr.length - sum
          }
          let nextElement = this.arr[(sum) % this.arr.length]
          nextElement = this._getParentNode(nextElement)
          nextElement.parentNode.focus()
        } else if (e.keyCode === 40 || e.keyCode === 83) {
          let nextElement = this.arr[(index + this.steg) % this.arr.length]
          nextElement = this._getParentNode(nextElement)
          nextElement.parentNode.focus()
        } else if (e.keyCode === 37 || e.keyCode === 65) {
          let sum = index - 1
          if (sum < 0) {
            sum = sum * -1
            sum = this.arr.length - 1
          }
          let nextElement = this.arr[sum % this.arr.length]
          nextElement = this._getParentNode(nextElement)
          nextElement.parentNode.focus()
        } else if (e.keyCode === 39 || e.keyCode === 68) {
          let nextElement = this.arr[(index + 1) % this.arr.length]
          nextElement = this._getParentNode(nextElement)
          nextElement.parentNode.focus()
        } else if (e.keyCode === 13) {
          node = node.firstElementChild
          this._orElse(game, node)
        }
      }
    })
    this.eventTarget.addEventListener('game', bind2)
    this.clicks = 0
    this.clickedBoxes = []
    this.flip = true

    function doThis (event) {
      const target = event.target
      /*
      To prevent errors from being shown in the console when a user clicks on a
      brick that is hidden or not part of the game
      */
      console.log(target.parentNode.parentNode)
      if (target.classList.contains('flex-rows')) {
        return
      }

      this._orElse(game, target)
    }

    function gameOver () {
      console.log('Game Over')
      this.player.numberOfAttempts = this.clicks / 2
      setTimeout(() => {
        game.stop()
        const button = this.shadowRoot.querySelector('button')
        button.classList.remove('hide')
        const bind = onClick.bind(this)
        button.addEventListener('click', bind)
        function onClick () {
          button.removeEventListener('click', bind)
          this.disconnectedCallback()
          this.connectedCallback()
        }
      }, 500)
      this.time.stopGameTimer()
    }
  }

  _orElse (game, target) {
    const stop = this.shadowRoot.querySelector('.container')
    const box = this._recurssionUp(target, stop) || this._recurssiondown(stop)
    const flipped = box.getAttribute('is-flipped')
    if (flipped === 'false' && this.flip) {
      this.clicks++
      box.setAttribute('is-flipped', 'true')
      this._handle(box, game)
    }
  }

  _getIndex (node) {
    node = node.firstElementChild
    let index
    this.arr.forEach((img, i) => {
      const box = this._getParentNode(img)
      if (node === box) {
        index = i
      }
    })
    return index
  }

  _handle (box, game) {
    box.classList.toggle('flip')
    this.clickedBoxes.push(box)
    if (this.clicks % 2 === 0) {
      this.flip = false
      const images = []
      this.clickedBoxes.forEach((box) => {
        const back = box.querySelector('.back')
        images.push(back.querySelector('img'))
      })

      if (images[0].isEqualNode(images[1])) {
        this.clickedBoxes.forEach((box, i) => {
          setTimeout(() => { box.classList.add('visible') }, 800)
          game.found(images[i])
        })

        this.clickedBoxes = []
        this.flip = true
      } else {
        this.timer = setTimeout(() => { doThat.call(this, doAfter) }, 1000)
      }
    }
    function doThat (callback) {
      this.clickedBoxes.forEach((box) => {
        box.classList.toggle('flip')
      })
      clearTimeout(this.timer)
      callback.call(this)
    }
    function doAfter () {
      setTimeout(() => {
        this.clickedBoxes.forEach((box) => {
          box.setAttribute('is-flipped', 'false')
        })
        this.clickedBoxes = []
        this.flip = true
      }, 600)
    }
  }
  /*
    The recurssionUp and recurssionDown are used to find the div class that contains 'box'
  */

  _getParentNode (img) {
    const parent = img.parentNode
    if (parent.classList.contains('box')) {
      return parent
    } else {
      return this._getParentNode(parent)
    }
  }

  _recurssionUp (target, stop) {
    let currentNode = target
    if (currentNode === stop) {
      return undefined
    } else if (currentNode.classList.contains('box')) {
      return currentNode
    } else {
      currentNode = currentNode.parentNode
      return this._recurssionUp(currentNode, stop)
    }
  }

  _recurssiondown (target) {
    let current = target
    if (current.classList.contains('box')) {
      return current
    } else {
      current = current.firstElementChild
      return this._recurssionUp(current)
    }
  }

  _shuffle (arr) {
    const newArr = arr
    let shuffled = false
    let count = 0
    const bestShuffle = {
      closeness: undefined,
      arr: []
    }

    while (!shuffled || count === 3) {
      for (let i = 0; i < newArr.length / 2; i++) {
        const randomIndex = this._randomIndexGen(i, newArr)
        const temp = newArr[randomIndex]
        newArr[randomIndex] = newArr[i]
        newArr[i] = temp
      }
      count++
      let tooClose = 0
      for (let i = 0; i < newArr.length; i++) {
        if (i === newArr.length - 1) {
          break
        } else if (newArr[i].isEqualNode(newArr[i + 1])) {
          tooClose++
        }
      }
      if (tooClose > 1) {
        shuffled = false
      } else {
        shuffled = true
      }

      if (bestShuffle.closeness === undefined || bestShuffle.closeness > tooClose) {
        bestShuffle.closeness = tooClose
        bestShuffle.arr = newArr
      }
    }
    return bestShuffle.arr
  }

  _randomIndexGen (min, arr) {
    min = min + 1
    const max = arr.length
    return Math.floor(Math.random() * (max - min) + min)
  }

  disconnectedCallback () {
    this.shadowRoot.innerHTML = ''
  }
}

window.customElements.define('memory-game', Memorygame)
