const express = require('express')
const ejs = require('ejs') 
const app = express()
const port = 3000
var bodyParser = require('body-parser')

require('dotenv').config()



const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')



app.set('view engine','ejs')
app.set('views','./views')


app.use(bodyParser.urlencoded({ extended: false }))

// 기본 페이지!!
app.get('/', (req, res) => {
  res.render('index')   // ./views/index.ejs  
})

app.get('/profile', (req,res) => {
  res.render("profile")  
})

app.get('/map', (req,res) => {
  res.render("map")  
})+

app.get('/contact', (req,res) => {
  res.render("contact")  
})

app.post('/contactProc', (req, res) => {
  const name = req.body.name; 
  const phone = req.body.phone; 
  const email = req.body.email; 
  const memo = req.body.memo; 

  var a = ` ${name} ${phone} ${email} ${memo} `
  res.send(a);
  var sql = `insert into contact(name,phone,email,memo,regdate)
  values(?,?,?,?,now() )`
   
  var values = [name,phone,email,memo]; 

  connection.query(sql, values, function (err, result){
      if(err) throw err; 
      console.log('자료 1개를 삽입하였습니다.');
      res.send("<script> alert('문의사항이 등록되었습니다.'); location.href='/';</script>"); 
  })

})




app.listen(port, () =>{
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`)
})