const board = artifacts.require('board') // 'board' == 컨트랙트 이름

module.exports = () => {
    deployer.deploy(board)
    .then(()=>
        console.log("Contract Deployed !!")
    )
}