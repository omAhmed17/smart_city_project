const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./Routs/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        system: 'Smart City OS — Auth & Profile Subsystem',
        timestamp: new Date().toISOString(),
        endpoints: {
            'Register Account': 'POST /api/auth/register',
            'Login': 'POST /api/auth/login',
            'Logout': 'POST /api/auth/logout',
            'Reset Password (Request)': 'POST /api/auth/forgot-password',
            'Reset Password (Confirm)': 'POST /api/auth/reset-password',
            'View Profile': 'GET /api/auth/profile',
            'Edit Profile': 'PUT /api/auth/profile'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

app.listen(PORT, () => {
    console.log(` http://localhost:${PORT}`);
});

module.exports = app;
