// (async () => {
//   const res = await fetch('http://localhost:5157/games', {
//     method: 'POST',
//   });
//   const gameId = await res.json();
//   console.log(gameId);

//   const socket = new WebSocket(`ws://localhost:5157/games/${gameId}/join?name=Tim`);
//   socket.addEventListener("message", (event) => {
//     console.log("Message from server ", event.data);
//   });
//   socket.addEventListener("open", (event) => {
//     socket.send("ping");
//   });
// })();