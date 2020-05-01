const http = require('http')
const PORT = process.env.PORT || 3000
const fs = require('fs')

const server = http.createServer(
    (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./index.html', function (err, data) {
                if (err) {
                    console.error(err, null)
                } else {
                    res.writeHead(200, {'content-type': 'text/html'})
                    res.write(data, null)
                    res.end()
                }
            })
    }}
)

server.listen(PORT, () => console.log(`listening at port ${PORT}`))