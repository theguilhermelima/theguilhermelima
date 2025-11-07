// Carrega projetos fixados na aba de projetos

// Cores das linguagens de programação (baseado no GitHub)
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C': '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Vue': '#41b883',
    'React': '#61dafb',
    'Shell': '#89e051',
    'PowerShell': '#012456',
    'Lua': '#000080',
    'R': '#198CE7',
    'MATLAB': '#e16737',
    'Scala': '#c22d40',
    'Haskell': '#5e5086',
    'Elixir': '#6e4a7e',
    'Clojure': '#db5855',
    'Objective-C': '#438eff',
    'Perl': '#0298c3',
    'Julia': '#a270ba',
    'default': '#858585'
};

/**
 * Retorna a cor da linguagem
 * @param {string} language - Nome da linguagem
 * @returns {string} Código de cor hexadecimal
 */
function getLanguageColor(language) {
    return LANGUAGE_COLORS[language] || LANGUAGE_COLORS['default'];
}

async function loadPinnedProjectsTab() {
    try {
        const portfolio = await getPortfolio();
        const trabalhoProjects = portfolio.trabalho;

        const projectsTab = document.getElementById('projects');

        if (!projectsTab) {
            console.error('❌ Aba de projetos não encontrada');
            return;
        }

        if (trabalhoProjects.length === 0) {
            projectsTab.innerHTML = `
                <div class="no-projects">
                    <p>� Nenhum projeto de trabalho encontrado.</p>
                    <p style="font-size: 12px; color: var(--text-secondary); margin-top: 10px;">
                        Adicione o tópico "trabalho" aos seus repositórios no GitHub para exibi-los aqui.
                    </p>
                </div>
            `;
            return;
        }

        let projectsHTML = '<div class="projects-grid">';

        trabalhoProjects.forEach(project => {
            const languageColor = project.language ? getLanguageColor(project.language) : '#858585';

            projectsHTML += `
                <div class="project-card" data-url="${project.url}" onclick="openProject(event, '${project.url}')">
                    <div class="project-header">
                        <h3 class="project-title">
                            <a href="${project.url}" target="_blank" onclick="event.stopPropagation()">${project.name}</a>
                        </h3>
                        ${project.language ? `
                            <span class="project-language" style="background-color: ${languageColor}20; color: ${languageColor}; border: 1px solid ${languageColor}40;">
                                <span class="language-dot" style="background-color: ${languageColor};"></span>
                                ${project.language}
                            </span>
                        ` : ''}
                    </div>
                    
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-stats">
                        <span class="project-stat">⭐ ${project.stars}</span>
                        <span class="project-stat">🔄 ${project.forks}</span>
                        ${project.homepage ? `<a href="${project.homepage}" target="_blank" class="project-link" onclick="event.stopPropagation()">🔗 Demo</a>` : ''}
                    </div>
                    
                    ${project.topics.length > 0 ? `
                        <div class="project-topics">
                            ${project.topics.slice(0, 5).map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        projectsHTML += '</div>';
        projectsTab.innerHTML = projectsHTML;

    } catch (error) {
        console.error('❌ Erro ao carregar projetos de trabalho:', error);

        const projectsTab = document.getElementById('projects');
        if (projectsTab) {
            projectsTab.innerHTML = `
                <div class="error-message">
                    <p>❌ Erro ao carregar projetos.</p>
                    <p style="font-size: 12px; color: var(--text-secondary);">${error.message}</p>
                </div>
            `;
        }
    }
}

/**
 * Abre o projeto no GitHub em nova aba
 * @param {Event} event - Evento de click
 * @param {string} url - URL do projeto
 */
function openProject(event, url) {
    // Previne que links internos disparem duas vezes
    if (event.target.tagName === 'A' || event.target.closest('a')) {
        return;
    }
    window.open(url, '_blank');
}

// Carrega os projetos quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPinnedProjectsTab);
} else {
    loadPinnedProjectsTab();
}
