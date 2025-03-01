"use strict"

// TODO: Crear las funciones, objetos y variables indicadas en el enunciado

// TODO: Variable global
var presupuesto = 0;
var gastos = [];
var idGasto = 0;

function actualizarPresupuesto(nuevoPresupuesto) {
    let nuevoValor;

    if (nuevoPresupuesto >= 0) {
        presupuesto = nuevoPresupuesto;
        nuevoValor = presupuesto;
    } else {
        console.log("Error. Valor introducido no valido.");
        nuevoValor = -1;
    }
    return nuevoValor;
}

function mostrarPresupuesto() {
    return(`Tu presupuesto actual es de ${presupuesto} €`);
}

//Función constructora
function CrearGasto(descripcion, valor = 0, fecha = Date.now(), ...etiquetas) {
    valor = parseFloat(valor);
    
    if (isNaN(valor) || valor < 0) {
        valor = 0;
    }

	
    this.valor = valor
    this.descripcion = descripcion
    this.etiquetas = [...etiquetas]
    this.fecha = (typeof fecha === 'string') ? Date.parse(fecha) : fecha

    this.mostrarGasto = function() 
    {
        return(`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`);
    }

    this.actualizarDescripcion =function (actdescrip)
    {
        this.descripcion=actdescrip;
    }

    this.actualizarValor = function(d1) 
    {
        if (d1 >= 0) 
        {
            this.valor = d1;
        }
    }

    this.mostrarGastoCompleto = function() 
    {
        let fecha1;
        if(typeof this.fecha === 'string')
        {
            fecha1 = Date.parse(this.fecha);
        }
        else
        {
            fecha1 = this.fecha;
        }
        let aux = "";
        for(let etiqueta of this.etiquetas) 
        {
            aux = aux + `- ${etiqueta}\n`;
        };

        let date2 = new Date(fecha1);

        let texto = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${(date2.toLocaleString())}\nEtiquetas:\n`;
        return texto + aux;
    }

    this.actualizarFecha=function(fecha_string)
    {
		let fecha_ok=Date.parse(fecha_string);
		if ( !isNaN(fecha_ok) )
        {
			this.fecha=fecha_ok;
        }
	}

    this.anyadirEtiquetas = function(...etiquetas) 
    {
        const valoresUnicos = etiquetas.filter((x) => {
            if (!this.etiquetas.includes(x)) 
            {
                return x;
            }
        });
        this.etiquetas.push(...valoresUnicos);
    }

    this.borrarEtiquetas = function(...etiquetas) 
    {
        etiquetas.forEach((x) => {
            for (let i = 0; i < this.etiquetas.length; i++) {
                if (this.etiquetas[i] === x) 
                {
                    this.etiquetas.splice(i, 1);
                }
            }
        })
    }

    this.obtenerPeriodoAgrupacion = function(periodo) 
    {
        let validarFecha = new Date(this.fecha);
        switch(periodo) 
        {
            case "dia": { 
                if (validarFecha.getDate() < 10) 
                {
                    if (validarFecha.getMonth() < 9) 
                    {
                        return `${validarFecha.getFullYear()}-0${validarFecha.getMonth()+1}-0${validarFecha.getDate()}`;
                    }
                    else 
                    {
                        return `${validarFecha.getFullYear()}-${validarFecha.getMonth()+1}-0${validarFecha.getDate()}`;
                    }
                }
                else 
                {
                    if (validarFecha.getMonth() < 9) 
                    {
                        return `${validarFecha.getFullYear()}-0${validarFecha.getMonth()+1}-${validarFecha.getDate()}`;    
                    }
                    else 
                    {
                        return `${validarFecha.getFullYear()}-${validarFecha.getMonth()+1}-${validarFecha.getDate()}`;
                    }
                }
                break;
            }
            case "mes": {
                if(validarFecha.getMonth() < 9) 
                {
                    return `${validarFecha.getFullYear()}-0${validarFecha.getMonth()+1}`;
                }
                else 
                {
                    return `${validarFecha.getFullYear()}-${validarFecha.getMonth()+1}`;
                }
                break;
            }
            case "anyo": {
                return `${validarFecha.getFullYear()}`
                break;
            }
            default:{
                return `Periodo no válido`;
            }
        }
    }
}

function listarGastos() 
{
    return gastos;
}

function anyadirGasto(gasto) 
{
    gasto.id = idGasto;
    idGasto++;
    gastos.push(gasto);
}

function borrarGasto(id) 
{
    let ind = gastos.findIndex(gasto => gasto.id == id);
    if(ind !== -1)
    {
        gastos.splice(ind, 1);
    }

}

function calcularTotalGastos() 
{
    let totalgas = 0;
    gastos.forEach((x) => {
        totalgas = totalgas + x.valor;
    })
    return totalgas;
}

function calcularBalance() {
    return presupuesto - calcularTotalGastos();
}

function filtrarGastos({fechaDesde, fechaHasta, valorMinimo, valorMaximo, descripcionContiene, etiquetasTiene}){
    let gFiltrados;
    gFiltrados = gastos.filter(function(gasto)
    {
     let exist = true;
     if(fechaDesde)
     {
         if(gasto.fecha < Date.parse(fechaDesde)) exist = false;
     }
     if(fechaHasta)
     {
         if(gasto.fecha > Date.parse(fechaHasta)) exist = false;
     }
     if(valorMinimo)
     {
         if(gasto.valor < valorMinimo) exist = false;
     }
     if(valorMaximo)
     {
         if(gasto.valor > valorMaximo) exist = false;
     }
     if(descripcionContiene)
     {
             if(!gasto.descripcion.includes(descripcionContiene)) exist = false;
     }
     if(etiquetasTiene)
     {
         let inside = false;                   
             for (let i = 0; i < gasto.etiquetas.length; i++) 
             {                   
                 for (let j= 0; j < etiquetasTiene.length; j++) 
                 {
                     if(gasto.etiquetas[i] == etiquetasTiene[j]) inside = true;                  
                 }
             }
        if(inside == false) exist = false;
     }
         return exist;
    });
return gFiltrados;  
}


function agruparGastos(periodo = "mes", etiquetas, fechaDesde, fechaHasta) 
{
    let funfil = {etiquetasTiene : etiquetas, fechaDesde : fechaDesde, fechaHasta : fechaHasta}
    let rtnFiltrarGastos = filtrarGastos(funfil);
    let agrupar =
            rtnFiltrarGastos.reduce((acc, item) => {
                let periRed = item.obtenerPeriodoAgrupacion(periodo);
                if (acc[periRed] == null)
                    acc[periRed] = item.valor;
                else 
                    acc[periRed] += item.valor;
                return acc;
            }, {});
    return agrupar;
}

function transformarListadoEtiquetas(input) 
{
    let etiquetas = input.match(/[a-z0-9]+/gi);
    return etiquetas;
}

function cargarGastos(gastosAR) 
{
    gastos = [];

    for (let gas of gastosAR) 
    {
        let gastoR = new CrearGasto();
        Object.assign(gastoR, gas);

        gastos.push(gastoR)
    }
}


// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos,
    transformarListadoEtiquetas,
    cargarGastos
}
