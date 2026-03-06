/**
 * map.js - Módulo de Mapa Interactivo con Leaflet.js
 * Arquitectura: Capa de Presentación (componente de visualización geoespacial)
 * Patrón: Module + Singleton
 */

const MapModule = (() => {
  'use strict';

  let _map = null;
  let _markers = [];
  let _activeMarker = null;

  // ── Configuración de mapa ─────────────────────────────────────────────────
  const CALI_CENTER = [3.4516, -76.5320];
  const DEFAULT_ZOOM = 13;

  // Icono personalizado para marcadores
  const _createCustomIcon = (color = '#E8481C', label = '') => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
          </filter>
        </defs>
        <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.059 27.941 0 18 0z" 
              fill="${color}" filter="url(#shadow)"/>
        <circle cx="18" cy="18" r="9" fill="white" opacity="0.9"/>
        <text x="18" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="${color}">${label}</text>
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: 'custom-marker',
      iconSize: [36, 48],
      iconAnchor: [18, 48],
      popupAnchor: [0, -48]
    });
  };

  // Colores por categoría
  const _categoryColors = {
    "Plato Fuerte": "#E8481C",
    "Bebida": "#2E86AB",
    "Postre": "#A23B72",
    "Entrada": "#F18F01",
    "Panadería": "#C73E1D"
  };

  // ── Inicialización del mapa ────────────────────────────────────────────────
  const _initMap = (containerId) => {
    if (_map) {
      _map.remove();
      _map = null;
    }

    const container = document.getElementById(containerId);
    if (!container) return null;

    _map = L.map(containerId, {
      center: CALI_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true
    });

    // Tiles oscuros y estéticos
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(_map);

    // Añadir control de escala
    L.control.scale({ imperial: false }).addTo(_map);

    return _map;
  };

  // ── Marcadores ────────────────────────────────────────────────────────────
  const _addMarker = (dish) => {
    if (!_map || !dish.ubicacion) return null;

    const { lat, lng, nombre, direccion, descripcion } = dish.ubicacion;
    const color = _categoryColors[dish.categoria] || "#E8481C";
    const label = dish.nombre.charAt(0);
    const icon = _createCustomIcon(color, label);

    const marker = L.marker([lat, lng], { icon })
      .bindPopup(`
        <div class="map-popup">
          <div class="map-popup-header" style="background:${color}">
            <span class="map-popup-category">${dish.categoria}</span>
          </div>
          <div class="map-popup-body">
            <h4 class="map-popup-title">${dish.nombre}</h4>
            <p class="map-popup-location">
              <i class="fas fa-map-marker-alt"></i> ${nombre}
            </p>
            <p class="map-popup-address">
              <i class="fas fa-road"></i> ${direccion}
            </p>
            <p class="map-popup-desc">${descripcion}</p>
            <button class="btn-popup" onclick="App.navigateToDish(${dish.id})">
              <i class="fas fa-eye"></i> Ver plato
            </button>
          </div>
        </div>
      `, {
        maxWidth: 260,
        className: 'custom-popup'
      })
      .addTo(_map);

    marker._dishId = dish.id;
    marker._color = color;
    _markers.push(marker);
    return marker;
  };

  // ── Leyenda ───────────────────────────────────────────────────────────────
  const _addLegend = () => {
    if (!_map) return;
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <h6><i class="fas fa-list"></i> Categorías</h6>
        ${Object.entries(_categoryColors).map(([cat, color]) => `
          <div class="legend-item">
            <span class="legend-dot" style="background:${color}"></span>
            <span>${cat}</span>
          </div>
        `).join('')}
      `;
      return div;
    };
    legend.addTo(_map);
  };

  // ── API Pública ───────────────────────────────────────────────────────────
  return {
    // Mapa principal (catálogo)
    async initMainMap(containerId) {
      const map = _initMap(containerId);
      if (!map) return;

      const dishes = await window.DB.getDishes();
      _markers = [];

      dishes.forEach(dish => {
        if (dish.ubicacion) _addMarker(dish);
      });

      _addLegend();

      // Ajustar vista a todos los marcadores
      if (_markers.length > 0) {
        const group = L.featureGroup(_markers);
        _map.fitBounds(group.getBounds().pad(0.1));
      }

      return map;
    },

    // Mapa de detalle de plato
    initDishMap(containerId, dish) {
      if (!dish?.ubicacion) return;
      const { lat, lng } = dish.ubicacion;

      const map = L.map(containerId, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap | © CARTO',
        maxZoom: 19
      }).addTo(map);

      const color = _categoryColors[dish.categoria] || "#E8481C";
      const icon = _createCustomIcon(color, dish.nombre.charAt(0));

      L.marker([lat, lng], { icon })
        .bindPopup(`
          <div class="map-popup">
            <div class="map-popup-body">
              <h4 class="map-popup-title">${dish.ubicacion.nombre}</h4>
              <p class="map-popup-address"><i class="fas fa-road"></i> ${dish.ubicacion.direccion}</p>
              <p class="map-popup-desc">${dish.ubicacion.descripcion}</p>
            </div>
          </div>
        `, { maxWidth: 240, className: 'custom-popup' })
        .addTo(map)
        .openPopup();

      // Círculo de radio
      L.circle([lat, lng], {
        radius: 300,
        color,
        fillColor: color,
        fillOpacity: 0.08,
        weight: 1
      }).addTo(map);

      return map;
    },

    // Resaltar marcador por dish id
    highlightMarker(dishId) {
      _markers.forEach(m => {
        if (m._dishId === dishId) {
          m.openPopup();
          _map?.setView(m.getLatLng(), 15, { animate: true });
        }
      });
    },

    // Destruir mapa
    destroy() {
      if (_map) {
        _map.remove();
        _map = null;
        _markers = [];
      }
    },

    getMap: () => _map
  };
})();

window.MapModule = MapModule;