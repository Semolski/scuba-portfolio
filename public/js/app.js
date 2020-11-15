const http = require('http');//http library for node.js server
const fs = require('fs');
const port = 8080;

const server = http.createServer(function (req, res) { // reques and response parameters
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('index.html', function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Error: File Not Found')
        } else {
            res.write(data)
        }
        res.end();
    });
}); // creates the server and uses the http library

//set up server so it will listen to the port we want it to
server.listen(port, function (error) {
    if (error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server is listening on port' + port)
    }
});
