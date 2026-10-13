const texto = "Engenheiro de Software";
const elemento = document.getElementById("maquina");

let i = 0;
const velocidade = 120; // milissegundos entre cada letra

function escrever() {
  if (i < texto.length) {
    elemento.textContent += texto.charAt(i);
    i++;
    setTimeout(escrever, velocidade);
  }
}

escrever();