import createApp from "./app";

const app = createApp();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`🔥 server is running on http://localhost:${port}`);
});