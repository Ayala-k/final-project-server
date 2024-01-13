const fs = require('fs')
const path = require('path');
const axios = require('axios');


exports.loadData = async () => {
    console.log("in load data");

    let data = await getData()
    const jsonString = JSON.stringify([data])

    const relativeFolderPath = '../data/';
    const filePath = path.join(__dirname, relativeFolderPath, 'professions.json');


    fs.writeFile(filePath, jsonString, err => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            console.log('Successfully wrote file');
        }
    });
}

const getData = async () => {
    try {
        const response = await axios.get('https://sports-api-4vv3.onrender.com/data');
        console.log('Data:', response.data);
        return response.data
    } catch (error) {
        console.error('Error:', error.message);
    }
}