const express = require('express')
const multer  = require('multer'); //파일 업로드를 위한!!
const ejs = require('ejs') 
const app = express()
const port = 3000
var bodyParser = require('body-parser')
const path = require('path');

require('dotenv').config()



const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')



app.set('view engine','ejs')
app.set('views','./views')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public')); // 정적 파일 제공을 위한 미들웨어 설정


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

  var sql = `insert into contact(name,phone,email,memo,regdate) values(?,?,?,?,now())`;
  var values = [name,phone,email,memo]; 

  connection.query(sql, values, function (err, result) {
    if (err) {
      console.error('오류 발생:', err);
      return res.status(500).send("서버 오류가 발생했습니다.");
    }
    console.log('자료 1개를 삽입하였습니다.');
    res.send("<script>alert('문의사항이 등록되었습니다.'); location.href='/';</script>");
  });
});



// Multer 설정: 업로드된 파일을 'uploads' 폴더에 저장
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 파일이 저장될 서버 상의 경로
  },
  filename: function (req, file, cb) {
    // 파일 이름 설정
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// 파일 업로드 폼을 제공하는 라우트
app.get('/upload', (req, res) => {
  res.render('upload');
});

// POST 요청을 처리하는 라우트
app.post('/upload', upload.single('file'), (req, res) => {
  // 업로드된 파일 정보는 req.file 에 있음
  console.log(req.file);

  res.send('파일이 업로드되었습니다.');
});

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`);
});


