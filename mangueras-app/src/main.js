import './style.css';
import { createIcons, icons } from 'lucide';

// 1. DIBUJAR ÍCONOS (Modo Vite)
createIcons({ icons });

// 2. ANIMACIONES AL HACER SCROLL (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));


// --- LÓGICA DEL CARRUSEL DE CATEGORÍAS Y BUSCADOR ---

// 3. Filtro de Categorías
window.filterProductsInSection = function(section, category) {
    const track = section.querySelector('.product-track');
    const cards = section.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        // Le agregamos un chequeo de seguridad por si alguna tarjeta no llega a tener el data-title
        const title = card.getAttribute('data-title') || ""; 
        const matchesCategory = category === "" || title.toLowerCase().includes(category.toLowerCase());
        
        if (matchesCategory) {
            // CLAVE: Se deja vacío para que Tailwind retome el control (flex flex-col)
            card.style.display = ''; 
        } else {
            card.style.display = 'none';
        }
    });

    // Pequeño retraso para que el DOM de mobile se actualice antes de resetear el scroll
    if (track) {
        setTimeout(() => {
            track.scrollLeft = 0;
        }, 50);
    }
}

// 4. LÓGICA DE VER MÁS / VER MENOS EN TARJETAS (MOBILE)
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
        window.filterProductsInSection(section, e.target.value);
    });
});

// 5. Movimiento Manual de Flechas del Carrusel Principal (Categorías)
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

    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.getElementById('icon-menu').classList.remove('opacity-0');
            document.getElementById('icon-close').classList.add('opacity-0');
        });
    });
}


// ============================================================
// 7. CARRUSEL MANUAL DE IMÁGENES INTERNAS (DENTRO DE LA CARD)
// ============================================================
window.changeCardImage = function(btn, direction) {
    const slider = btn.closest('.card-image-slider');
    const imgs = slider.querySelectorAll('.slide-img');
    if (imgs.length <= 1) return;

    let currentIndex = Array.from(imgs).findIndex(img => img.classList.contains('opacity-100'));
    
    // Ocultar imagen actual
    imgs[currentIndex].classList.remove('opacity-100');
    imgs[currentIndex].classList.add('opacity-0');
    
    // Calcular siguiente índice
    currentIndex = (currentIndex + direction + imgs.length) % imgs.length;
    
    // Mostrar nueva imagen
    imgs[currentIndex].classList.remove('opacity-0');
    imgs[currentIndex].classList.add('opacity-100');
}


// ============================================================
// 8. GALERÍA DINÁMICA DEL MODAL GLOBAL (CON NAVEGACIÓN)
// ============================================================
let modalImages = [];
let modalCurrentIndex = 0;

window.openProductModal = function(sliderElement) {
    const slides = sliderElement.querySelectorAll('.slide-img');
    if (slides.length === 0) return;

    // Guardar las rutas: busca el <img> real, ya sea el mismo elemento o si está adentro de un <div>
    modalImages = Array.from(slides).map(slide => {
        const img = slide.tagName.toLowerCase() === 'img' ? slide : slide.querySelector('img');
        return { 
            src: img ? img.src : '', 
            alt: img ? img.alt : '' 
        };
    });
    
    // Detectar cuál es la imagen que se está viendo actualmente en la tarjeta
    const activeCardIndex = Array.from(slides).findIndex(slide => slide.classList.contains('opacity-100'));
    modalCurrentIndex = activeCardIndex !== -1 ? activeCardIndex : 0;

    // Actualizar y mostrar el modal global
    updateModalContent();
    document.getElementById('global-product-modal').classList.remove('hidden');
}

window.closeProductModal = function() {
    document.getElementById('global-product-modal').classList.add('hidden');
}

function updateModalContent() {
    const modalImg = document.getElementById('modal-main-img');
    const currentData = modalImages[modalCurrentIndex];
    
    if (modalImg && currentData) {
        modalImg.src = currentData.src;
        modalImg.alt = currentData.alt;
    }
    
    // Ocultar flechas en el modal si la manguera tiene una sola foto
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    if (prevBtn && nextBtn) {
        if (modalImages.length <= 1) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
        }
    }
}