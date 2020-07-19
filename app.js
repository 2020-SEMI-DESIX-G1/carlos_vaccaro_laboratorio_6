const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;
 
var estudiante = [
    {
        nombrelegal: "Oscar Ramirez",
        cedula: "8-345-347"
    },
    {
        nombrelegal: "Dania Fuentes",
        cedula: "9-56-78"
    },
    {
        nombrelegal: "Ricardo Robles",
        cedula: "4-576-777"
    },
    {
        nombrelegal: "Carmen Rodriguez",
        cedula: "7-45-17"
    },
    {
        nombrelegal: "Rosa Perez",
        cedula: "6-78-98"
    }
 
];
//Intermediario
app.use(bodyParser.json());
 

 
// GET LISTA DE ESTUDIANTES
app.get('/estudiante/', (req,res) => {
    res.json(estudiante);
});
 
// POST CREA NUEVO
app.post('/estudiante/', (req,res) => {
        estudiante.push(req.body);
        res.json(req.body);
});
 
// GET ESUDIANTE POR ID
app.get('/estudiante/:id', (req,res) => {
    res.json(
        estudiante[req.params.id]
    );
});
 
// PUT ACTUALIZA
app.put('/estudiante/:id', (req,res) => {
   estudiante[req.params.id].nombre = req.body.nombre;
   estudiante[req.params.id].edad = req.body.edad;
   res.send("Se actualizo estudiante");
});
 
// DELETE ELIMINA UN ESTUDIANTE
app.delete('/estudiante/:id', (req,res) => {
    estudiante.splice(req.params.id,1);
    res.send("Estudiante eliminado");
 });
 
app.listen(port, () => {
console.log(`Ejecutando en el puerto:${port}`)
});
