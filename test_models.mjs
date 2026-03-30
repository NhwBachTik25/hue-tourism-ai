import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf8');
const match = envFile.match(/GOOGLE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

async function run() {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const data = await response.json();
    console.log(data.models.map(m => m.name).join(', '));
}
run();
