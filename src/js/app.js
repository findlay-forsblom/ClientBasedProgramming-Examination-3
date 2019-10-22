import { ChatApp } from './chat/chat.js'

export function User (user) {
  this.name = user
  this.isLoggedIn = false
}

// const currentUsers = []
// const storage = localStorage
// storage.clear()
// storage.setItem('currentUsers', currentUsers)
const app = document.createElement('chat-app')
const app2 = document.createElement('chat-app')
document.querySelector('body').append(app)
// document.querySelector('body').append(app2)
console.log(ChatApp.getNumberOfUsers())
