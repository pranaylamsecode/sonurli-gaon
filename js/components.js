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
