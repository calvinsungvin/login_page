const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const port = 3000

const users = [
  { id: 1,
    firstName: 'Tony',
    email: 'tony@stark.com',
    password: 'iamironman'
  },
  { id: 2,
    firstName: 'Steve',
    email: 'captain@hotmail.com',
    password: 'icandothisallday'
  },
  { id: 3,
    firstName: 'Peter',
    email: 'peter@parker.com',
    password: 'enajyram'
  },
  { id: 4,
    firstName: 'Natasha',
    email: 'natasha@gamil.com',
    password: '*parol#@$!'
  },
  { id: 5,
    firstName: 'Nick',
    email: 'nick@shield.com',
    password: 'password'
  }
]

const redirectLogin = ( req, res, next) => {
  if (!req.session.userId){
    console.log(req.session)
    res.redirect('/login')
  } else {
    next()
  }
}

const redirectHome = ( req, res, next) => {
  if (req.session.userId){
    res.redirect('/home')
  } else {
    next()
  }
}

// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//session
app.use(session({
  secret: 'helloworld',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000  //ms
  }
}))

//GET 登入前首面
app.get("/", (req,res) => {
  const { userId } = req.session
  if (userId){
    res.render('welcomeAfterLogin')
  } else {
    res.render('welcomeBeforeLogin')
  }
})

//GET 登入後主面
app.get("/home", redirectLogin, (req,res) => {
  const user = users.find(user => user.id === req.session.userId)
  const firstName = user.firstName
  const email = user.email
  console.log(user)
  res.render('welcomeAfterLogin', { firstName, email })
})

//GET login 頁面
app.get("/login", redirectHome, (req,res) => {
  res.render('login')
})

//GET register 頁面
app.get("/register", redirectHome, (req,res) => {
  res.render('register')
})

//POST login
app.post("/login", redirectHome, (req,res) => {
  const { email, password } = req.body

  if(email && password){
    const user = users.find(
      item => item.email === email && item.password === password
    )
    if (user) {
      req.session.userId = user.id
      console.log(req.session.userId)
      return res.redirect('/home')
    }
  }
  res.redirect('/login')
})

//POST register
app.post("/register", redirectHome, (req,res) => {
  const { firstname, email, password } = req.body
  if (firstname && email && password){
    const exists = users.some(
      user => user.email === email
    )
    if (!exists) {
      const user = {
        id: users.length + 1,
        firstname,
        email,
        password
      }
      users.push(user)
      req.session.userId = user.id
      return res.redirect('/home')
    }
  }
  console.log(req.body)
  res.redirect('/login')
})

//POST logout
app.post("/logout", redirectLogin, (req,res) => {
  req.session.destroy()
  res.redirect('/login')
})


// listen on the port
app.listen(port, () => {
    console.log(`server is listening on localhost:${port}`)
  })




