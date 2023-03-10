import express, { response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World!'
    })
});

const MAX_CONTEXT_QUESTIONS = 10;
let history = [];

app.post('/', async (req, res) => {
    try{
        const { prompt } = req.body;

        if (history.length >= MAX_CONTEXT_QUESTIONS) {
            history.shift();
        }
        history.push(prompt);
        
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${history.join("\n")}\n`,
            temperature: 1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.6,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})




app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))