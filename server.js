'use strict';

import http from 'http'
import express from 'express';
import  cors from "cors";



const app = express();
const server = http.createServer(app)
const port=process.env.PORT||5000;
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true }));


import {router as router1} from './router/post.js'
import {router as router2}  from './router/get.js'


app.use("/",router1);
app.use("/",router2);

server.listen(port ,()=>console.log(`server started.... ${port}`))

/*
Error:
 reject(new Errors_js_1.TimeoutError(`Timed out after ${timeout} ms while trying to connect 
 to the browser! Only Chrome at revision r${preferredRevision} is guaranteed to work.`));

https://github.com/puppeteer/puppeteer/issues/6502

*/