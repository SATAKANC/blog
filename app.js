const express=require('express')
const {engine}= require('express-handlebars')
const expressSession= require('express-session')
const fileUpload=require('express-fileupload')
const dotenv = require('dotenv')
const path = require('path')
const dbs = require(path.join(__dirname,'dbs.js'))
const crypto= require('crypto')

console.log(crypto.randomBytes(64).toString('hex'))
//db bağlantısı
dbs() 

//başlangıç ayarları
dotenv.config()
const app = express()

//değişken
const time=1000*60*30
const SECRET_VALUE=process.env.SECRET_VALUE || 'myBlog'
const PORT=process.env.PORT || 5000
const API_URL=process.env.API_URL || 'http://127.0.0.1:5000'

//şablon motoru
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join (__dirname,'views')) 


//middleware

app.use(express.json())
app.use(fileUpload())
app.use(expressSession(
    {
        secret: SECRET_VALUE,
        resave: false,
        saveUninitialized: true,
        cookie: {path:'/',httpOnly:true,secure:false,maxAge:time}
    }
))
app.use(express.static(path.join (__dirname,'public')))


// Router Tanımlama
const indexpage = require(path.join ( __dirname,'router','indexpage.js' ))
const aboutpage = require(path.join ( __dirname,'router','aboutpage.js' ))

const addpage = require(path.join ( __dirname,'router','addpage.js' ))
const registerpage = require(path.join ( __dirname,'router','registerpage.js' ))
const loginpage = require(path.join ( __dirname,'router','loginpage.js' ))
const contactpage = require(path.join ( __dirname,'router','contactpage.js' ))
const logoutpage = require(path.join ( __dirname,'router','logoutpage.js' ))
const singlepage = require(path.join ( __dirname,'router','singlepage.js' ))






app.use('/',(req,res,next)=>{

const{userID}=req.session

if(userID){
    res.locals.user=true

}
else { 
res.locals.user=false

}
next()

})










// Router Kullanma
app.use('/index',indexpage)
app.use('/contact',contactpage)
app.use('/about',aboutpage)
app.use('/add',addpage)
app.use('/register',registerpage)
app.use('/login',loginpage)
app.use('/logout',logoutpage)
app.use('/single',singlepage)
app.use('*',(req,res,next)=>{
    res.render('site/error')
})
    




app.listen(PORT,()=>{
    console.log(`Server is running ${API_URL}`)
}) 



