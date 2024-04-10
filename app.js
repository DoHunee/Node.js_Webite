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
app.use('/uploads', express.static('uploads')); // 이 부분이 있어야 관리자에서 이미지 제대로 뜬다!!




// 기본 페이지를 index 설정!
app.get('/', (req, res) => {
  res.render('index')   // ./views/index.ejs  
})


app.get('/fileDelete', (req, res) => {
  var idx = req.query.idx 
  var sql = `delete from upload_files where idx='${idx}' `
  connection.query(sql, function (err, result){
     if(err) throw err; 
     
     res.send("<script> alert('삭제되었습니다.'); location.href='/fileList';</script>"); 
 })
})

app.get('/fileList', (req, res) => {

  var sql = `select * from upload_files order by idx desc `
  connection.query(sql, function (err, results, fields){
     if(err) throw err; 
     res.render('fileList',{lists:results})
  })
  
})


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
app.get('/upload_files', (req, res) => {
  res.render('upload_files');
});

// 업로드된 파일과 문의사항을 함께 처리하는 POST 라우트
app.post('/upload_files', upload.single('file'), (req, res) => {
  const { name, phone, email, memo } = req.body;
  const file = req.file; // 업로드된 파일 정보

  // 파일 정보와 문의사항 정보를 'upload_files' 테이블에 저장. 'regdate' 필드에 현재 시간을 삽입
  const sql = `INSERT INTO upload_files (name, phone, email, memo, filename, filepath, regdate) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
  const values = [name, phone, email, memo, file.filename, file.path];

  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error('데이터베이스 오류 발생:', err);
          return res.status(500).send("데이터를 데이터베이스에 저장하는 데 실패했습니다.");
      }
      console.log('데이터가 데이터베이스에 성공적으로 저장되었습니다.');
      res.send('<script>alert("문의사항과 파일이 성공적으로 업로드되었습니다."); location.href="/";</script>');
  });
});



app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`);
});


