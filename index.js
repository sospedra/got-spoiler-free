const TelegramBot = require('node-telegram-bot-api')

const token = require('./.token')
const guard = require('./guard')
const orm = require('./orm')

const CLEAR_CHAT_SPACE = Array(40).fill('\n').join('.')
const CLEAR_CHAT_TEXT = 'Whaaa! Do not spoil things in here! 🚨'
const bot = new TelegramBot(token, { polling: true })

const kick = (chatID, userID) => {
  bot.kickChatMember(chatID, userID).then((kicked) => {
    kicked && orm.set(name, 2)
    kicked && bot.sendMessage(charID, `🔪 ${user} is being kicked out`)
  })
}

const warn = (chatID, name) => {
  orm.addUser(name)
  orm.set(name, 1)
  bot.sendMessage(chatID, `Ooops! First and last warn for ${name} 🙅`)
}

bot.onText(/\/warns/, async (incoming) => {
  const chatID = incoming.chat.id
  const users = await orm.getUsers()
  const message = users.map(([user, warning]) => {
    return warning === '1'
      ? `⚠️ ${user} has ${warning} warn(s)`
      : `☠️ ${user} has been kicked out`
  })

  bot.sendMessage(chatID, message.join('\n'))
})

bot.on('message', async (incoming) => {
  const chatID = incoming.chat.id
  const userID = incoming.from.id
  const name = incoming.from.username
  const cleanChatMessage = CLEAR_CHAT_SPACE + CLEAR_CHAT_TEXT
  const warning = await orm.get(name)

  guard(new Date()) && bot.sendMessage(chatID, cleanChatMessage)

  return warning === '1'
    ? bot.kickChatMember(chatID, userID)
    : warn(chatID, name)
})
