const express = require('express');
const app = express();
const port = 3000;

const redis = require('redis');
const redisClient = redis.createClient(6379, '127.0.0.1');
redisClient.connect();
redisClient.on('connect', () => {
    console.log('Redis Connected');
})

// STRING
app.get('/string', async (req, res) => {
    
    let keyName = "name5";
    try {
        let cacheData = await redisClient.get(keyName);
        if (cacheData) {
            console.log(cacheData);
            cacheData=JSON.parse(cacheData)
        }
        else {
            cacheData = await redisClient.set(keyName, JSON.stringify({ name: "naba", class: "10" }), {EX:10});
            console.log(cacheData);
        }
        res.status(200).json({ data: cacheData }); 
    }
    catch (e) {
        console.log(e);
        res.status(500).json({status: 'failed'})
    }
})

// HASH
app.get('/hash', async (req, res) => {

    let keyName = "name5";
    let field = "lastName"
    try {
        let cacheData = await redisClient.hGet(keyName, field);
        if (cacheData) {
            console.log(cacheData);
        }
        let cacheDataHashKey = await redisClient.hGetAll(keyName);
        if (cacheDataHashKey){
            console.log(cacheDataHashKey);
        }
        else {
            cacheData = await redisClient.hSet(keyName, field, 'Modak');
            console.log(cacheData);
        }
        res.status(200).json({ data: cacheDataHashKey });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ status: 'failed' })
    }
})

// SORTED SET
app.get('/sortedSet', async (req, res) => {

    let keyName = "myset1";
    try {
        let cacheData = await redisClient.zRange(keyName, 0, -1);
        console.log(cacheData);
        res.status(200).json({ data: cacheData }); 
    }
    catch (e) {
        console.log(e);
        res.status(500).json({status: 'failed'})
    }
})

// DELETE KEY
app.get('/del', async (req, res) => {
    let key1 = 'name';
    let key2 = 'name3';
    let result = await redisClient.DEL([key1, key2]);
    console.log(result);
    res.status(200).json(result)
})

app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
})