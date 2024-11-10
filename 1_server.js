// import http from 'http';
const http = require('http');
const url = require('url');

// localhost -> 127.0.0.1 -> loop back - > 서버를 실행한 컴퓨터
const host = 'localhost';
const port = 3000;


// req -> request 요청 
// res -> response 응답
const server = http.createServer((req, res) => {
    const path = url.parse(req.url).pathname; // 요청이 보내진 url 추출 , path 도 추출 가능 
    
    if(path === '/') {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end('<h1>Home Page</h1>')
    } else if(path === '/post') {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end('<h1>Post Page</h1>')
    } else if(path=== '/user' ) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end('<h1>Post Page</h1>')
    }

    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end('<h1>Hello World</h1>')
}); 

server.listen(port, host, () => {
    console.log("server running on http://localhost:3000")
});
