const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const container = $('.container')
const errMessage = $('.errMessage')
const searchInput = $('.search-input')
const cityName = $('.city-name')
const weatherState = $('.weather-state')
const weatherIcon = $('.weather-icon')
const microphone = $('.microphone')
const temperature = $('.temperature')
const sunrise = $('.sunrise')
const sunset = $('.sunset')
const humidity = $('.humidity')
const windSpeed = $('.wind-speed')

const app = {
    // Search with input
    searchInput() {
        const API_KEY = '1a960b83d93ce80553513257a83be417'
        const DEFAULT_VALUE = '--'
        const uppercaseFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)
        searchInput.addEventListener('change', e => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&units=metric&lang=vi&appid=${API_KEY}`)
                .then(async response => {
                    const data = await response.json()
                    console.log(data)
                    cityName.innerHTML = data.name || DEFAULT_VALUE
                    weatherState.innerHTML = uppercaseFirstLetter(data.weather[0].description) || DEFAULT_VALUE
                    weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                    temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE
                    sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:m') || DEFAULT_VALUE
                    sunset.innerHTML = moment.unix(data.sys.sunset).format('H:m') || DEFAULT_VALUE
                    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE
                    windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE
                })
                .catch(err => {
                    console.log(err)
                })
        })
    },
    // Search with voice
    searchSpeech() {
        const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'vi-VI'
        recognition.continuous = false

        const synth = window.speechSynthesis

        const speak = (text) => {
            if(synth.speaking) {
                console.error('Busy. Speaking...')
            }

            const utter = new SpeechSynthesisUtterance(text)
            utter.onend = () => {
                console.log('SpeechSynthesisUtter End.')
            }
            utter.onerror = err => {
                console.log('SpeechSynthesisUtter Error', err)
            }
            synth.speak(utter)
        }

        const handelVoice = text => {
            console.log(text)
            if (text.includes('th???i ti???t t???i')) {
                const location = text.split('t???i')[1].trim()
                console.log(location)
                searchInput.value = location
                const changeEvent = new Event('change')
                searchInput.dispatchEvent(changeEvent)
                return
            }
            if (text.includes('thay ?????i m??u n???n')) {
                const backgroundColor = text.split('n???n')[1].trim().toLocaleLowerCase()
                console.log(backgroundColor)
                container.style.background = backgroundColor
                return
            }
            if (text.includes('m??u n???n m???c ?????nh')) {
                container.style.background = `linear-gradient(145deg, #2193b0, #6dd5ed)`
                return
            }
            if(text.toLowerCase().includes('m???y gi???')){
                const time = `${moment().hours()} hours ${moment().minutes()} minutes`
                console.log(time)
                speak(time)
                return
            }

            speak('Try again ...')
        }

        microphone.addEventListener('click', e => {
            e.preventDefault()
            recognition.start()
            microphone.classList.add('recording')
        })

        recognition.onspeechend = () => {
            recognition.stop()
            microphone.classList.remove('recording')
        }

        recognition.onerror = (err) => {
            console.log(err)
        }

        recognition.onresult = e => {
            console.log('result', e)
            const result = e.results[0][0].transcript
            handelVoice(result)
        }
    },
    start() {
        this.searchInput()
        this.searchSpeech()
    }
}

app.start()

