





// script.js
document.addEventListener('DOMContentLoaded', () => {
    const tabuleiro = document.getElementById('tabuleiro');
    const novoJogoButton = document.getElementById('novo-jogo');
    const jogadorAtual = document.createElement('div');
    jogadorAtual.id = 'jogador-atual';
    document.body.insertBefore(jogadorAtual, tabuleiro);

    const BRANCO = 'branca';
    const PRETO = 'preta';
    const VERMELHO = 'vermelha';
    const AZUL = 'azul';
    const REI = 'rei';

    let pecas = [];
    let vezAzul = true;
    let pecaSelecionada = null;

    function atualizarJogadorAtual() {
        jogadorAtual.textContent = vezAzul ? 'Jogador 1 (Azul)' : 'Jogador 2 (Vermelho)';
    }

    function criarTabuleiro() {
        for (let linha = 0; linha < 8; linha++) {
            for (let coluna = 0; coluna < 8; coluna++) {
                const celula = document.createElement('div');
                celula.classList.add('celula');
                if ((linha + coluna) % 2 === 0) {
                    celula.classList.add(BRANCO);
                } else {
                    celula.classList.add(PRETO);
                    if (linha < 3) {
                        adicionarPeca(celula, VERMELHO);
                    } else if (linha > 4) {
                        adicionarPeca(celula, AZUL);
                    }
                }
                tabuleiro.appendChild(celula);
            }
        }
    }

    function adicionarPeca(celula, cor) {
        const peca = document.createElement('div');
        peca.classList.add('peca', cor);
        celula.appendChild(peca);
    }

    function inicializarJogo() {
        tabuleiro.innerHTML = '';
        pecas = [];
        vezAzul = true;
        pecaSelecionada = null;
        criarTabuleiro();
        atualizarJogadorAtual();
    }

    function movimentoValido(linha, coluna, novaLinha, novaColuna) {
        if (novaLinha < 0 || novaLinha >= 8 || novaColuna < 0 || novaColuna >= 8) {
            return false;
        }
        const destino = tabuleiro.children[novaLinha * 8 + novaColuna];
        if (destino.querySelector('.peca') !== null) {
            return false;
        }

        const deltaLinha = Math.abs(novaLinha - linha);
        const deltaColuna = Math.abs(novaColuna - coluna);

        if (deltaLinha === 1 && deltaColuna === 1) {
            return true;
        } else if (deltaLinha === 2 && deltaColuna === 2) {
            const linhaCapturada = (linha + novaLinha) / 2;
            const colunaCapturada = (coluna + novaColuna) / 2;
            const celulaCapturada = tabuleiro.children[linhaCapturada * 8 + colunaCapturada];
            const pecaCapturada = celulaCapturada.querySelector('.peca');

            if (pecaCapturada && pecaCapturada.classList.contains(vezAzul ? VERMELHO : AZUL)) {
                celulaCapturada.removeChild(pecaCapturada);
                return true;
            }
        }

        return false;
    }

    function selecionarPeca(peca) {
        if (pecaSelecionada) {
            pecaSelecionada.classList.remove('selecionada');
        }
        peca.classList.add('selecionada');
        pecaSelecionada = peca;
    }

    function moverPeca(celulaDestino) {
        const peca = pecaSelecionada;
        const celulaOrigem = peca.parentElement;
        const origemIndex = Array.from(tabuleiro.children).indexOf(celulaOrigem);
        const destinoIndex = Array.from(tabuleiro.children).indexOf(celulaDestino);

        const linhaOrigem = Math.floor(origemIndex / 8);
        const colunaOrigem = origemIndex % 8;
        const linhaDestino = Math.floor(destinoIndex / 8);
        const colunaDestino = destinoIndex % 8;

        if (movimentoValido(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino)) {
            celulaDestino.appendChild(peca);
            vezAzul = !vezAzul;
            atualizarJogadorAtual();
            pecaSelecionada.classList.remove('selecionada');
            pecaSelecionada = null;
        }
    }

    novoJogoButton.addEventListener('click', inicializarJogo);

    tabuleiro.addEventListener('click', evento => {
        const alvo = evento.target;
        if (alvo.classList.contains('peca')) {
            const corPeca = alvo.classList.contains(VERMELHO) ? VERMELHO : AZUL;
            if ((corPeca === AZUL && vezAzul) || (corPeca === VERMELHO && !vezAzul)) {
                selecionarPeca(alvo);
            }
        } else if (alvo.classList.contains('celula') && pecaSelecionada) {
            moverPeca(alvo);
        }
    });

    inicializarJogo();
});
