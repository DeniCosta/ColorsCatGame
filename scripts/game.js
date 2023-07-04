// Cores dos alvos
const cores = [
  { nome: "#ed489a", imagem: "rosa.svg" },
  { nome: "#4b4648", imagem: "cinza.svg" },
  { nome: "#4ba8ce", imagem: "azul.svg" },
  { nome: "#3a0870", imagem: "roxo.svg" },
  { nome: "#ffce00", imagem: "amarelo.svg" },
  { nome: "#392202", imagem: "marrom.svg" },
  { nome: "#fc9c00", imagem: "laranja.svg" },
  { nome: "#139f55", imagem: "verde.svg" },
  { nome: "#bf1616", imagem: "vermelho.svg" }
];

// Palavras que serão exibidas aleatoriamente
const palavras = ["Rosa", "Cinza", "Azul", "Roxo", "Amarelo", "Marrom", "Laranja", "Verde", "Vermelho"];

const caminhoImagem = "../assets/grid-item-";

// Cor alvo do botão
let alvo;
// Palavra sorteada a cada rodada
let palavra;
// Tempo de contagem regressiva (definido de acordo com o nível)
let contagemRegressiva;
// Decremento do contador
let intervaloContagem;
// Variáveis de controle de nível e pontuação
let nivel = 1;
let pontuacao = 0;

// Obtém os elementos HTML
const elementoNomeCor = document.getElementById("nameColor");
const itensGrid = document.getElementsByClassName("grid-item");
const elementoNivel = document.getElementById("level");
const elementoPontuacao = document.getElementById("score");
const elementoTempo = document.getElementById("timer");

// Função para reiniciar o jogo
function reiniciarJogo() {
  // Oculta o modal de resultado
  const modal = document.getElementById("modal");
  modal.style.display = "none";

  // Reinicia as variáveis do jogo
  nivel = 1;
  pontuacao = 0;
}

//função exibir um modal com uma mensagem de acordo com o evento
function finalizarJogo(jogadaErrada, tempoAcabou, voceVenceu) {
  const modal = document.getElementById("modal");
  const elementoPontuacaoModal = document.getElementById("modal-score");
  const elementoNivelModal = document.getElementById("modal-level");
  const elementoMensagemModal = document.getElementById("modal-message");
  const elementoTituloModal = document.getElementById("modal-title");

  // Mostra o modal de resultado
  modal.style.display = "block";

  // Configura os valores no modal
  elementoPontuacaoModal.textContent = "Pontuação: " + pontuacao;
  elementoNivelModal.textContent = "Nível: " + nivel;

  //captura o click no ícone e reinicia o jogo
  const closeButton = document.getElementsByClassName("close")[0];
  closeButton.onclick = function () {
    reiniciarJogo();
  };
  //captura o click na tela e reinicia o jogo
  window.onclick = function (event) {
    if (event.target == modal) {
      reiniciarJogo();
    }
  };
  //parâmetros utilizados para exibir a mensagem de acordo com o evento
  if (jogadaErrada) {
    elementoTituloModal.textContent = "OOps!!";
    elementoMensagemModal.textContent = "Jogada errada, tente novamente!";
  }

  if (tempoAcabou) {
    elementoTituloModal.textContent = "OOps!!";
    elementoMensagemModal.textContent = "O tempo acabou, tente novamente!";
  }

  if (voceVenceu) {
    elementoTituloModal.textContent = "Parabéns!!";
    elementoMensagemModal.textContent = "Você venceu!! Jogue novamente!";
  }
}

// Função para atualizar a cor da palavra sorteada
function atualizarCorAlvo() {
  elementoNomeCor.textContent = palavra;
  elementoNomeCor.style.color = alvo;
}

