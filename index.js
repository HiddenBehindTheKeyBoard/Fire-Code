const fs = require('fs');

const config = require('./config');

let token = null;

let posInicio = 0, posFim = 0;
let posLinha = 0;

let linha;

const comandos = [ 
    "rules_version",
    "function",
    "service",
    "match",
    "return",
    "get",
    "request",
    "resource",
];

const simbolos = [
    '=',
    "'",
    '"',
    ';',
    '.',
    '{',
    '}',
    '/',
    '(',
    ')',
    '[',
    ']',
    ' ',
]

const ignoraveis = [
    ' ',
]

function removerEspacoLinha() {
    
}

function iniciaToken(linhaDeCodigo) {

    const comando = pegarComando(linhaDeCodigo);
    
    if (comando == null) {
        erros(2);
        return;
    }

    token = comando;
    posInicio = 0;
    posFim = token.length;
}


function erros(numeroDoErro) {
    console.log("Erro na linha: ", posLinha + 1);

    switch(numeroDoErro) {
        case 1:
            console.log("Falha ao abrir o arquivo index.rules, verifique o caminho!");
            break;
        case 2:
            console.log("Comando desconhecido!");
            break;
    }
}


function pegarComando(linhaDeCodigo){

    for (let i = 0; i < comandos.length; i++) {
        
        const pedacoDeLinhaDeCodigo = linhaDeCodigo.substr(posFim, comandos[i].length);

        if (pedacoDeLinhaDeCodigo == comandos[i]) {
            return comandos[i]
        }

    }

    return null;
}

function pegarSimbolo(linhaDeCodigo) {

    for (let i = 0; i < simbolos.length; i++) {
        
        const pedacoDeLinhaDeCodigo = linhaDeCodigo.substr(posFim, 1);

        if (pedacoDeLinhaDeCodigo == simbolos[i]) {
            return simbolos[i];
        }
    }

    return null;
}

function pegarToken(linhaDeCodigo) {

    const comando = pegarComando(linhaDeCodigo);
    
    if (comando !== null) {

        token = comando;
        posInicio = posFim;
        posFim += token.length;

        return;
    } 

    const simbolo = pegarSimbolo(linhaDeCodigo);

    if (simbolo == ' ') {
        token = simbolo;
        posInicio = posFim;
        posFim += token.length;
        return pegarToken(linhaDeCodigo);
    }

    if (simbolo !== null) {

        token = simbolo;
        posInicio = posFim;
        posFim += token.length;

        return;
    } 

    erros(2);

}

async function main() {


    const readFile = () => new Promise((resolve, reject) => {

        fs.readFile(config.caminhoDoCodigo, (reject, resolve) => {

            if (reject) {

                erros(1);

            } else {

                const code = String(resolve);

                const arrayDeLinhasDeCodigo = code.split('\n');

                iniciaToken(arrayDeLinhasDeCodigo[0]);
                console.log(token);
                if (token) {
                    
                    for (posLinha = 0; posLinha < arrayDeLinhasDeCodigo.length; posLinha++) {
                        
                        linha = arrayDeLinhasDeCodigo[posLinha];
                        
                        pegarToken(linha);
                        console.log(linha.substr(posFim, linha.length));


                    }

                }
                
            }

        });
        
    });
    
    readFile();

}

main();