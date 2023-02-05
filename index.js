const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./option.js')
const { json } = require('stream/consumers')

const token = '5817802686:AAH87pZRFjchnuXI-fAMeAqmfxhkk8GVvMk'



const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
	await bot.sendMessage (chatId, 'Загадываю цифру от 1 до 10')
	const randomNumber = String(Math.floor(Math.random() * 10));
	chats[chatId] = randomNumber;
	await bot.sendMessage (chatId, 'Отгадывай', gameOptions);
}


bot.on('message', msg => {
  console.log(msg)
})


const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветсвие'},
    {command: '/info', description: 'Основная информация'},
    {command: '/end', description: 'Завершение сеанса'},
    {command: '/game', description: 'Игра'}
  ])
  
  
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    
    // console.log(msg)
  
    if (text === '/start') {
      console.log(msg.from)
        await bot.sendSticker (chatId, 'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/19.webp')
        return bot.sendMessage (chatId, 'Начинаю работу , на какой день открыть расписание');
    }
    if (text === '/info') {
        console.log(msg.from)
        return bot.sendMessage (chatId, `Тебя зовут - ${msg.from.first_name} , Твоя группа "УК-1021" `);
    }
    if (text === '/end') {
      console.log(msg.from)
        
        await bot.sendMessage (chatId, `Ложусь спать`)
        return bot.sendSticker (chatId, 'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/18.webp')
        
    }
    if (text === '/game') {
        return startGame(chatId);
    }

        return bot.sendMessage (chatId, 'Что ты несешь! Через какие деревья ты бежишь?');
  })

  bot.on ('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;

		if (data === '/again') {
				return startGame(chatId)
		}
		if (data === chats[chatId]) {
				return bot.sendMessage(chatId, `Ты угадал ${chats[chatId]}`, againOptions)
		}	
		else {
				return bot.sendMessage(chatId, `Ты проиграл ${chats[chatId]}`, againOptions)
		}

  })
}

start()