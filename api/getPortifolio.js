/**
 * API para coletar projetos do portfólio no GitHub
 * Filtra projetos por tópicos: "trabalho" e "estudo"
 */

const GITHUB_USERNAME = 'theguilhermelima';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

/**
 * Busca todos os repositórios do usuário no GitHub
 * @returns {Promise<Array>} Lista de repositórios
 */
async function fetchAllRepositories() {
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar repositórios: ${response.status}`);
        }

        const repos = await response.json();
        return repos;
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
        return [];
    }
}

/**
 * Filtra projetos por tópico específico
 * @param {Array} repositories - Lista de repositórios
 * @param {string} topic - Tópico para filtrar
 * @returns {Array} Repositórios filtrados
 */
function filterByTopic(repositories, topic) {
    return repositories.filter(repo =>
        repo.topics && repo.topics.includes(topic.toLowerCase())
    );
}

/**
 * Formata os dados do repositório para o portfólio
 * @param {Object} repo - Dados do repositório
 * @returns {Object} Dados formatados
 */
function formatRepository(repo) {
    return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || 'Sem descrição',
        url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        isPrivate: repo.private,
        isFork: repo.fork
    };
}

/**
 * Obtém todos os projetos organizados por categoria
 * @returns {Promise<Object>} Projetos organizados
 */
async function getPortfolio() {
    try {
        const allRepos = await fetchAllRepositories();

        if (allRepos.length === 0) {
            return {
                all: [],
                trabalho: [],
                estudo: [],
                total: 0
            };
        }

        // Filtra projetos excluindo forks (opcional)
        const ownRepos = allRepos.filter(repo => !repo.fork);

        // Filtra por tópicos
        const trabalhoRepos = filterByTopic(ownRepos, 'trabalho');
        const estudoRepos = filterByTopic(ownRepos, 'estudo');

        // Formata os dados
        const portfolio = {
            all: ownRepos.map(formatRepository),
            trabalho: trabalhoRepos.map(formatRepository),
            estudo: estudoRepos.map(formatRepository),
            total: ownRepos.length,
            stats: {
                totalRepos: ownRepos.length,
                trabalhoCount: trabalhoRepos.length,
                estudoCount: estudoRepos.length,
                languages: getLanguageStats(ownRepos),
                totalStars: ownRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
            }
        };

        return portfolio;
    } catch (error) {
        console.error('❌ Erro ao obter portfólio:', error);
        return {
            all: [],
            trabalho: [],
            estudo: [],
            total: 0,
            error: error.message
        };
    }
}

/**
 * Obtém estatísticas de linguagens usadas
 * @param {Array} repositories - Lista de repositórios
 * @returns {Object} Estatísticas de linguagens
 */
function getLanguageStats(repositories) {
    const languageCount = {};

    repositories.forEach(repo => {
        if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
    });

    return Object.entries(languageCount)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Busca projetos de trabalho
 * @returns {Promise<Array>} Projetos de trabalho
 */
async function getTrabalhoProjects() {
    const portfolio = await getPortfolio();
    return portfolio.trabalho;
}

/**
 * Busca projetos de estudo
 * @returns {Promise<Array>} Projetos de estudo
 */
async function getEstudoProjects() {
    const portfolio = await getPortfolio();
    return portfolio.estudo;
}

/**
 * Busca todos os projetos
 * @returns {Promise<Array>} Todos os projetos
 */
async function getAllProjects() {
    const portfolio = await getPortfolio();
    return portfolio.all;
}

// Exporta as funções para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getPortfolio,
        getAllProjects,
        getTrabalhoProjects,
        getEstudoProjects,
        filterByTopic
    };
}
