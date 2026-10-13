const THEME_STORAGE_KEY = "portfolio-theme";
const themeToggle = document.getElementById("theme-toggle");
const themeIcons = document.querySelectorAll("[data-theme-icon]");

function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeIcons.forEach((icon) => {
        icon.hidden = icon.dataset.themeIcon !== (isDark ? "dark" : "light");
    });

    const nextThemeLabel = isDark ? "Ativar tema claro" : "Ativar tema escuro";
    themeToggle.setAttribute("aria-label", nextThemeLabel);
    themeToggle.setAttribute("title", nextThemeLabel);
}

let savedTheme = "dark";

try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
        savedTheme = storedTheme;
    }
} catch (error) {
    console.error("Não foi possível carregar o tema salvo:", error);
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
        console.error("Não foi possível salvar a preferência de tema:", error);
    }
});
