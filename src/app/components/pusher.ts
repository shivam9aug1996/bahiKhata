import Pusher from "pusher-js";

const pusher = new Pusher("a7a14b0a75a3d073c905", {
  cluster: "ap2",
});

Pusher.logToConsole;

export default pusher;
