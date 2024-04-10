const express = require('express')
const multer  = require('multer'); //파일 업로드를 위한!!
const ejs = require('ejs') 
const app = express()
const port = 3000
var bodyParser = require('body-parser')
const path = require('path');
// const session = require('express-session');

require('dotenv').config()



const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')

app.set('view engine','ejs')
app.set('views','./views')


app.use(bodyParser.urlencoded({ extended: false }))
app.use('/images',express.static('images')); // images 디렉토리를 애플리케이션의 정적 파일을 제공하는 디렉토리로 설정
app.use('/uploads', express.static('uploads')); // 이 부분이 있어야 관리자에서 이미지 제대로 뜬다!!

// app.use(session({ secret: 'unidago', cookie: { maxAge: 60000 }, resave:true, saveUninitialized:true, }))

// app.use((req, res, next) => {    


//   res.locals.user_id = "";
//   res.locals.name = "";

//   if(req.session.member){ 
//      res.locals.user_id = req.session.member.user_id 
//      res.locals.name = req.session.member.name 
//   }
//   next()
// })


// 기본 페이지!!
app.get('/', (req, res) => {
  res.render('index')   // ./views/index.ejs  
})

app.get('/profile', (req,res) => {
  res.render("profile")  
})

app.get('/map', (req,res) => {
  res.render("map")  
})

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

app.get('/contactDelete', (req, res) => {
  var idx = req.query.idx 
  var sql = `delete from contact where idx='${idx}' `
  connection.query(sql, function (err, result){
     if(err) throw err; 
     
     res.send("<script> alert('삭제되었습니다.'); location.href='/contactList';</script>"); 
 })
})

app.get('/contactList', (req, res) => {

  var sql = `select * from contact order by idx desc `
  connection.query(sql, function (err, results, fields){
     if(err) throw err; 
     res.render('contactList',{lists:results})
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
app.get('/upload', (req, res) => {
  res.render('upload');
});

// POST 요청을 처리하는 라우트
// 업로드 된 이미지나 동영상의 메타데이터를 files DB에 저장!
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file; // 업로드된 파일 정보
  const filepath = file.path; // 파일이 저장된 서버 상의 경로
  const filename = file.filename; // 저장된 파일명

  // 파일 메타데이터를 데이터베이스에 저장하는 쿼리
  const sql = "INSERT INTO files (filename, filepath) VALUES (?, ?)";
  const values = [filename, filepath];

  // 데이터베이스 쿼리 실행
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('데이터베이스 오류 발생:', err);
      return res.status(500).send("파일 메타데이터를 데이터베이스에 저장하는 데 실패했습니다.");
    }
    console.log('파일 메타데이터가 데이터베이스에 성공적으로 저장되었습니다.');
    res.send('<script>alert("파일이 업로드되었으며, 메타데이터가 데이터베이스에 저장되었습니다."); location.href="/";</script>');
  });
});

// 이미지 보기!
app.get('/adminFiles', (req, res) => {
  const sql = "SELECT * FROM files"; // 모든 파일 메타데이터 조회

  connection.query(sql, (err, files) => {
    if (err) {
      console.error('오류 발생:', err);
      return res.status(500).send("파일 목록을 불러오는 데 실패했습니다.");
    }

    // 'adminFiles.ejs' 템플릿을 사용하여 파일 목록 렌더링
    res.render('adminFiles', { files });
  });
});


// app.get('/login', (req, res) => {
//   res.render('login')  
// })


// app.post('/loginProc', (req, res) => {
//   const user_id = req.body.user_id; 
//   const pw = req.body.pw; 

//   var sql = `select * from member  where user_id=? and pw=? `

//   var values = [user_id, pw]; 

//   connection.query(sql, values, function (err, result){
//       if(err) throw err;      
      
//       if(result.length==0){
//         res.send("<script> alert('존재하지 않는 아이디입니다..'); location.href='/login';</script>");          
//       }else{  
//         console.log(result); 
//         console.log(result[0]); 

//         req.session.member = result[0]  
//         res.send("<script> alert('로그인 되었습니다.'); location.href='/';</script>");          
//         //res.send(result); 
//       }
//   })

// })



// app.get('/logout', (req, res) => {
//   req.session.member = null; 
//   res.send("<script> alert('로그아웃 되었습니다.'); location.href='/';</script>");          
// })


app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`);
});


