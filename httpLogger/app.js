const fs = require("fs"), cors = require("cors"), express = require('express'), bodyParser = require('body-parser');
const options = {
    key: fs.readFileSync("ssl/localhost.key"),
      cert: fs.readFileSync("ssl/localhost.crt"),
    requestCert: false
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const server = require('https').createServer(options, app);
// var io = require('socket.io').listen(server);
server.listen(3000, "0.0.0.0");

app.get('/', (req, res) => {
  res.send("Error log");
})
 
app.post('/', (req, res) => {
  console.log(req.body)
  res.send(req.body);
});