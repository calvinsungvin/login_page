const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const checkUser = require('./checkUsers')
const port = 3000

// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// set routes
app.get('/', (req, res) => {
  res.render('index')
})

// 
app.post('/', (req, res) => {
    const userName = checkUser(req.body)
    console.log(req.body)
    if (userName){
        res.render('welcome', { userName })
    } else {
     const errorMessage = "There is an error!"
     res.render('index', { errorMessage, email, password})
    }
   })

// listen on the port
app.listen(port, () => {
    console.log(`server is listening on localhost:${port}`)
  })




