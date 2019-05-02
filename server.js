let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')

// template engine
app.set('view engine', 'ejs')

// Middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'aeddzdfdzef',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(require('./middlewares/flash'))

//Routes
app.get('/', (request, response) => {
    let Message = require('./models/message')
    Message.all(function(messages) {
        response.render('pages/index', {messages: messages})
    })

})

app.post('/', (request,response) => {
    if(request.body.message === undefined || request.body.message === '') {
        request.flash('error', "you didn't write a message !!")
        response.redirect('/')
    } else {
        let Message = require('./models/message')
        Message.create(request.body.message, () => {
            request.flash('success', "Thanks for your message !")
            response.redirect('/')
        })
    }
})

app.listen(8080)