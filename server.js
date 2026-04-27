const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', 'layout');

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/privacy', (req, res) => res.render('privacy', { title: 'Privacy Policy' }));
app.get('/dmca', (req, res) => res.render('dmca', { title: 'DMCA Notice' }));
app.get('/dnc', (req, res) => res.render('dnc', { title: 'Do Not Call Policy' }));
app.get('/terms', (req, res) => res.render('terms', { title: 'Terms of Service' }));

app.post('/contact', (req, res) => {
    const { name, email, phone, service, message } = req.body;
    const sql = `INSERT INTO leads (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [name, email, phone, service, message], function(err) {
        if (err) {
            console.error('Error saving lead:', err.message);
            return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
        }
        res.json({ success: true, message: 'Thank you! We will get back to you shortly.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