// Função para embaralhar os botões de cores
function embaralharItensGrid() {
  const indices = Array.from(Array(itensGrid.length).keys());

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }

  for (let i = 0; i < itensGrid.length; i++) {
    const indiceCor = indices[i];
    const cor = cores[indiceCor];
    const imagem = cor.imagem;
    itensGrid[i].style.backgroundImage = "url(" + caminhoImagem + imagem + ")";
    itensGrid[i].setAttribute("data-cor", cor.nome);
  }
}
//Verifica se o botão clicado corresponde ao alvo
function lidarComClique(event) {
  const corClicada = event.target.getAttribute("data-cor");

  if (corClicada === alvo) {
    pontuacao++;
    //a cada 10 pontos incrementa o nível
    if (pontuacao % 10 === 0) {
      nivel++;
    }
    ajustarNivelJogo();
    iniciarNovaRodada();
  }
  //se errar encerra o jogo
  else {
    finalizarJogo(true, false, false);
  }
}

// Função para ajustar a lógica do jogo com base no nível atual
function ajustarNivelJogo() {
  switch (nivel) {
    case 1:
      contagemRegressiva = 3;
      break;
    case 2:
      contagemRegressiva = 2;
      break;
    case 3:
      contagemRegressiva = 2;
      embaralharItensGrid();
      break;
    case 4:
      contagemRegressiva = 1.7;
      embaralharItensGrid();
      break;
    case 5:
      contagemRegressiva = 1.5;
      embaralharItensGrid();
      break;
    case 6:
      contagemRegressiva = 1;
      embaralharItensGrid();
      break;
    default:
      // You Win!! Quando o nível > 6 jogo encerra. 
      finalizarJogo(false, false, true);
      break;
  }

  reiniciarTemporizador();
  atualizarTemporizador();
}

//chama o próximo alvo
function iniciarNovaRodada() {
  const indiceAlvo = Math.floor(Math.random() * cores.length);
  alvo = cores[indiceAlvo].nome;
  const indicePalavra = Math.floor(Math.random() * palavras.length);
  palavra = palavras[indicePalavra];
  elementoNomeCor.style.color = alvo; // Define a cor da palavra
  elementoNomeCor.textContent = palavra; // Define a palavra
  ajustarNivelJogo();
  atualizarTemporizador();
  atualizarNivel();
  atualizarPontuacao();

  for (let i = 0; i < itensGrid.length; i++) {
    itensGrid[i].addEventListener("click", lidarComClique);
  }
}

// Função para iniciar o jogo
function iniciarJogo() {
  nivel = 1;
  pontuacao = 0;
  atualizarCorAlvo();
  embaralharItensGrid();
  ajustarNivelJogo();
  atualizarPontuacao();
  atualizarNivel();
  atualizarTemporizador();
  iniciarNovaRodada();
}

// Função para iniciar o temporizador
function iniciarTemporizador() {
  intervaloContagem = setInterval(() => {
    // Verifica se o modal está aberto
    if (document.getElementById("modal").style.display === "block") {
      clearInterval(intervaloContagem); // Interrompe a contagem regressiva
      return;
    }

    contagemRegressiva -= 0.1;
    atualizarTemporizador();

    if (contagemRegressiva <= 0) {
      clearInterval(intervaloContagem);
      finalizarJogo(false, true, false);
      iniciarJogo();
    }
  }, 100);
}

// Função para reiniciar o temporizador
function reiniciarTemporizador() {
  clearInterval(intervaloContagem);
  iniciarTemporizador();
}

// Função para atualizar o temporizador
function atualizarTemporizador() {
  elementoTempo.textContent = "Tempo: " + contagemRegressiva.toFixed(1);
}

// Função para atualizar o nível
function atualizarNivel() {
  elementoNivel.textContent = "Nível: " + nivel;
}

// Função para atualizar a pontuação
function atualizarPontuacao() {
  elementoPontuacao.textContent = "Pontuação: " + pontuacao;
}

// Adiciona o evento de clique ao botão Jogar
const botaoJogar = document.getElementById("playButton");
botaoJogar.addEventListener("click", iniciarJogo);
