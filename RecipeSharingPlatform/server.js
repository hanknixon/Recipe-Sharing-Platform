const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Dish = require('./models/Dish');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ejs = require('ejs');
const fs = require('fs');
dotenv.config();


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['POST', 'GET', 'OPTIONS','PUT'],
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'LoginPage.html'));
});

const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL || 'mongodb://localhost:27017/Cook4UsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Failed to connect to MongoDB', err));

console.log(process.env); 


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            console.log('Login attempt failed: User not found', email);
            return res.status(400).json({ error: 'User not found' });
        }

        console.log('Received password:', password);
        console.log('Stored hashed password:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('Login attempt failed: Invalid password', email);
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        console.log('Login successful', email);

        const userId = user._id;

        res.json({ message: 'Login successful!', userId: user._id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            name: user.name,
            birthdate: user.birthdate,
            gender: user.gender,
            email: user.email
        });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/register', async (req, res) => {
    try {
        const { name, birthdate, gender, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            birthdate,
            gender,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            res.json({ message: 'User with this email already exists' });
        } else {
            res.status(500).json({ error: 'Error registering user' });
        }
    }
});

app.post('/logout', (req, res) => {
    console.log('Logout endpoint called');
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).json({ error: 'Error during logout' });
            }
            console.log('Session destroyed');
            res.json({ message: 'Logged out successfully' });
        });
    } else {
        console.log('No active session');
        res.json({ message: 'No active session' });
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        let { name, birthdate, gender, email, password } = req.body;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                birthdate: new Date(birthdate),
                gender,
                email,
                password
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

app.post('/add-dish', async (req, res) => {
    try {
        const { userId, title, image, description, ingredients, instructions, prepTime, extras, specialNote } = req.body;


        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        const instructionsArray = instructions.split('\n').map(step => step.trim());


        const ingredientsArray = Array.isArray(ingredients) ? ingredients : ingredients.toString().split(',');


        const newDish = new Dish({
            title,
            userId,
            image,
            description,
            ingredients: ingredientsArray, 
            instructions: instructionsArray,
            prepTime: Number(prepTime),
            extras: extras.split(','),
            specialNote
        });

        await newDish.save();
        res.redirect(`/dish/${newDish._id}`);
    } catch (error) {
        console.error('Error adding dish:', error);
        res.status(500).json({ error: 'Failed to add dish' });
    }
});


app.get("/dish/:id/generate", (req, res) => {
    Dish.findById(req.params.id)
        .then(dish => {
            if (!dish) {
                return res.status(404).send('Dish not found');
            }

            ejs.renderFile(path.join(__dirname, 'views', 'dish.ejs'), { dish }, (err, html) => {
                if (err) {
                    console.error('Error rendering EJS:', err);
                    return res.status(500).send('Error rendering page');
                }

                const filePath = path.join(__dirname, 'generated_pages', `${dish._id}.html`);

                fs.writeFileSync(filePath, html);

                res.download(filePath, `${dish._id}.html`, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).send('Error downloading file');
                    } else {
                        fs.unlinkSync(filePath);
                    }
                });
            });
        })
        .catch(err => {
            console.error('Error fetching dish:', err);
            res.status(500).send('Error fetching dish');
        });
});

app.get('/user/:id/dishes', async (req, res) => {
    try {
        const userId = req.params.id;
        const dishes = await Dish.find({ userId });

        if (!dishes) {
            return res.status(404).json({ error: 'No dishes found for this user' });
        }

        res.json(dishes);
    } catch (error) {
        console.error('Error fetching dishes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'LoginPage.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HomePage.html'));
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

console.log('Environment variables:', process.env);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});