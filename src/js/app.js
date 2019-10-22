import './chat/chat.js'

export function User (user) {
  const name = user

  Object.defineProperty(this, 'user', {
    get () {
      return name
    }
  })
}
