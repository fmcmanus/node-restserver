// ==============================
// Puerto
// ==============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
// Entormo
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============================
// Vencimiento del token
// ==============================
// 60 segs
// 60 mins
// 24 hrs
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ==============================
// Seed de autenticación
// ==============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// ==============================
// Base de datos
// ==============================
let UrlDB;

if (process.env.NODE_ENV === 'dev') {
    UrlDB = 'mongodb://localhost:27017/cafe';
} else {
    UrlDB = process.env.MONGO_URI;
}
process.env.URLDB = UrlDB;