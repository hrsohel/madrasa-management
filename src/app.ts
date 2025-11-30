import Server from "./Server";

const server = new Server()

server.startServer()
server.startMongoDB()

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.stop();
  process.exit(0);
});