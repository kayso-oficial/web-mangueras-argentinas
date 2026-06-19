import './style.css';
import { createIcons, icons } from 'lucide';

// 1. DIBUJAR ÍCONOS (Modo Vite)
createIcons({ icons });

// 2. ANIMACIONES AL HACER SCROLL (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Activa cuando el 15% del elemento entra en pantalla
};
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target); // Dejar de observar una vez que ya apareció
        }
    });
}, observerOptions);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --- LÓGICA DEL CARRUSEL Y BUSCADOR DE PRODUCTOS ---

// 3. Filtro de Categorías
function filterProductsInSection(section, category) {
    const cards = section.querySelectorAll('.product-card');
    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const matchesCategory = category === "" || title.includes(category.toLowerCase());
        
        if (matchesCategory) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// 4. LÓGICA DE VER MÁS / VER MENOS EN TARJETAS DE PRODUCTOS (MOBILE)
document.querySelectorAll('.toggle-details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const details = card.querySelector('.product-details');
        const textSpan = this.querySelector('.btn-text');
        const icon = this.querySelector('.icon-chevron');
        
        if (details.classList.contains('hidden')) {
            details.classList.remove('hidden');
            details.classList.add('block');
            textSpan.textContent = 'Ver menos';
            icon.classList.add('rotate-180');
        } else {
            details.classList.add('hidden');
            details.classList.remove('block');
            textSpan.textContent = 'Ver más';
            icon.classList.remove('rotate-180');
        }
    });
});

document.querySelectorAll('.category-select').forEach(select => {
    select.addEventListener('change', (e) => {
        const section = e.target.closest('section');
        filterProductsInSection(section, e.target.value);
    });
});

// 5. Movimiento de flechas del Carrusel (Agregado al 'window' para que el HTML lo lea)
window.scrollCarousel = function(btn, direction) {
    const section = btn.closest('section');
    const track = section.querySelector('.product-track');
    if (track) {
        const scrollAmount = 350; 
        track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
}

// 6. LÓGICA DEL MENÚ MOBILE
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        
        // Cambiar el icono con transición
        const isHidden = mobileMenu.classList.contains('hidden');
        const svgMenu = document.getElementById('icon-menu');
        const svgClose = document.getElementById('icon-close');
        
        if (isHidden) {
            svgMenu.classList.remove('opacity-0');
            svgClose.classList.add('opacity-0');
        } else {
            svgMenu.classList.add('opacity-0');
            svgClose.classList.remove('opacity-0');
        }
    });

    // Cerrar el menú si se hace click en un enlace
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.getElementById('icon-menu').classList.remove('opacity-0');
            document.getElementById('icon-close').classList.add('opacity-0');
        });
    });
}