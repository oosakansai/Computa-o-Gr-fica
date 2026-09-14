// é um arquivo extra para o botao de som

const botaoSom = document.getElementById("botaoSom");
const audio = new Audio("sapateado.mp3");

botaoSom.addEventListener("click", () => {
    audio.play();
})