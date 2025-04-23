// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files (HTML, CSS, JS) from the project root
app.use(express.static('.'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookportal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Contact schema
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 2, maxlength: 12, match: /^[a-zA-Z]+$/ },
    lastName: { type: String, required: true, minlength: 2, maxlength: 12, match: /^[a-zA-Z]+$/ },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
    dob: { type: Date, required: true },
    email: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    language: { type: String, enum: ['Arabic', 'English', 'French'], required: true },
    message: { type: String, required: true, maxlength: 500 }
});
const Contact = mongoose.model('Contact', contactSchema);

// Handle form submission
app.post('/submit-contact', [
    body('Fname').isString().isLength({ min: 2, max: 12 }).matches(/^[a-zA-Z]+$/).trim().customSanitizer(val => sanitizeHtml(val)),
    body('Lname').isString().isLength({ min: 2, max: 12 }).matches(/^[a-zA-Z]+$/).trim().customSanitizer(val => sanitizeHtml(val)),
    body('gender').isIn(['Male', 'Female']).notEmpty(),
    body('mobile').matches(/^[0-9]{10}$/).trim().customSanitizer(val => sanitizeHtml(val)),
    body('DB').isDate().custom((value) => new Date(value) < new Date()),
    body('email').isEmail().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).normalizeEmail().customSanitizer(val => sanitizeHtml(val)),
    body('language').isIn(['Arabic', 'English', 'French']).notEmpty(),
    body('message').isLength({ min: 1, max: 500 }).trim().customSanitizer(val => sanitizeHtml(val))
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const sanitizedData = {
            firstName: req.body.Fname,
            lastName: req.body.Lname,
            gender: req.body.gender,
            mobile: req.body.mobile,
            dob: req.body.DB,
            email: req.body.email,
            language: req.body.language,
            message: req.body.message
        };
        await Contact.create(sanitizedData);
        res.status(200).json({ message: 'Submission successful' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Retrieve all contacts
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));