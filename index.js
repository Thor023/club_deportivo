const fs = require('fs');
const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;

app.listen(port,  ()=>{
    console.log(`El servidor esta en el puerto ${port}`);
});

app.get("/", (req, res)=>{
    res.setHeader('content-type', 'text/html');
    fs.readFile('index.html', 'utf8', (error, data)=>{
        res.end(data);
    });
});

app.get("/deportes", (req, res)=>{
    fs.readFile('deportes.json', 'utf8', (error, data)=>{
        res.end(data);
    });
});
app.use('/agregar', express.json());

app.post("/agregar", (req, res)=>{
    console.log("info");
    console.log(req.body);
    const {nombre,precio} = req.body;
    console.log(nombre,precio);

    fs.readFile('deportes.json', 'utf8', (err, data)=>{
        const deportes = JSON.parse(data).deportes;

        deportes.push({
            nombre,
            precio
        });
        fs.writeFile('deportes.json', JSON.stringify({deportes}), (err,data)=>{
            err ? console.log('Error!!!'): console.log("Correcto!");
            res.end("Deporte Agregado con exito");
        })
    });
});

app.use('/editar', express.json());
app.put('/editar', (req, res)=>{
    const {nombre, precio} = req.body;

    fs.readFile('deportes.json', 'utf8', (err, data)=>{
        let deportes = JSON.parse(data).deportes;
        deportes = deportes.map((dep)=>{
            if(dep.nombre == nombre){
                dep.precio = precio;
                return dep;
            }
            return dep;
        });

        fs.writeFile('deportes.json', JSON.stringify({deportes}), (err,data)=>{
            err ? console.log("error") : console.log("Correcto");
            res.end("Deporte editado con exito")
        })
    })
});
app.delete('/eliminar', (req, res)=>{
    const {nombre} = req.query;
    fs.readFile('deportes.json', 'utf8', (err, data)=>{
        let deportes = JSON.parse(data).deportes;
        deportes = deportes.filter((dept)=> dept.nombre !== nombre );
    
        fs.writeFile('deportes.json', JSON.stringify({deportes}), (err,data)=>{
            err ? console.log("error") : console.log("Correcto");
            res.end("Deporte eliminado con exito")
        })
})
});
