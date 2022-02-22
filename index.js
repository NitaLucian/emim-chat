const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('luci dev.... server is Running AGAIN');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);
	console.log("o noua conexiune la server, am trimis socketId = " +socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
		console.log("serverul a emis callEnded pentru ID-ul " + socket.Id);
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
		console.log("callUser socketId = " + socket.Id + " , userToCall= " + userToCall);
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal);
		console.log("am acceptat call-ul, my socketId = " + socket.id + " , trimit callAccepted catre " + data.to);
	});
});

server.listen(PORT, () => console.log(`Luci --- Server is running on port ${PORT}`));
