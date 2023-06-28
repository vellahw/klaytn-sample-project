// express 로드
const express = require('express')
// Router() 함수를 변수 router에 대입 
const router = express.Router()

// bobab 네트워크에 배포한 컨트랙트를 연동하기 위한 모듈 로드
const Caver = require('caver-js')
// 컨트랙트의 정보 로드
// board.json 안에 abi, 컨트랙트 주소 있음
const contract_info = require('../build/contracts/board.json')

// bobab 네트워크의 주소를 입력
const caver = new Caver('https://api.baobab.klaytn.net:8651')

// 배포된 컨트랙트를 연동
const smartContract = new caver.Klay.Contract(
    // abi와 address 필요
    contract_info.abi,
    contract_info.networks['1001'].address
)

// 수수료를 지불할 지갑을 등록
const account = caver.Klay.accounts.caverWithAccountKey(
    // 퍼블릭키, 프라이빗키 필요
    process.env.public_key,
    process.env.private_key
)

// caver.Klay에 지갑 등록
caver.Klay.wallet.add(account)