// Carrega as estatísticas dos projetos do GitHub
async function loadProjectStats() {
    try {
        const portfolio = await getPortfolio();

        // Atualiza os valores na página
        const totalElement = document.getElementById('total-projects');
        const trabalhoElement = document.getElementById('trabalho-projects');
        const estudoElement = document.getElementById('estudo-projects');

        if (totalElement) {
            totalElement.textContent = portfolio.stats.totalRepos;
        }

        if (trabalhoElement) {
            trabalhoElement.textContent = portfolio.stats.trabalhoCount;
        }

        if (estudoElement) {
            estudoElement.textContent = portfolio.stats.estudoCount;
        }

    } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);

        // Em caso de erro, mantém valores padrão
        const totalElement = document.getElementById('total-projects');
        const trabalhoElement = document.getElementById('trabalho-projects');
        const estudoElement = document.getElementById('estudo-projects');

        if (totalElement) totalElement.textContent = '-';
        if (trabalhoElement) trabalhoElement.textContent = '-';
        if (estudoElement) estudoElement.textContent = '-';
    }
}

// Carrega as estatísticas quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjectStats);
} else {
    loadProjectStats();
}
