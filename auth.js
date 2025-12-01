(function() {
  // --- CONFIG ---
  const LOGIN_PAGE = 'login.html';
  // Only login.html is public; everything else is private
  const PUBLIC_PAGES = ['index.html'];

  // --- HELPERS ---
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function filename() { return window.location.pathname.split('/').pop().toLowerCase(); }

  // --- NAVBAR DYNAMICS ---
  function updateNavbar() {
    const navUl = qs('.navbar .navbar-collapse .navbar-nav');
    if (!navUl) return;

    // Remove duplicate signout element if present
    const existing = qs('#signout-nav-item');
    if (existing) existing.remove();

    const loggedUser = localStorage.getItem('loggedInUser');

    // Show or hide any login links
    qsa('.nav-link').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.toLowerCase().includes('login.html')) {
        a.style.display = loggedUser ? 'none' : '';
      }
    });

    if (loggedUser) {
      // Append Sign Out nav item
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.id = 'signout-nav-item';
      li.innerHTML = `<a class="nav-link" href="#" id="signout-btn">Sign Out</a>`;
      navUl.appendChild(li);

      // Hook sign out
      qs('#signout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('rememberMe');
        // show login links again
        qsa('.nav-link').forEach(a => {
          const href = a.getAttribute('href') || '';
          if (href.toLowerCase().includes('login.html')) a.style.display = '';
        });
        const item = qs('#signout-nav-item'); if (item) item.remove();
        alert('You have been signed out.');
        window.location.href = LOGIN_PAGE;
      });
    } else {
      // Not logged in - remove signout if present
      const s = qs('#signout-nav-item'); if (s) s.remove();
    }
  }

  // --- PROTECTION ---
  function protectPage() {
    const page = filename();
    const isPublic = PUBLIC_PAGES.includes(page) || page === '';
    const loggedUser = localStorage.getItem('loggedInUser');

    // If page is private and user not logged in -> redirect to login
    if (!isPublic && !loggedUser) {
      window.location.href = LOGIN_PAGE;
    }
  }

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
    protectPage();
  });
  // Also ensure navbar updates after full load
  window.addEventListener('load', updateNavbar);
})();
