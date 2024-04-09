const express = require('express')
const app = express()
const port = 3000

//라우터 
app.get('/', (req,res) => {
  res.send("<h1>hello world!</h1> ")  // 사용자에게 보여주는 부분 
})

app.listen(port, () =>{
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`)
})