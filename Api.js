const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();


app.use(bodyParser.json());
app.use(express.static("images"));


app.get("/", function (req, res) {
    res.sendFile(__dirname+"/index.html")
    console.log('hw');
})

app.post("/compile", function (req, res) {
    const code = req.body.code;
    const customInput = req.body.input;
    const langId = req.body.lang;
 console.log('compiling');
    try {
      
        const formData = {
            language_id: langId,
            source_code: Buffer.from(code).toString("base64"),
            stdin: Buffer.from(customInput).toString("base64"),
        };

        const options = {
            method: "POST",
            url: `https://judge0-ce.p.rapidapi.com/submissions`,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "content-type": "application/json",
                "Content-Type": "application/json",
                'X-RapidAPI-Key': process.env.key,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: formData,
        };
        // console.log(formData)

        axios
            .request(options)
            .then(function (response) {
                const token = response.data.token;
                // console.log(token);
                checkStatus(token, res);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});



const checkStatus = async (token, res) => {
    const options = {
        method: "GET",
        url: "https://judge0-ce.p.rapidapi.com/submissions/" + token,
        params: { base64_encoded: "true", fields: "*" },
        headers: {
            'X-RapidAPI-Key': process.env.key,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
    };
    try {
        let response = await axios.request(options);
        let statusId = response.data.status?.id;

        // Processed - we have a result
        if (statusId === 1 || statusId === 2) {
            // still processing
            setTimeout(() => {
                checkStatus(token, res);
            }, 2000);
            return;
        }

        if (statusId >= 5) {
            const decodedData = response.data.status?.description;;
            res.send(decodedData);
            return decodedData;
        }
        
        else {
            const decodedData = atob(response.data.stdout);
            // console.log(decodedData);
            // console.log(response.status[1]);
            res.send(decodedData);
            return decodedData;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Server is running on port 8000");
});
