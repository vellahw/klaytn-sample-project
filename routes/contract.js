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
    contract_info.abi,
    contract_info.networks.address
)