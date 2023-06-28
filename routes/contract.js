// express 로드
const express = require('express')
// Router() 함수를 변수 router에 대입 
const router = express.Router()

// moment 모듈 로드
// 현재 시간을 가져와 format 설정!
const moment = require('moment')

// bobab 네트워크에 배포한 컨트랙트를 연동하기 위한 모듈 로드
const Caver = require('caver-js')
// 컨트랙트의 정보 로드
// board.json 안에 abi, 컨트랙트 주소 있음
const contract_info = require('../build/contracts/board.json')

// bobab 네트워크의 주소를 입력
const caver = new Caver('https://api.baobab.klaytn.net:8651')

// 배포된 컨트랙트를 연동
const smartContract = new caver.klay.Contract(
    // abi와 address 필요
    contract_info.abi,
    contract_info.networks['1001'].address
)

// 수수료를 지불할 지갑을 등록
const account = caver.klay.accounts.createWithAccountKey(
    // 퍼블릭키, 프라이빗키 필요
    process.env.public_key,
    process.env.private_key
)

// caver.Klay에 지갑 등록
caver.klay.accounts.wallet.add(account) 

module.exports = ()=>{
    // 해당하는 파일의 api의 기본 경로: localhos:3000/contract

    // localhos:3000/contract [get] 
    // 등록된 게시글의 목록 보여줌 => contract 안에 있음
    router.get('/', async (req,res)=>{
        // contract를 이용하여 저장된 모든 데이터를 로드한다.
        // => 저장된 데이터의 갯수를 확인하는 함수 호출
        const content_len = await smartContract
                            .methods
                            .view_content_no()
                            // view 함수는 수수료 발생 X (확인만 하기 때문)
                            // ==> 수수료를 낼 지갑 정보 필요 X
                            .call() // 그냥 call
        console.log('-> 글 갯수 확인하기: ', content_len);
        
        // 비어있는 배열 생성: 글 목록 담기
        const data = new Array()
        for(let i=0; i<content_len; i++) {
            // view_content() 함수를 호출하여
            // return 받은 결과값을 data[]에 push
            const result = await smartContract
                                 .methods
                                 .view_content(i) // view 함수
                                 .call() // 수수료 지갑 설정 필요 X 그냥 call
            data.push(result)
        }

        console.log('-> 글 목록 확인: ', data)

        // 응답하기
        // (리액트면 res.send로 데이터 보내주기..)
        res.render('contents_list.ejs', {
            'data': data
        })
    })

    // 글의 내용을 추가할 수 있는 페이지
    // location:3000/contract/add [get]
    router.get('/add', (req, res)=>
        res.render('add_content.ejs')
    )
    
    // 글의 내용들을 contract를 이용하여 저장하는 api
    // location:3000/contract/add2 [post]
    router.post('/add2', async (req, res)=>{
        // 유저가 보낸 데이터를 변수에 대입, 확인
        const input_title = req.body._title
        const input_content = req.body._content
        const input_writer = account.address
        const input_image = req.body._image

        console.log("-> 유저가 작성한 내용: ", input_title, input_content, input_writer, input_image)
        
        // 현재 시간 필요
        let date = moment()
        const create_dt = date.format('YYYY-MM-DD HH:mm')
        console.log("-> 작성일: ", create_dt)

        // smartContract(배포된 컨트랙트)에 있는 함수를 호출하여 데이터 저장
        const receipt = await smartContract
                              .methods
                              .add_content( // 데이터가 변경되면 수수료 지불됨
                                input_title,
                                input_content,
                                input_writer,
                                input_image,
                                create_dt
                              )
                              .send( // 수수료 지불자, 금액 지정
                                {
                                    from : account.address, //account: 수수료를 지불할 지갑
                                    gas : 2000000 // max 가스비
                                }
                              )
        console.log("-> 작성 결과: ", receipt)
        res.redirect('/contract')
    })

    return router
}