import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../src/assets/css/App.css";

function App() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    genero: "",
    fechaNacimiento: "",
    estado: "",
  });
  const [curp, setCurp] = useState("");

  const [isValidateCaptcha, setIsValidateCaptcha] = useState("");
  const recaptcha = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar que no se ingresen números en los campos de nombre y apellidos
    if (
      name === "nombre" ||
      name === "apellidoPaterno" ||
      name === "apellidoMaterno"
    ) {
      if (!/^[a-zA-ZñÑ\s]*$/.test(value)) {
        return; // Si se ingresan caracteres no permitidos, no se actualiza el estado
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onChangeCaptcha = () => {
    setIsValidateCaptcha(recaptcha.current.getValue())
    console.log(recaptcha.current.getValue())
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/generar_curp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recaptchaValue: isValidateCaptcha, // Incluir el valor del captcha en el formData
        }),
      });
      const data = await response.json();
      setCurp(data.curp);
    } catch (error) {
      console.error("Error al generar CURP:", error);
    }
  };

  return (
    <>
      {/* Mostrar CURP si está disponible */}
      {curp && (
        <div className="max-w-xl w-full mx-auto p-4 justify-items-center mt-4 bg-purple-100 rounded-lg shadow-lg">
          <div className="bg-purple-200 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <p className="text-lg font-medium text-purple-800">Tu CURP es: {curp}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-xl w-full mx-auto justify-items-center mt-4">
        <div className="bg-purple-100 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-purple-800">
              ¡Ingresa tus datos para generar tu CURP!
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <label
              htmlFor="nombre"
              className="block text-lg font-semibold leading-6 text-black-900"
            >
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="rounded-md border-2 border-black-300 py-2 px-4 text-black-900 placeholder-black-400 focus:outline-none focus:border-purple-300 sm:text-lg sm:leading-6 w-11/12"
            />

            {/* Apellido Paterno */}
            <label
              htmlFor="apellidoPaterno"
              className="block text-lg font-semibold leading-6 text-gray-900 mt-2"
            >
              Primer Apellido:
            </label>
            <input
              type="text"
              id="apellidoPaterno"
              name="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={handleChange}
              className="rounded-md border-2 border-black-300 py-2 px-4 text-black-900 placeholder-black-400 focus:outline-none focus:border-purple-300 sm:text-lg sm:leading-6 w-11/12"
            />

            {/* Apellido Materno */}
            <label
              htmlFor="apellidoMaterno"
              className="block text-lg font-semibold leading-6 text-gray-900 mt-2"
            >
              Segundo Apellido:
            </label>
            <input
              type="text"
              id="apellidoMaterno"
              name="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={handleChange}
              className="rounded-md border-2 border-black-300 py-2 px-4 text-black-900 placeholder-black-400 focus:outline-none focus:border-purple-300 sm:text-lg sm:leading-6 w-11/12"
            />

            {/* Fecha de Nacimiento */}
            <label
              htmlFor="fechaNacimiento"
              className="block text-lg font-semibold leading-6 text-gray-900 mt-2"
            >
              Fecha de Nacimiento:
            </label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="rounded-md border-2 border-black-300 py-2 px-4 text-black-900 placeholder-black-400 focus:outline-none focus:border-purple-300 sm:text-lg sm:leading-6 w-11/12"
            />

            {/* Género */}
            <label
              htmlFor="genero"
              className="block text-lg font-semibold leading-6 text-gray-900 mt-2"
            >
              Sexo:
            </label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="rounded-md border-2 border-black-300 py-2 px-4 text-black-900 placeholder-black-400 focus:outline-none focus:border-purple-300 sm:text-lg sm:leading-6 w-11/12"
            >
              <option value="">Selecciona un sexo</option>
              <option value="H">Masculino</option>
              <option value="M">Femenino</option>
            </select>

            {/* Estado de Nacimiento */}
            <label
              htmlFor="estado"
              className="block text-lg font-semibold leading-6 text-gray-900 mt-2"
            >
              Entidad de Nacimiento:
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="rounded-md border-2 border-black-300 py-2 px-4 text-black-900 placeholder-black-400 focus:outline-none focus:border-purple-300 sm:text-lg sm:leading-6 w-11/12"
            >
              <option value="">Selecciona un estado</option>
              <option value="C">Chiapas</option>
            </select>

            <div className="container-captcha mt-4">
              <ReCAPTCHA ref={recaptcha} sitekey="6Lepr7IpAAAAADflVMgvGqdsfMu0qPGkFUvcuq7z" onChange={onChangeCaptcha} />
            </div>
            {/* Botón de generación de CURP */}
            <button
              type="submit"
              className="mt-6 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
              Generar CURP
            </button>
            <br /><br />
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
