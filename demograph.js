const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(cors());        // Enable CORS for all routes
app.use(express.json()); // Parse JSON request body

const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dtlsfmrd89',
    database: 'sys'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database.');
});

app.get('/popdemo', (req, res) => {
    const desiredCountries = ['China', 'India', 'USA', 'Russia', 'Japan', 'Indonesia', 'Germany', 'Brazil', 'UK', 'Italy', 'France', 'Bangladesh'];
    const countryColorMap = {
        'China': 'rgba(255, 99, 132, 0.2)',
        'India': 'rgba(54, 162, 235, 0.2)',
        'USA': 'rgba(255, 206, 86, 0.2)',
        'Russia': 'rgba(75, 192, 192, 0.2)',
        'Japan': 'rgba(153, 102, 255, 0.2)',
        'Indonesia': 'rgba(255, 159, 64, 0.2)',
        'Germany': 'rgba(255, 99, 255, 0.2)',
        'Brazil': 'rgba(54, 255, 235, 0.2)',
        'UK': 'rgba(255, 255, 86, 0.2)',
        'Italy': 'rgba(75, 255, 192, 0.2)',
        'France': 'rgba(153, 255, 255, 0.2)',
        'Bangladesh': 'rgba(255, 255, 64, 0.2)'
    };

    let query = 'SELECT * FROM popdemo WHERE CountryName IN (?)';
    const queryParams = [desiredCountries];

    // Check if a year parameter is provided in the request
    if (req.query.year) {
        query += ' AND Year = ?';
        queryParams.push(req.query.year);
    }

    // Add sorting by population in descending order
    query += ' ORDER BY Population DESC';

    db.query(query, queryParams, (err, results) => {
        if (err) throw err;

        // Add color data to the results programmatically
        results.forEach(result => {
            result.backgroundColor = countryColorMap[result.CountryName];
            result.borderColor = result.backgroundColor.replace('0.2', '1'); // Adjust the opacity for the border color
        });

        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


