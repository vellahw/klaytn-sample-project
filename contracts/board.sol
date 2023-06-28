// SPDX-License-Identifier: MIT
pragma solidity = 0.8.19;

contract board {
    // owner 주소 변수 선언
    address internal owner;
    // 글번호 초기변수
    uint internal content_no;

    // 구조체 생성
    struct content_info{
        string title;
        string content;
        address writer;
        string image; // 서버에 저장하는 이미지 (파일 업로드)
        string create_dt; // 작성일
    }

    // mapping 변수 생성
    // 구조체는 주로 mapping에서 사용
    mapping (uint => content_info) internal contents;

    // deploy가 될때 최초로 한 번만 실행이 되는 함수 (초기화 함수)
    // 따라서 권한과 이름이 필요하지 않음
    constructor(){
        // 게시판에 글을 올릴 때 owner 말고는 글을 올리지 못하도록????
        owner = msg.sender;
        content_no = 0;
    }

    // Modifier 함수: 함수에 추가적인 행동을 '지정'할 때 사용 => 이름 필요
    // 독립적으로 실행 불가능
    // 어떠한 함수를 만들어놓고 해당 함수 안에서 사용할 것임 (따라서 괄호도 생략됨)
    modifier onlyOwner {
        // require(bool, false일 때 받을 메세지)
        require(msg.sender == owner, "Only owner can call function");
        _; // 융합된 함수 실행
    }

    // 글번호 +1 증가 시키기 
    modifier increament {
        _; // mapping에 데이터 추가하는 작업
        content_no++; // 실행
    }

    // 게시판에 글을 추가하는 함수
    function add_content(
        string memory _title,
        string memory _content,
        address _writer,
        string memory _image,
        string memory _create_dt
    ) public onlyOwner increament {
        // mapping 데이터에 값들을 추가 
        contents[content_no].title = _title;
        contents[content_no].content = _content;
        contents[content_no].writer = _writer;
        contents[content_no].image = _image;
        contents[content_no].create_dt = _create_dt;
    }

    // 글의 번호를 출력하는 함수
    function view_content_no() public view returns(uint) {
        return (content_no);
    }

    // 구조체를 리턴하는 함수 생성
    function view_content(uint _no)
        public view returns(
            string memory, string memory, address, string memory, string memory
        ){
            // 변수 담기
            string memory title = contents[_no].title;
            string memory content = contents[_no].content;
            address writer = contents[_no].writer;
            string memory image = contents[_no].image;
            string memory create_dt = contents[_no].create_dt;

            return (title, content, writer, image, create_dt); // 리턴값 형태는 JSON
        }
}