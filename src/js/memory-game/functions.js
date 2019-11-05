const path = './image/'
const img = document.createElement('img')
img.setAttribute('src', `${path}0.png`)
img.classList.add('img')
export const unknown = img

export function Player (name) {
  this.name = name
  let tries

  Object.defineProperty(this, 'numberOfAttempts', {
    get () {
      return tries
    },
    set (value) {
      tries = value
    }
  })
}
