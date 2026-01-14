/**
 * Dynamic Component Loader
 * Loads header and footer components into all pages
 */

(function () {
  'use strict';

  // Load a component from a file and inject it into the target element
  function loadComponent(componentPath, targetId) {
    return fetch(componentPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${componentPath}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.innerHTML = html;
        } else {
          console.error(`Target element #${targetId} not found`);
        }
      })
      .catch(error => {
        console.error('Error loading component:', error);
      });
  }

  // Hide page loader
  function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('hidden');
      // Remove from DOM after transition
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }

  // Inject Visual Enhancements (AOS & Scroll Top)
  function initVisualEnhancements() {
    // 1. Inject AOS Library
    if (!document.querySelector('link[href*="aos.css"]')) {
      const aosCss = document.createElement('link');
      aosCss.rel = 'stylesheet';
      aosCss.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
      document.head.appendChild(aosCss);

      const aosJs = document.createElement('script');
      aosJs.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';

      aosJs.onload = function () {
        // Add data-aos to elements
        document.querySelectorAll('.card, .service, .gallery-entry, .team-member, .product-item').forEach((el, index) => {
          el.setAttribute('data-aos', 'fade-up');
          el.setAttribute('data-aos-delay', (index % 3) * 100); // Stagger animations
        });

        document.querySelectorAll('.hero h1, .hero p, .intro-excerpt').forEach(el => {
          el.setAttribute('data-aos', 'fade-up');
        });

        // Initialize AOS
        // @ts-ignore
        if (window.AOS) {
          window.AOS.init({
            duration: 800,
            once: true,
            offset: 100
          });
        }
      };
      document.body.appendChild(aosJs);
    }

    // 2. Inject Scroll to Top Button
    if (!document.getElementById('scrollTopBtn')) {
      const btn = document.createElement('button');
      btn.id = 'scrollTopBtn';
      btn.title = 'Go to top';
      btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      document.body.appendChild(btn);

      // Scroll Logic
      window.onscroll = function () {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
          btn.style.display = 'block';
        } else {
          btn.style.display = 'none';
        }
      };

      btn.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }
  }

  // Load both header and footer when DOM is ready
  function initComponents() {
    // Load header first (priority)
    loadComponent('components/header.html', 'header')
      .then(() => {
        console.log('Header loaded successfully');
        // Load footer after header
        return loadComponent('components/footer.html', 'footer');
      })
      .then(() => {
        console.log('Footer loaded successfully');
        // Init Visuals before hiding loader
        initVisualEnhancements();
        // Hide loader after all components loaded
        hideLoader();
      })
      .catch(error => {
        console.error('Component loading failed:', error);
        // Hide loader even if there's an error
        hideLoader();
      });
  }

  // Initialize components when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    // DOM is already loaded
    initComponents();
  }

})();
