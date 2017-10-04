'use strict'

var generateResponse = function(options) { 
    var response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: options.speechText
            },
            shouldEndSession: options.endSession
        }
    }
    if (options.repromtText) {
        response.response.repromt = {
            outputSpeech: {
                type: "PlainText",
                text: options.repromtText
            }
        }
    }
    return response
}

var randomGenerator = function(list) {
    let choice = Math.floor(list.length * Math.random())
    return list[choice]
}

const russianList = [
    "e d na huy"
]

const englishList = [
    "hey, skrew you",
]

const germanList = [
    'fick dehh sebss'
]

const portugueseList = [
    'foda si'
]

const spanishList = [
    'vete a la mierda'
]

const hungarianList = [
    'menyy a peach aaba'
]

const supportedLanguages = [
    'English',
    'Russian',
    'Spanish',
    'German',
    'Portuguese',
    'Hungarian'
]

const LanguageLists = {
    Russian: russianList,
    English: englishList,
    German: germanList,
    Portuguese: portugueseList,
    Spanish: spanishList,
    Hungarian: hungarianList 
}

exports.handler = function(event, context) {

    try {
        var request = event.request;

        if (request.type === "LaunchRequest") {

            let options = {};
            options.speechText = "Welcome to roaster skill. Using our skill you can roast your friends. Whom do you want to roast?"
            options.repromptText = "You can say, for example, roast John"
            options.endSession = false

            context.succeed(generateResponse(options))

        } else if (request.type === "IntentRequest") {
            if (request.intent.name === 'HelloIntent') {
                var options = {}

                var personName = request.intent.slots.FIRSTNAME.value
                let language = request.intent.slots.LANGUAGE.value

                if (typeof(language) === 'undefined') {
                    language = 'English'
                }

                if (supportedLanguages.indexOf(language) >= 0) {
                    options.speechText = randomGenerator(LanguageLists[language]) + " " + personName
                }else {
                    throw ('UNKNOWN LANGUAGE: ' + language)
                }

                options.endSession = true

                context.succeed(generateResponse(options))

            } else {
                throw ('UNKNOWN INTENT: ' + request.type)
            }

        } else if (request.type === "SessionEndedRequest") {
            let options = {}
            options.speechText = 'Goodbye'
            options.endSession = true

            context.succeed(generateResponse(options))

        } else {
            throw ('UNKNOWN REQUEST TYPE: ' + request.type);
        }
    } catch (e) {
        context.fail("Exception: " + e)
    }
}