'use strict';

const TelegramBot = require("node-telegram-bot-api"),
    request = require("request"),
    fs = require("fs"),
    bot = new TelegramBot(token, {polling: true}),
    config = require('./config'),
    API_KEY = config.API_KEY,
    token = config.TOKEN;

bot.on("message", function (msg) {
    const id = msg.from.id,
        _messageText = msg.text,
        messageText = _messageText.toLowerCase();

    if (messageText === "привет") {
        bot.sendMessage(id, "Привет, я бот и это классно!");
    } else if (messageText === "курс") {
        request("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const data = JSON.parse(body);
                data.forEach(function (value) {
                    bot.sendMessage(id, `${value.ccy}: ${value.buy} | ${value.sale}`);
                });
            }
        });
    } else if (messageText === "песня") {
        bot.sendMessage(id, 'Введи * и название песни)');
    } else if (messageText.charAt(0) === "*") {
        let songName = messageText.slice(1);
        if (songName) {
            songName = encodeURIComponent(songName);
            request(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${songName}&api_key=${API_KEY}&format=json`, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    const data = JSON.parse(body);
                    if (data.results.trackmatches.track.length !== 0) {
                        bot.sendMessage(id, `${data.results.trackmatches.track[0].url}`);
                    } else if (error) {
                        bot.sendMessage(id, "Ууупс... Ошибочка вышла");
                    } else {
                        bot.sendMessage(id, 'Прости, я не знаю такой песни(');
                    }
                }
            });
        }
    } else if (messageText === "what does the fox say?") {
        bot.sendMessage(id, "Ring-ding-ding-ding-dingeringeding!\n" +
            "Gering-ding-ding-ding-dingeringeding!\n" +
            "Gering-ding-ding-ding-dingeringeding!");
    } else {
        bot.sendMessage(id, `Я пока умею только это:\n'привет',\n 'курс',\n'What does the fox say?',\n'песня')\nНо я научусь!`);
    }

});