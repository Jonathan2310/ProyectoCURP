const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const curp = require('curp');
const { verifyRecaptcha } = require('./utils/verifyReCaptchaUtils');

const app = express();
const port = 3000;

// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());

// Middleware para habilitar CORS
app.use(cors());

// Ruta para generar la CURP
app.post('/generar_curp', async (req, res) => {
    try {
        const { recaptchaValue } = req.body;
        console.log("Se obtuvo el valor de captcha:" + recaptchaValue)

        const persona = curp.getPersona();
        persona.nombre = req.body.nombre || 'Nombre';
        persona.apellidoPaterno = req.body.apellidoPaterno || 'ApellidoPaterno';
        persona.apellidoMaterno = req.body.apellidoMaterno || 'ApellidoMaterno';
        persona.genero = req.body.genero || curp.GENERO.MASCULINO;
        // Ajustar el formato de la fecha
        const fechaNacimiento = req.body.fechaNacimiento ? req.body.fechaNacimiento.split('-').reverse().join('-') : '2000-01-01';
        const fechaNacimientoObj = new Date(fechaNacimiento);
        // Validar que el año no sea anterior a 2000
        if (fechaNacimientoObj.getFullYear() < 2000) {
            throw new Error('La fecha de nacimiento debe ser posterior a 2000');
        }
        persona.fechaNacimiento = fechaNacimiento;
        persona.estado = req.body.estado || curp.ESTADO.DISTRITO_FEDERAL;

        const isValidateCaptcha = await verifyRecaptcha(recaptchaValue);
        if (!isValidateCaptcha) {
          return res.status(400).json({ error: 'Completa el capchat' });
        }

        const curpGenerada = curp.generar(persona);
        res.json({ curp: curpGenerada });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
