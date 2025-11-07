// Carrega detalhes e estatísticas do GitHub
// Usa LANGUAGE_COLORS do projects-loader.js (já carregado antes)

async function loadDetailsTab() {
    try {
        const portfolio = await getPortfolio();

        // Carrega linguagens
        if (portfolio.stats && portfolio.stats.languages) {
            loadLanguages(portfolio.stats.languages);
        }

        // Carrega estatísticas
        loadGitHubStats(portfolio);

    } catch (error) {
        console.error('❌ Erro ao carregar detalhes:', error);

        const languagesList = document.getElementById('languages-list');
        if (languagesList) {
            languagesList.innerHTML = `
                <p style="color: var(--text-secondary); font-size: 13px;">
                    Erro ao carregar dados: ${error.message}
                </p>
            `;
        }
    }
}

function loadLanguages(languages) {
    const languagesList = document.getElementById('languages-list');

    if (!languagesList) {
        return;
    }

    if (!languages || languages.length === 0) {
        languagesList.innerHTML = `
            <p style="color: var(--text-secondary); font-size: 13px;">
                Nenhuma linguagem encontrada nos repositórios.
            </p>
        `;
        return;
    }

    // Calcula total para percentuais
    const total = languages.reduce((sum, lang) => sum + lang.count, 0);

    // Pega top 5 linguagens
    const topLanguages = languages.slice(0, 5);

    let html = '';
    topLanguages.forEach(lang => {
        const percentage = ((lang.count / total) * 100).toFixed(1);
        // Usa a função getLanguageColor do projects-loader.js
        const color = getLanguageColor(lang.language);

        html += `
            <div class="language-item">
                <div class="language-info">
                    <span class="language-dot" style="background-color: ${color};"></span>
                    <span class="language-name">${lang.language}</span>
                </div>
                <div class="language-bar-container">
                    <div class="language-bar" style="width: ${percentage}%; background-color: ${color};"></div>
                </div>
                <span class="language-percentage">${percentage}%</span>
            </div>
        `;
    });

    languagesList.innerHTML = html;
}

function loadGitHubStats(portfolio) {
    // Total de estrelas
    const totalStarsElement = document.getElementById('total-stars');
    if (totalStarsElement) {
        totalStarsElement.textContent = portfolio.stats.totalStars || 0;
    }

    // Total de forks
    const totalForks = portfolio.all.reduce((sum, repo) => sum + repo.forks, 0);
    const totalForksElement = document.getElementById('total-forks');
    if (totalForksElement) {
        totalForksElement.textContent = totalForks;
    }

    // Repositórios públicos
    const publicReposElement = document.getElementById('public-repos');
    if (publicReposElement) {
        publicReposElement.textContent = portfolio.stats.totalRepos || 0;
    }
}

// Carrega os detalhes quando a aba for clicada ou imediatamente
document.addEventListener('DOMContentLoaded', () => {
    const detailsTab = document.querySelector('[data-tab="details"]');

    if (detailsTab) {
        // Carrega quando clicar na aba
        detailsTab.addEventListener('click', () => {
            if (!detailsTab.dataset.loaded) {
                loadDetailsTab();
                detailsTab.dataset.loaded = 'true';
            }
        });
    }

    // Carrega automaticamente após um pequeno delay
    setTimeout(() => {
        loadDetailsTab();
    }, 500);
});

