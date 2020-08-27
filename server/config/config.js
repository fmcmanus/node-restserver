// ==============================
// Puerto
// ==============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
// Entormo
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ==============================
// Base de datos
// ==============================
let UrlDB;

if (process.env.NODE_ENV === 'dev') {
    UrlDB = 'mongodb://localhost:27017/cafe';
} else {
    UrlDB = 'mongodb+srv://piri:GivnhJyI4aVNXPhZ@cluster0.zhkzl.mongodb.net/cafe';
}
process.env.URLDB = UrlDB;