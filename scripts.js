
document.addEventListener("DOMContentLoaded", () => {

  const carrinho = [];
  const btnCarrinho = document.getElementById('btnCarrinho');
  const dropdown = document.getElementById('carrinho-dropdown');
  const carrinhoItens = document.getElementById('carrinho-itens');
  const carrinhoQuantidade = document.getElementById('carrinho-quantidade');
  const carrinhoTotal = document.getElementById('carrinho-total');
  const btnFinalizar = document.getElementById('finalizarCompra');
  const somAdicionar = new Audio('./sounds/add-item.mp3');

  function mostrarNotificacao(mensagem) {
    const container = document.getElementById('notificacoes');
    const notif = document.createElement('div');
    notif.textContent = mensagem;
    notif.style.background = 'rgba(0,0,0,0.8)';
    notif.style.color = 'white';
    notif.style.padding = '12px 18px';
    notif.style.borderRadius = '8px';
    notif.style.fontSize = '1.4rem';
    notif.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.4s ease';

    container.appendChild(notif);

    requestAnimationFrame(() => {
      notif.style.opacity = '1';
    });

    setTimeout(() => {
      notif.style.opacity = '0';
      notif.addEventListener('transitionend', () => {
        notif.remove();
      });
    }, 3000);
  }

  btnCarrinho.addEventListener('click', () => {
    dropdown.classList.toggle('active');
  });

  // Corrigido para capturar só texto do preço correto, ignorando preço riscado
  document.querySelectorAll('.menu .box .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const box = e.target.closest('.box');
      const produto = box.querySelector('h3').innerText;

      // Captura só o texto do primeiro nó de texto dentro da .price
      const precoStr = box.querySelector('.price').childNodes[0].textContent.trim();
      const precoNum = parseFloat(precoStr.replace('R$', '').replace(',', '.'));

      carrinho.push({ produto, preco: precoNum });
      atualizarCarrinho();
      somAdicionar.play();
      mostrarNotificacao(`"${produto}" adicionado ao carrinho!`);
    });
  });

  function atualizarCarrinho() {
    carrinhoItens.innerHTML = '';
    let total = 0;
    carrinho.forEach((item, i) => {
      total += item.preco;
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.marginBottom = '10px';
      div.style.padding = '8px 10px';
      div.style.borderRadius = '6px';
      div.style.backgroundColor = '#2a2a2a';
      div.style.transition = 'background-color 0.3s ease';
      div.innerHTML = `
        <span title="${item.produto}" style="max-width: 65%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.produto}</span>
        <span>R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
        <button type="button" data-index="${i}">×</button>
      `;
      carrinhoItens.appendChild(div);

      if (i === carrinho.length - 1) {
        div.style.backgroundColor = '#4a794a';
        setTimeout(() => {
          div.style.backgroundColor = '#2a2a2a';
        }, 600);
      }
    });
    carrinhoQuantidade.textContent = carrinho.length;
    carrinhoTotal.innerHTML = `<strong>Total: R$ ${total.toFixed(2).replace('.', ',')}</strong>`;

    // adicionar event listener pros botões após criar os elementos
    carrinhoItens.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        removerItem(index);
      });
    });
  }

  function removerItem(i) {
    const divs = Array.from(carrinhoItens.children);
    const divRemover = divs[i];
    if (divRemover) {
      divRemover.style.transition = 'opacity 0.4s ease, height 0.4s ease, margin 0.4s ease';
      divRemover.style.opacity = '0';
      divRemover.style.height = '0';
      divRemover.style.marginBottom = '0';
      setTimeout(() => {
        carrinho.splice(i, 1);
        atualizarCarrinho();
      }, 400);
    }
  }

  window.removerItem = removerItem;

  btnFinalizar.addEventListener('click', () => {
    if (carrinho.length === 0) {
      mostrarNotificacao('Seu carrinho está vazio!');
      return;
    }
    let mensagem = 'Olá! Quero comprar:%0A';
    carrinho.forEach(item => {
      mensagem += `- ${item.produto}: R$ ${item.preco.toFixed(2).replace('.', ',')}%0A`;
    });
    const url = `https://wa.me/5511954905736?text=${mensagem}`;
    window.open(url, '_blank');
  });

});