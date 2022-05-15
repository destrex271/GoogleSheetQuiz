require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Question = require('./models/questionSchema')
let idSheet;

mongoose.connect("mongodb://localhost:27017/quizData",(err)=>{
    if(err){console.log(err);return;}
    console.log("Connected to db!")
})

let data = []
let newData = []

const app = express()

const fs = require('fs')
const readline = require('readline')
const {google} = require('googleapis')
const axios = require('axios').default

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_PATH = 'token.json';

const getData = () => {fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), getQuizData);
})};

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
        });
    });
}

function getQuizData(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
        spreadsheetId: '1jWAJYe2yBwLBCz2kWSSnEVmVqq-dCd1ZvYPXMqn7UG8',
        range: 'Sheet1!A:G',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        newData = rows
        // axios.post('http://localhost:5000/save',{
        // data: rows
        // }).then((dt)=>console.log("OK!"))
        // .catch((err)=>console.log(err))
    });
}

function checkData(){
    console.log("IN")
    getData()
    if(JSON.stringify(data) != JSON.stringify(newData)){
        prev = data
        data = newData
        axios.post('http://localhost:5000/save',{
        data: data
        }).then((dt)=>console.log("OK!"))
        .catch((err)=>console.log(err))
    }
}

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(process.env.PORT || 5000, () => {
    console.log("Connected!")
    setInterval(function(){
        checkData()
    },10000)
})

app.get('/',(req,res)=>{
    console.log(res)
})

app.get('/quiz',(req, res)=>{
    Question.find({},(err,data)=>{
        if(err){console.log(err);return;}
        res.send(data)
    })
})

app.post('/save',(req,res)=>{
    Question.deleteMany({}, (err)=>console.log(Question.length))
    console.log("data",data)
    data.slice(1,).forEach((item)=>{
        const question = new Question({
            question:item[1],
            options:[
                item[2],
                item[3],
                item[4],
                item[5]
            ],
            correctOption:item[6]
        })
        question.save()
    })
    res.send("OK!")
})
