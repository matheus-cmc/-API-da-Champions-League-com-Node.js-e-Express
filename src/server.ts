import express,{Request, Response} from "express";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
   res.status(200).json({player: "beckham"})
})

app.listen(port, () => {
   console.log(`🔥server is running on port http://localhost:${port}` )
});