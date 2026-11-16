const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");

function setTheme(theme) {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    themeButton.innerHTML = `<i class="fa-solid ${isDark ? "fa-sun" : "fa-moon"}" aria-hidden="true"></i>`;
    themeButton.setAttribute("aria-label", isDark ? "Bật giao diện sáng" : "Bật giao diện tối");
    document.querySelector('meta[name="theme-color"]').content = isDark ? "#090b10" : "#ffffff";
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
}

function closeMenu() {
    navPanel.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Mở menu");
    menuButton.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
}

setTheme(localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light");
document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
});

themeButton.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

menuButton.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
    menuButton.innerHTML = `<i class="fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}" aria-hidden="true"></i>`;
});

navPanel.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

const filterButtons = document.querySelectorAll(".filter-button");
if (filterButtons.length) {
    const galleryCards = document.querySelectorAll(".gallery-card");
    const emptyState = document.querySelector(".empty-state");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(filterButton => {
                const isSelected = filterButton === button;
                filterButton.classList.toggle("active", isSelected);
                filterButton.setAttribute("aria-pressed", String(isSelected));
            });

            let visibleCount = 0;
            galleryCards.forEach(card => {
                const isVisible = button.dataset.filter === "all" || card.dataset.category === button.dataset.filter;
                card.hidden = !isVisible;
                if (isVisible) visibleCount += 1;
            });
            emptyState.hidden = visibleCount > 0;
        });
    });
}

const lightbox = document.querySelector(".lightbox");
if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    let lastFocusedButton;

    document.querySelectorAll("[data-lightbox]").forEach(button => {
        button.addEventListener("click", () => {
            lastFocusedButton = button;
            lightboxImage.src = button.dataset.lightbox;
            lightboxImage.alt = button.querySelector("img").alt;
            lightboxCaption.textContent = button.dataset.caption || "";
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("lightbox-open");
            lightbox.focus();
        });
    });

    const closeLightbox = () => {
        if (!lightbox.classList.contains("is-open")) return;
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
        lightboxImage.removeAttribute("src");
        lastFocusedButton?.focus();
    };

    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeLightbox();
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
});
