const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');

const objBusqueda ={
    moneda: '',
    criptomoneda: ''

}

const obtenerCriptomonedas = criptomonedas =>new Promise(resolve=>{
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', ()=>{

    consultarCriptomoneda();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedaSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor)


})

function consultarCriptomoneda(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(resultado =>resultado.json())
        .then(data => obtenerCriptomonedas(data.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))

}

function selectCriptomonedas(criptomonedas){


    criptomonedas.forEach(cripto => {
        const {FullName, Name}= cripto.CoinInfo;

        const option = document.createElement('option');
        option.value= Name;
        option.textContent= FullName;

        criptomonedaSelect.appendChild(option)

    });
}

function leerValor(e){
    objBusqueda[e.target.name]= e.target.value;
    // console.log(objBusqueda)

}


function submitFormulario(e){
    e.preventDefault();
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === ''|| criptomoneda ===''){
        mostrarAlerta('Dami: ambos campos son obligatorios')
        return;
    }
    consultarAPI();
}

function mostrarAlerta(mensaje){
    const existeMensaje = document.querySelector('.error')

    if(!existeMensaje){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        divMensaje.textContent=mensaje;
        formulario.appendChild(divMensaje)
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    
    }

}

function consultarAPI(){

    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
        .then(resultado => resultado.json())
        .then(data=> {
            
            mostrarCotizacionHTML(data.DISPLAY[criptomoneda][moneda])
        })
}


function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML= `La cotización es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML= `<p>La cotización mas alta del día fue: ${HIGHDAY}</p>`

    const precioBajo = document.createElement('p')
    precioBajo.innerHTML=`<p>La cotización mas baja del día fue:${LOWDAY}</p>`

    const variacion = document.createElement('p')
    variacion.innerHTML=`<p> La variación ultimas 24hs: ${CHANGEPCT24HOUR}%</p>`

    const actualizacion = document.createElement('p')
    actualizacion.innerHTML =`<P> Actualización: <span>${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(variacion)
    resultado.appendChild(actualizacion);


}

function limpiarHTML(){

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}
