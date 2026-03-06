/**
 * app.js - Aplicación Principal SPA
 * Arquitectura: Capa de Presentación (Cliente)
 * Patrón: SPA Router + Observer + Renderer
 */

const App = (() => {
  'use strict';

  // ── Estado de la aplicación ───────────────────────────────────────────────
  let _state = {
    currentView: 'home',
    dishes: [],
    filtered: [],
    activeCategory: 'todos',
    searchQuery: '',
    activeDish: null,
    mediaItems: [],
    p5Instance: null,
    detailMap: null
  };

  // ── Router SPA ────────────────────────────────────────────────────────────
  const _routes = {
    home: _renderHome,
    catalogo: _renderCatalog,
    mapa: _renderMap,
    multimedia: _renderMedia,
    favoritos: _renderFavorites,
    admin: _renderAdmin,
    dish: _renderDishDetail
  };

  async function navigate(view, params = {}) {
    if (view === 'admin' && !window.Auth.isAdmin()) {
      _showAuthModal('login');
      return;
    }
    if (view === 'favoritos' && !window.Auth.isAuthenticated()) {
      _showAuthModal('login');
      return;
    }

    // Limpiar mapa anterior
    if (_state.p5Instance) {
      _state.p5Instance.remove();
      _state.p5Instance = null;
    }
    if (_state.detailMap) {
      _state.detailMap.remove();
      _state.detailMap = null;
    }

    _state.currentView = view;
    _state.activeDish = params.dish || null;

    _updateNav(view);
    _showLoader();

    const renderer = _routes[view] || _routes.home;
    await renderer(params);

    _hideLoader();
    _scrollToTop();
    _runEntryAnimation();
  }

  function navigateToDish(id) {
    navigate('dish', { dishId: id });
  }

  // ── UI Helpers ─────────────────────────────────────────────────────────────
  function _getMain() { return document.getElementById('main-content'); }

  function _showLoader() {
    const main = _getMain();
    if (main) main.innerHTML = `
      <div class="page-loader">
        <div class="loader-spinner"></div>
        <p>Cargando sabores...</p>
      </div>
    `;
  }

  function _hideLoader() {}

  function _scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function _updateNav(view) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === view);
    });
  }

  function _runEntryAnimation() {
    if (!window.gsap) return;
    const el = document.querySelector('.page-content');
    if (el) gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  }

  // ── HOME ───────────────────────────────────────────────────────────────────
  async function _renderHome() {
    const dishes = await window.DB.getDishes();
    const featured = dishes.filter(d => d.destacado);
    const categories = window.DB.getCategories().filter(c => c.id !== 'todos');

    _getMain().innerHTML = `
      <div class="page-content">
        <!-- Hero -->
        <section class="hero-section" id="hero-section">
          <div id="p5-canvas-container"></div>
          <div class="hero-content">
            <h1 class="hero-title">
              <span class="hero-title-main">Sabores</span>
              <span class="hero-title-sub">de Cali</span>
            </h1>
            <p class="hero-subtitle">
              Descubre la riqueza culinaria del Valle del Cauca.<br>
              Tradición, historia y sabor en cada plato.
            </p>
            <div class="hero-actions">
              <button class="btn-hero-primary" onclick="App.navigate('catalogo')">
                <i class="fas fa-utensils"></i> Explorar Platos
              </button>
              <button class="btn-hero-secondary" onclick="App.navigate('mapa')">
                <i class="fas fa-map-location-dot"></i> Ver en Mapa
              </button>
            </div>
          </div>
          <div class="hero-scroll-hint">
            <i class="fas fa-chevron-down"></i>
          </div>
        </section>

        <!-- Categorías -->
        <section class="section categories-section">
          <div class="categories-grid">
            ${categories.map(cat => `
              <div class="category-card" onclick="App.filterByCategory('${cat.id}')">
                <div class="category-icon"><i class="${cat.icon}"></i></div>
                <span>${cat.label}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Platos destacados -->
        <section class="section featured-section">
          <div class="section-header">
            <h2 class="section-title">Platos Destacados</h2>
            <button class="see-all-btn" onclick="App.navigate('catalogo')">
              Ver todos <i class="fas fa-arrow-right"></i>
            </button>
          </div>
          <div class="dishes-grid">
            ${featured.map(d => _renderDishCard(d)).join('')}
          </div>
        </section>

        <!-- Banner cultural -->
        <section class="culture-banner">
          <div class="culture-content">
            <div class="culture-text">
              <h2>Preservando la Identidad Culinaria</h2>
              <p>La gastronomía caleña es un patrimonio vivo que refleja siglos de mestizaje entre las culturas indígena, africana y española. Cada plato cuenta una historia de resistencia, creatividad y amor por la tierra.</p>
              <button class="btn-culture" onclick="App.navigate('multimedia')">
                <i class="fas fa-play-circle"></i> Ver Documentales
              </button>
            </div>
            <div class="culture-stats">
              <div class="culture-stat">
                <span class="c-number">8+</span>
                <span class="c-label">Platos Tradicionales</span>
              </div>
              <div class="culture-stat">
                <span class="c-number">500</span>
                <span class="c-label">Años de Historia</span>
              </div>
              <div class="culture-stat">
                <span class="c-number">3</span>
                <span class="c-label">Culturas Fusionadas</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    _initP5Animation();
    _initParallax();
  }

  // ── CATÁLOGO ──────────────────────────────────────────────────────────────
  async function _renderCatalog(params = {}) {
    _state.dishes = await window.DB.getDishes();
    _state.filtered = [..._state.dishes];

    if (params.category) _state.activeCategory = params.category;

    _getMain().innerHTML = `
      <div class="page-content">
        <div class="catalog-header">
          <h1 class="page-title"><i class="fas fa-utensils"></i> Catálogo Gastronómico</h1>
          <p class="page-subtitle">La gastronomía tradicional y contemporánea de Santiago de Cali</p>
        </div>

        <!-- Buscador -->
        <div class="search-bar-wrapper">
          <div class="search-bar">
            <i class="fas fa-search search-icon"></i>
            <input type="text" id="search-input" placeholder="Buscar platos, ingredientes, categorías..."
                   value="${_state.searchQuery}" oninput="App.handleSearch(this.value)"
                   aria-label="Buscar platos gastronómicos">
            <button class="search-clear" id="search-clear" onclick="App.clearSearch()" 
                    style="display:${_state.searchQuery ? 'block' : 'none'}">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Filtros -->
        <div class="filters-wrapper" role="navigation" aria-label="Filtros por categoría">
          ${window.DB.getCategories().map(cat => `
            <button class="filter-btn ${_state.activeCategory === cat.id ? 'active' : ''}" 
                    onclick="App.filterByCategory('${cat.id}')"
                    aria-pressed="${_state.activeCategory === cat.id}">
              <i class="${cat.icon}"></i> ${cat.label}
            </button>
          `).join('')}
        </div>

        <!-- Resultados -->
        <div class="results-info" id="results-info"></div>
        <div class="dishes-grid" id="dishes-grid"></div>
      </div>
    `;

    _applyFilters();
  }

  function handleSearch(query) {
    _state.searchQuery = query;
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';
    _applyFilters();
  }

  function clearSearch() {
    _state.searchQuery = '';
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    _applyFilters();
  }

  function filterByCategory(categoryId) {
    _state.activeCategory = categoryId;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().includes(
        window.DB.getCategories().find(c => c.id === categoryId)?.label || ''
      ));
    });
    // Actualizar clases
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event?.currentTarget?.classList.add('active');

    if (_state.currentView !== 'catalogo') {
      navigate('catalogo', { category: categoryId });
    } else {
      // Actualizar filtros
      document.querySelectorAll('.filter-btn').forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        btn.classList.toggle('active', onclick?.includes(`'${categoryId}'`));
      });
      _applyFilters();
    }
  }

  async function _applyFilters() {
    const grid = document.getElementById('dishes-grid');
    const info = document.getElementById('results-info');
    if (!grid) return;

    const results = await window.DB.searchDishes(_state.searchQuery, _state.activeCategory);
    _state.filtered = results;

    if (info) {
      info.innerHTML = `<span>${results.length} plato${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}</span>`;
    }

    if (!results.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>Sin resultados</h3>
          <p>No encontramos platos con esa búsqueda. Intenta otros términos.</p>
          <button onclick="App.clearSearch()" class="btn-reset">Limpiar búsqueda</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = results.map(d => _renderDishCard(d)).join('');

    if (window.gsap) {
      gsap.fromTo('.dish-card', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }

  // ── MAPA ──────────────────────────────────────────────────────────────────
  async function _renderMap() {
    _getMain().innerHTML = `
      <div class="page-content">
        <div class="catalog-header">
          <h1 class="page-title"><i class="fas fa-map-location-dot"></i> Mapa Gastronómico</h1>
          <p class="page-subtitle">Descubre dónde disfrutar los mejores sabores de Cali</p>
        </div>
        <div class="map-container-wrapper">
          <div id="main-map" class="main-map" role="application" aria-label="Mapa interactivo de Cali"></div>
        </div>
        <div class="map-dishes-list">
          <h3>Lugares Gastronómicos</h3>
          <div class="map-list" id="map-list"></div>
        </div>
      </div>
    `;

    const dishes = await window.DB.getDishes();
    const listEl = document.getElementById('map-list');
    if (listEl) {
      listEl.innerHTML = dishes.filter(d => d.ubicacion).map(d => `
        <div class="map-list-item" onclick="MapModule.highlightMarker(${d.id})">
          <img src="${d.imagen}" alt="${d.imagenAlt}" loading="lazy">
          <div class="map-item-info">
            <strong>${d.nombre}</strong>
            <span><i class="fas fa-map-marker-alt"></i> ${d.ubicacion.nombre}</span>
            <small>${d.ubicacion.direccion}</small>
          </div>
          <i class="fas fa-chevron-right"></i>
        </div>
      `).join('');
    }

    setTimeout(async () => {
      await window.MapModule.initMainMap('main-map');
    }, 100);
  }

  // ── MULTIMEDIA ────────────────────────────────────────────────────────────
  async function _renderMedia() {
    const media = await window.DB.getMedia();

    _getMain().innerHTML = `
      <div class="page-content">
        <div class="catalog-header">
          <h1 class="page-title"><i class="fas fa-photo-film"></i> Biblioteca Multimedia</h1>
          <p class="page-subtitle">Imágenes, videos y testimonios de la gastronomía caleña</p>
        </div>

        <div class="media-tabs">
          <button class="media-tab active" onclick="App.filterMedia('all', this)">
            <i class="fas fa-th"></i> Todo
          </button>
          <button class="media-tab" onclick="App.filterMedia('imagen', this)">
            <i class="fas fa-image"></i> Imágenes
          </button>
          <button class="media-tab" onclick="App.filterMedia('video', this)">
            <i class="fas fa-video"></i> Videos
          </button>
          <button class="media-tab" onclick="App.filterMedia('audio', this)">
            <i class="fas fa-microphone"></i> Audios
          </button>
        </div>

        <div class="media-grid" id="media-grid">
          ${media.map(item => _renderMediaCard(item)).join('')}
        </div>
      </div>
    `;

    _state.mediaItems = media;
  }

  function filterMedia(type, btn) {
    document.querySelectorAll('.media-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const grid = document.getElementById('media-grid');
    const items = type === 'all'
      ? _state.mediaItems
      : _state.mediaItems.filter(m => m.tipo === type);

    grid.innerHTML = items.map(item => _renderMediaCard(item)).join('');

    if (window.gsap) {
      gsap.fromTo('.media-card', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05 });
    }
  }

  function _renderMediaCard(item) {
    if (item.tipo === 'imagen') {
      return `
        <div class="media-card" role="article">
          <div class="media-card-image">
            <img src="${item.url}" alt="${item.alt}" loading="lazy"
                 onclick="App.openLightbox('${item.url}', '${item.alt.replace(/'/g, "\\'")}')">
            <div class="media-overlay">
              <i class="fas fa-expand"></i>
            </div>
          </div>
          <div class="media-card-info">
            <span class="media-type-badge img-badge"><i class="fas fa-image"></i> Imagen</span>
            <h4>${item.titulo}</h4>
            <p>${item.descripcion}</p>
          </div>
        </div>
      `;
    }
    if (item.tipo === 'video') {
      return `
        <div class="media-card media-card-wide" role="article">
          <div class="media-card-video">
            <iframe src="${item.url}" title="${item.alt}" allowfullscreen
                    loading="lazy" frameborder="0"></iframe>
          </div>
          <div class="media-card-info">
            <span class="media-type-badge vid-badge"><i class="fas fa-video"></i> Video</span>
            <h4>${item.titulo}</h4>
            <p>${item.descripcion}</p>
          </div>
        </div>
      `;
    }
    if (item.tipo === 'audio') {
      return `
        <div class="media-card" role="article">
          <div class="audio-player-card">
            <div class="audio-icon-big"><i class="fas fa-microphone-lines"></i></div>
            <div class="audio-waveform">
              ${Array.from({length: 20}, () => 
                `<span style="height:${Math.random()*30+10}px"></span>`
              ).join('')}
            </div>
            <p class="audio-label">Testimonio Oral</p>
            <small class="audio-note"><i class="fas fa-info-circle"></i> Audio ilustrativo — archivo de archivo cultural</small>
          </div>
          <div class="media-card-info">
            <span class="media-type-badge aud-badge"><i class="fas fa-microphone"></i> Audio</span>
            <h4>${item.titulo}</h4>
            <p>${item.descripcion}</p>
          </div>
        </div>
      `;
    }
    return '';
  }

  function openLightbox(url, alt) {
    const lb = document.createElement('div');
    lb.className = 'lightbox-overlay';
    lb.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" onclick="this.closest('.lightbox-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
        <img src="${url}" alt="${alt}">
        <p class="lightbox-caption">${alt}</p>
      </div>
    `;
    lb.addEventListener('click', e => { if (e.target === lb) lb.remove(); });
    document.body.appendChild(lb);
    if (window.gsap) gsap.fromTo('.lightbox-content', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 });
  }

  // ── FAVORITOS ──────────────────────────────────────────────────────────────
  async function _renderFavorites() {
    const user = window.Auth.getCurrentUser();
    if (!user) { navigate('home'); return; }

    const favIds = window.Auth.getFavorites();
    const allDishes = await window.DB.getDishes();
    const favDishes = allDishes.filter(d => favIds.includes(d.id));

    _getMain().innerHTML = `
      <div class="page-content">
        <div class="catalog-header">
          <h1 class="page-title"><i class="fas fa-heart"></i> Mis Favoritos</h1>
          <p class="page-subtitle">Tus platos guardados, ${user.nombre}</p>
        </div>
        ${favDishes.length
          ? `<div class="dishes-grid">${favDishes.map(d => _renderDishCard(d)).join('')}</div>`
          : `<div class="empty-state">
               <i class="fas fa-heart-crack"></i>
               <h3>Sin favoritos aún</h3>
               <p>Explora el catálogo y guarda tus platos preferidos.</p>
               <button onclick="App.navigate('catalogo')" class="btn-reset">Explorar Catálogo</button>
             </div>`
        }
      </div>
    `;
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  async function _renderAdmin() {
    _getMain().innerHTML = `<div class="page-content" id="admin-panel"></div>`;
    await window.Admin.render();
  }

  // ── DETALLE DE PLATO ──────────────────────────────────────────────────────
  async function _renderDishDetail(params) {
    const id = params.dishId;
    const dish = await window.DB.getDishById(id);
    if (!dish) { navigate('catalogo'); return; }

    const isFav = window.Auth.isFavorite(dish.id);

    _getMain().innerHTML = `
      <div class="page-content dish-detail">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="Navegación de migas de pan">
          <button onclick="App.navigate('catalogo')" class="breadcrumb-link">
            <i class="fas fa-arrow-left"></i> Catálogo
          </button>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">${dish.nombre}</span>
        </nav>

        <!-- Hero del plato -->
        <div class="dish-hero">
          <div class="dish-hero-image">
            <img src="${dish.imagen}" alt="${dish.imagenAlt}" loading="lazy">
            <div class="dish-hero-overlay">
              <span class="dish-cat-badge">${dish.categoria}</span>
            </div>
          </div>
          <div class="dish-hero-info">
            <h1 class="dish-title">${dish.nombre}</h1>
            <p class="dish-subtitle">${dish.descripcionCorta}</p>
            
            <div class="dish-meta">
              <div class="meta-item">
                <i class="fas fa-star"></i>
                <span>${dish.rating || 'N/A'} / 5.0</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>${dish.tiempoCoccion}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-signal"></i>
                <span>${dish.dificultad}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-users"></i>
                <span>${dish.porciones} porciones</span>
              </div>
            </div>

            <div class="dish-actions">
              <button class="btn-fav ${isFav ? 'active' : ''}" id="btn-fav-${dish.id}"
                      onclick="App.toggleFavorite(${dish.id})"
                      aria-label="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                <i class="fas fa-heart"></i>
                ${isFav ? 'Guardado' : 'Guardar'}
              </button>
              <button class="btn-share" onclick="App.shareToast('${dish.nombre}')">
                <i class="fas fa-share-nodes"></i> Compartir
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs de contenido -->
        <div class="detail-tabs">
          <button class="detail-tab active" data-tab="historia" onclick="App.switchTab('historia', this)">
            <i class="fas fa-book-open"></i> Historia
          </button>
          <button class="detail-tab" data-tab="ingredientes" onclick="App.switchTab('ingredientes', this)">
            <i class="fas fa-list"></i> Ingredientes
          </button>
          <button class="detail-tab" data-tab="preparacion" onclick="App.switchTab('preparacion', this)">
            <i class="fas fa-kitchen-set"></i> Preparación
          </button>
          <button class="detail-tab" data-tab="multimedia" onclick="App.switchTab('multimedia', this)">
            <i class="fas fa-photo-film"></i> Multimedia
          </button>
          <button class="detail-tab" data-tab="ubicacion" onclick="App.switchTab('ubicacion', this)">
            <i class="fas fa-map-pin"></i> Ubicación
          </button>
        </div>

        <!-- Contenido de tabs -->
        <div class="detail-content">
          <!-- Historia -->
          <div class="tab-panel active" id="tab-historia">
            <div class="historia-content">
              <div class="historia-icon"><i class="fas fa-landmark"></i></div>
              <p>${dish.historia || 'Historia no disponible.'}</p>
            </div>
          </div>

          <!-- Ingredientes -->
          <div class="tab-panel" id="tab-ingredientes">
            <div class="ingredientes-grid">
              ${(dish.ingredientes || []).map(grupo => `
                <div class="ingrediente-grupo">
                  <h4 class="grupo-title">
                    <i class="fas fa-chevron-right"></i> ${grupo.grupo}
                  </h4>
                  <ul class="ingredientes-list">
                    ${grupo.items.map(item => `
                      <li class="ingrediente-item">
                        <span class="item-dot"></span>
                        ${item}
                      </li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Preparación -->
          <div class="tab-panel" id="tab-preparacion">
            <div class="preparacion-steps">
              ${(dish.preparacion || []).map(step => `
                <div class="step-card">
                  <div class="step-number">${step.paso}</div>
                  <div class="step-content">
                    <h4 class="step-title">${step.titulo}</h4>
                    <p class="step-desc">${step.descripcion}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Multimedia -->
          <div class="tab-panel" id="tab-multimedia">
            <div class="dish-media">
              ${dish.video ? `
                <div class="dish-video-container">
                  <h3><i class="fas fa-video"></i> Video del Plato</h3>
                  <div class="video-wrapper">
                    <iframe src="${dish.video}" title="Video de ${dish.nombre}"
                            allowfullscreen frameborder="0" loading="lazy"></iframe>
                  </div>
                </div>
              ` : ''}
              ${dish.audio ? `
                <div class="dish-audio-container">
                  <h3><i class="fas fa-microphone"></i> Testimonio Oral</h3>
                  <audio controls class="dish-audio">
                    <source src="${dish.audio}" type="audio/mpeg">
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              ` : `
                <div class="audio-placeholder">
                  <i class="fas fa-microphone-slash"></i>
                  <p>Testimonio oral en proceso de digitalización</p>
                </div>
              `}
              <div class="dish-gallery">
                <h3><i class="fas fa-images"></i> Galería</h3>
                <div class="gallery-grid">
                  <img src="${dish.imagen}" alt="${dish.imagenAlt}" loading="lazy"
                       onclick="App.openLightbox('${dish.imagen}', '${dish.imagenAlt.replace(/'/g, "\\'")}')">
                </div>
              </div>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="tab-panel" id="tab-ubicacion">
            <div class="dish-ubicacion">
              ${dish.ubicacion ? `
                <div class="ubicacion-info">
                  <h3><i class="fas fa-location-dot"></i> ${dish.ubicacion.nombre}</h3>
                  <p class="ubicacion-dir">
                    <i class="fas fa-road"></i> ${dish.ubicacion.direccion}
                  </p>
                  <p class="ubicacion-desc">${dish.ubicacion.descripcion}</p>
                </div>
                <div id="dish-map" class="dish-map" role="application" 
                     aria-label="Mapa de ubicación de ${dish.nombre}"></div>
              ` : '<p class="no-ubicacion">Ubicación no disponible</p>'}
            </div>
          </div>
        </div>

        <!-- Tags -->
        ${dish.tags?.length ? `
          <div class="dish-tags">
            ${dish.tags.map(tag => `<span class="dish-tag"># ${tag}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;

    // Iniciar mapa de ubicación cuando se active el tab
    if (dish.ubicacion) {
      setTimeout(() => {
        _state.detailMap = window.MapModule.initDishMap('dish-map', dish);
      }, 100);
    }
  }

  function switchTab(tabName, btn) {
    document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`tab-${tabName}`);
    if (panel) {
      panel.classList.add('active');
      if (window.gsap) gsap.fromTo(panel, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.3 });
    }

    // Re-iniciar mapa si es tab de ubicación
    if (tabName === 'ubicacion' && !_state.detailMap) {
      const dishId = _state.activeDish?.id;
      if (dishId) {
        window.DB.getDishById(dishId).then(dish => {
          if (dish?.ubicacion) {
            _state.detailMap = window.MapModule.initDishMap('dish-map', dish);
          }
        });
      }
    }
  }

  // ── Tarjeta de plato ──────────────────────────────────────────────────────
  function _renderDishCard(dish) {
    const isFav = window.Auth.isFavorite(dish.id);
    return `
      <article class="dish-card" role="article" aria-label="Plato: ${dish.nombre}">
        <div class="dish-card-image">
          <img src="${dish.imagen}" alt="${dish.imagenAlt}" loading="lazy">
          ${dish.destacado ? '<div class="featured-ribbon"><i class="fas fa-star"></i></div>' : ''}
          <button class="card-fav-btn ${isFav ? 'active' : ''}" 
                  onclick="App.toggleFavorite(${dish.id}); event.stopPropagation();"
                  aria-label="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <div class="dish-card-body" onclick="App.navigate('dish', {dishId: ${dish.id}})">
          <div class="card-category">${dish.categoria}</div>
          <h3 class="card-title">${dish.nombre}</h3>
          <p class="card-desc">${dish.descripcionCorta}</p>
          <div class="card-footer">
            <div class="card-meta">
              <span><i class="fas fa-clock"></i> ${dish.tiempoCoccion}</span>
              <span><i class="fas fa-signal"></i> ${dish.dificultad}</span>
            </div>
            <div class="card-rating">
              <i class="fas fa-star"></i>
              <span>${dish.rating || 'N/A'}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // ── Favoritos ─────────────────────────────────────────────────────────────
  async function toggleFavorite(dishId) {
    if (!window.Auth.isAuthenticated()) {
      _showAuthModal('login');
      return;
    }
    const favs = await window.Auth.toggleFavorite(dishId);
    const isFav = favs.includes(dishId);

    // Actualizar botones en el DOM
    document.querySelectorAll(`[id="btn-fav-${dishId}"], .card-fav-btn`).forEach(btn => {
      if (btn.closest(`[onclick*="${dishId}"]`) || btn.id === `btn-fav-${dishId}`) {
        btn.classList.toggle('active', isFav);
      }
    });

    // Actualizar todas las tarjetas
    document.querySelectorAll('.dish-card').forEach(card => {
      const favBtn = card.querySelector('.card-fav-btn');
      if (favBtn && card.querySelector(`[onclick*="navigateToDish(${dishId})"], .dish-card-body[onclick*="${dishId}"]`)) {
        favBtn.classList.toggle('active', isFav);
      }
    });
  }

  function shareToast(name) {
    Admin.showToast(`¡Enlace de "${name}" copiado al portapapeles!`, 'success');
  }

  // ── Auth Modal ────────────────────────────────────────────────────────────
  function _showAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.add('active');
    _renderAuthForm(mode);
    document.body.style.overflow = 'hidden';
  }

  function _renderAuthForm(mode) {
    const container = document.getElementById('auth-modal-body');
    if (!container) return;

    if (mode === 'login') {
      container.innerHTML = `
        <div class="auth-header">
          <div class="auth-logo"><i class="fas fa-bowl-food"></i></div>
          <h2>Bienvenido de vuelta</h2>
          <p>Inicia sesión para guardar tus favoritos</p>
        </div>
        <form class="auth-form" onsubmit="App.handleLogin(event)">
          <div class="auth-field">
            <label for="login-email"><i class="fas fa-envelope"></i> Correo electrónico</label>
            <input type="email" id="login-email" required placeholder="tu@correo.com"
                   autocomplete="email" aria-required="true">
          </div>
          <div class="auth-field">
            <label for="login-password"><i class="fas fa-lock"></i> Contraseña</label>
            <div class="password-wrapper">
              <input type="password" id="login-password" required placeholder="••••••••"
                     autocomplete="current-password">
              <button type="button" class="toggle-pwd" onclick="App.togglePassword('login-password')">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <label class="remember-label">
            <input type="checkbox" id="login-remember">
            <span>Recordarme</span>
          </label>
          <div class="auth-error" id="login-error"></div>
          <button type="submit" class="btn-auth-submit">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
          </button>
        </form>
        <div class="auth-divider">
          <span>¿Nuevo aquí?</span>
        </div>
        <button class="btn-auth-switch" onclick="App.switchAuthMode('register')">
          <i class="fas fa-user-plus"></i> Crear cuenta gratuita
        </button>
        <div class="demo-credentials">
          <p><strong>Demo Admin:</strong> admin@sabores.com / Admin2024!</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="auth-header">
          <div class="auth-logo"><i class="fas fa-utensils"></i></div>
          <h2>Únete a Sabores de Cali</h2>
          <p>Crea tu cuenta y empieza a explorar</p>
        </div>
        <form class="auth-form" onsubmit="App.handleRegister(event)">
          <div class="auth-field">
            <label for="reg-nombre"><i class="fas fa-user"></i> Nombre completo</label>
            <input type="text" id="reg-nombre" required placeholder="Tu nombre" aria-required="true">
          </div>
          <div class="auth-field">
            <label for="reg-email"><i class="fas fa-envelope"></i> Correo electrónico</label>
            <input type="email" id="reg-email" required placeholder="tu@correo.com">
          </div>
          <div class="auth-field">
            <label for="reg-password"><i class="fas fa-lock"></i> Contraseña</label>
            <div class="password-wrapper">
              <input type="password" id="reg-password" required placeholder="Mín. 8 caracteres">
              <button type="button" class="toggle-pwd" onclick="App.togglePassword('reg-password')">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <small class="pwd-hint">Mínimo 8 caracteres, una mayúscula y un número.</small>
          </div>
          <div class="auth-field">
            <label for="reg-confirm"><i class="fas fa-shield-check"></i> Confirmar contraseña</label>
            <input type="password" id="reg-confirm" required placeholder="Repite tu contraseña">
          </div>
          <div class="auth-error" id="register-error"></div>
          <button type="submit" class="btn-auth-submit">
            <i class="fas fa-user-plus"></i> Crear Cuenta
          </button>
        </form>
        <div class="auth-divider"><span>¿Ya tienes cuenta?</span></div>
        <button class="btn-auth-switch" onclick="App.switchAuthMode('login')">
          <i class="fas fa-sign-in-alt"></i> Iniciar sesión
        </button>
      `;
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    const errEl = document.getElementById('login-error');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    errEl.textContent = '';

    try {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const remember = document.getElementById('login-remember').checked;
      await window.Auth.login(email, password, remember);
      closeAuthModal();
      _updateAuthUI();
    } catch (err) {
      errEl.textContent = err.message;
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    const errEl = document.getElementById('register-error');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
    errEl.textContent = '';

    try {
      const nombre = document.getElementById('reg-nombre').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      await window.Auth.register(nombre, email, password, confirm);
      closeAuthModal();
      _updateAuthUI();
    } catch (err) {
      errEl.innerHTML = err.message.replace(/\n/g, '<br>');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-user-plus"></i> Crear Cuenta';
    }
  }

  function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchAuthMode(mode) { _renderAuthForm(mode); }

  function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  function _updateAuthUI() {
    const user = window.Auth.getCurrentUser();
    const loginBtn = document.getElementById('nav-login-btn');
    const userMenu = document.getElementById('nav-user-menu');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const adminLink = document.getElementById('nav-admin-link');

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (userAvatar) userAvatar.textContent = user.avatar;
      if (userName) userName.textContent = user.nombre.split(' ')[0];
      if (adminLink) adminLink.style.display = user.rol === 'admin' ? 'block' : 'none';
    } else {
      if (loginBtn) loginBtn.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
      if (adminLink) adminLink.style.display = 'none';
    }
  }

  function logout() {
    window.Auth.logout();
    _updateAuthUI();
    navigate('home');
  }

  // ── p5.js Animación ───────────────────────────────────────────────────────
  function _initP5Animation() {
    const container = document.getElementById('p5-canvas-container');
    if (!container || !window.p5) return;

    const sketch = (p) => {
      const particles = [];
      const N = 60;

      class Particle {
        constructor() { this.reset(); }
        reset() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.size = p.random(2, 8);
          this.speedX = p.random(-0.5, 0.5);
          this.speedY = p.random(-1, -0.3);
          this.alpha = p.random(80, 180);
          this.color = p.random([
            [232, 72, 28], [241, 143, 1], [162, 59, 114], [46, 134, 171]
          ]);
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.alpha -= 0.3;
          if (this.y < 0 || this.alpha <= 0) this.reset();
        }
        draw() {
          p.noStroke();
          p.fill(this.color[0], this.color[1], this.color[2], this.alpha);
          p.ellipse(this.x, this.y, this.size);
        }
      }

      p.setup = () => {
        const cnv = p.createCanvas(container.offsetWidth, container.offsetHeight);
        cnv.parent(container);
        for (let i = 0; i < N; i++) particles.push(new Particle());
      };

      p.draw = () => {
        p.clear();
        particles.forEach(pt => { pt.update(); pt.draw(); });
      };

      p.windowResized = () => {
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      };
    };

    _state.p5Instance = new window.p5(sketch);
  }

  function _initParallax() {
  const hero = document.getElementById('hero-section');

  const handleScroll = () => {
    const scroll = window.scrollY;

    if (hero) {
      hero.style.transform = `translateY(${scroll * 0.05}px)`;
      hero.style.opacity = 1 - scroll / 600;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}


  // ── Inicialización ─────────────────────────────────────────────────────────
  async function init() {
    // Escuchar cambios de auth
    window.Auth.onChange((event) => {
      _updateAuthUI();
      if (event === 'logout' && (_state.currentView === 'admin' || _state.currentView === 'favoritos')) {
        navigate('home');
      }
    });

    // Navegación desde navbar
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        navigate(el.dataset.view);
      });
    });

    // Cerrar modal auth con overlay
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
      authModal.addEventListener('click', e => {
        if (e.target === authModal) closeAuthModal();
      });
    }

    // Toggle mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuToggle.querySelector('i').className = 
          navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
      });
    }

    _updateAuthUI();
    await navigate('home');
  }

  // ── Exponer públicamente ───────────────────────────────────────────────────
  return {
    init,
    navigate,
    navigateToDish,
    handleSearch,
    clearSearch,
    filterByCategory,
    filterMedia,
    openLightbox,
    toggleFavorite,
    shareToast,
    switchTab,
    handleLogin,
    handleRegister,
    closeAuthModal,
    switchAuthMode,
    togglePassword,
    logout,
    showAuthModal: _showAuthModal
  };
})();

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());