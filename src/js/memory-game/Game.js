import { unknown } from './functions.js'
/*
  A dependencie of memory-game module
  Printing the game is its main objective
  */
export default function Game (gameSize, shadowRoot, arr, event, eventTarget, player) {
  this.gameSize = gameSize
  this.shadowRoot = shadowRoot
  this.arr = arr
  const foundImages = []
  this.event = event
  this.eventTarget = eventTarget
  this.player = player

  const draw = function () {
    const main = this.shadowRoot.querySelector('.cards')
    if (this.gameSize === '2x2') {
      matrixGen.call(this, 2, 2, main)
    } else if (this.gameSize === '4x4') {
      matrixGen.call(this, 4, 4, main)
    } else if (this.gameSize === '2x4') {
      matrixGen.call(this, 4, 2, main)
    }
  }

  /*
  Genereates the matrix dependinf on the given game size
  */

  const matrixGen = function (rows, columns, main) {
    let index = 0
    const boolean = false
    for (let i = 0; i < rows; i++) {
      const div = document.createElement('div')
      main.append(div)
      div.classList.add('flex-rows')
      for (let j = 0; j < columns; j++) {
        let templ = document.getElementById('container')
        templ = templ.content.cloneNode(true)
        const container = templ.querySelector('.container')
        const box = container.querySelector('.box')
        box.setAttribute('id', `id${index}`)
        box.setAttribute('is-flipped', `${boolean}`)
        box.parentNode.setAttribute('tabindex', '0')
        const front = box.querySelector('.front')
        const back = box.querySelector('.back')
        back.append(this.arr[index])
        const frontPic = unknown.cloneNode()
        front.append(frontPic)
        div.append(container)
        if (this.gameSize === '4x4') {
          container.style.width = 72 + 'px'
          container.style.height = 72 + 'px'
        } else if (this.gameSize === '2x4') {
          container.style.width = 80 + 'px'
          container.style.height = 80 + 'px'
        }
        index++
      }
    }
    index = 0
  }

  this.start = function () {
    const lol = draw.bind(this)
    lol()
  }

  this.stop = function () {
    const main = this.shadowRoot.querySelector('.cards')
    main.innerHTML = ''
    const h2 = document.createElement('h2')
    h2.textContent = 'Game Over'
    const p = document.createElement('p')
    p.textContent = `You finished in ${this.player.numberOfAttempts} tries`
    main.append(h2)
    main.append(p)
  }

  /*
  When all the cards have been turned
  */

  this.found = function (img) {
    foundImages.push(img)
    if (foundImages.length === this.arr.length) {
      this.eventTarget.dispatchEvent(this.event)
    }
  }

  Object.defineProperty(this, 'founds', {
    get () {
      return foundImages
    }
  })
}
