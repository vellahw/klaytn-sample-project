// express 로드
const express = require('express')
const app = express()

const port = 3000

// view 파일들의 기본 경로 설정 
// 리액트 쓸 땐 필요 없음
app.set('views', __dirname+'/views')
// view engine 설정
app.set('view engine', 'ejs')

// post 방식으로 데이터가 들어오는 경우 json 형태로 데이터를 변환
app.use(express.urlencoded({extended:false}))

// 서버가 돌 때 실질적인 실행파일은 index.js이다.
// 외부의 js, css와 같은 정적 파일의 기본 경로를 설정
// public 폴더 사용하겠다!
app.use(express.static('public'))

// localhost:3000 [get] 요청이 들어왔을 때
app.get('/', (req, res)=>
    res.redirect('/user')
)

// dotenv
require('dotenv').config()

// routing 사용
// const sql = require('./routes/sql.js')
// app.use('/user', sql)

const contract = require('./routes/contract.js')()
app.use('/contract', contract)

const server = app.listen(port, ()=>console.log(port, "Server Start!!"))