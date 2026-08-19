document.addEventListener('DOMContentLoaded', () => {

    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMfjcQoasT3n29jrU7E9HXbOfZ5LWdOQR6aqw14kiDBhi37eswWZNRKuSCJn4IAvWKQ1GQP8Vq2fyv/pub?gid=0&single=true&output=csv';

    const sidebar = document.getElementById('sidebar');
    const cards = document.getElementById('cards');
    const btnAbrir = document.getElementById('btnAbrir');
    const btnFechar = document.getElementById('btnFechar');
    const menuCategorias = document.getElementById('menuCategorias');
    const title = document.getElementById('categoria_title');

    let dadosPorCategoria = {};


    btnAbrir.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    btnFechar.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    function carregarCardapio() {

        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,

            transformHeader: h =>
                h.normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '')
                    .replace(/\r/g, '')
                    .toLowerCase(),

            complete: res => {

                dadosPorCategoria = {};

                res.data.forEach(item => {

                    if (!item.status || item.status.toLowerCase() !== 'ativo') return;

                    const categoria = item.categoria || 'Outros';

                    if (!dadosPorCategoria[categoria]) {
                        dadosPorCategoria[categoria] = [];
                    }

                    dadosPorCategoria[categoria].push(item);

                });

                montarMenu();

            },

            error: err => console.error('Erro CSV:', err)

        });

    }

    function montarMenu() {

        menuCategorias.innerHTML = '';

        Object.keys(dadosPorCategoria).forEach((cat, index) => {

            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = cat;

            btn.addEventListener('click', () => {

                carregarCategoria(cat);
                sidebar.classList.remove('open');

            });

            menuCategorias.appendChild(btn);

            // Carrega automaticamente a primeira categoria
            if (index === 0) {
                carregarCategoria(cat);
            }

        });

    }

    function carregarCategoria(categoria) {

        // Atualiza o título da categoria
        title.textContent = categoria;

        // Limpa os cards atuais
        cards.innerHTML = '';

        dadosPorCategoria[categoria].forEach(item => {

            const itemId = `${categoria}-${item.nome}`
                .replace(/\s+/g, '_')
                .toLowerCase();

            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `

                    <div class="title">
                        <strong>R$ ${item.preco}</strong>
                        <h3>${item.nome}</h3>
                    </div>

                ${item.imagem ? `
                    <div class="card-img">
                        <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
                    </div>
                ` : ''}

                <div class="card-info">



                    <p>${item.descricao || ''}</p>


                </div>
            `;



            cards.appendChild(card);

        });

    }

    carregarCardapio();

});