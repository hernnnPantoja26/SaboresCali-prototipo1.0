/**
 * admin.js - Panel de Administración CRUD
 * Arquitectura: Capa de Presentación + Servicio (simulación API CRUD)
 * Patrón: MVC + Command
 */

const Admin = (() => {
  'use strict';

  let _editingId = null;
  let _dishesCache = [];

  // ── Renderizado del panel ─────────────────────────────────────────────────
  const render = async () => {
    const container = document.getElementById('admin-panel');
    if (!container) return;

    const stats = await window.DB.getStats();
    _dishesCache = await window.DB.getDishes();

    container.innerHTML = `
      <div class="admin-wrapper">
        <!-- Header -->
        <div class="admin-header">
          <div class="admin-title">
            <i class="fas fa-shield-halved"></i>
            <div>
              <h2>Panel Administrativo</h2>
              <p>Gestión de contenidos — Sabores de Cali</p>
            </div>
          </div>
          <button class="btn-admin-new" onclick="Admin.openForm()">
            <i class="fas fa-plus"></i> Nuevo Plato
          </button>
        </div>

        <!-- Estadísticas -->
        <div class="admin-stats">
          <div class="stat-card">
            <div class="stat-icon" style="background:#E8481C20;color:#E8481C">
              <i class="fas fa-utensils"></i>
            </div>
            <div class="stat-info">
              <span class="stat-number">${stats.totalDishes}</span>
              <span class="stat-label">Platos</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#2E86AB20;color:#2E86AB">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <span class="stat-number">${stats.totalUsers}</span>
              <span class="stat-label">Usuarios</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#A23B7220;color:#A23B72">
              <i class="fas fa-photo-film"></i>
            </div>
            <div class="stat-info">
              <span class="stat-number">${stats.totalMedia}</span>
              <span class="stat-label">Multimedia</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#F18F0120;color:#F18F01">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-info">
              <span class="stat-number">${stats.featured}</span>
              <span class="stat-label">Destacados</span>
            </div>
          </div>
        </div>

        <!-- Tabla de platos -->
        <div class="admin-table-wrapper">
          <div class="admin-table-header">
            <h3><i class="fas fa-list"></i> Catálogo de Platos</h3>
            <div class="admin-search">
              <i class="fas fa-search"></i>
              <input type="text" id="admin-search" placeholder="Buscar plato..." 
                     oninput="Admin.filterTable(this.value)">
            </div>
          </div>
          <div class="table-responsive">
            <table class="admin-table" id="dishes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Plato</th>
                  <th>Categoría</th>
                  <th>Dificultad</th>
                  <th>Rating</th>
                  <th>Destacado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="admin-dishes-body">
                ${_renderTableRows(_dishesCache)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal de formulario -->
      <div class="admin-modal-overlay" id="admin-modal" onclick="Admin.closeFormOnOverlay(event)">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h3 id="modal-title"><i class="fas fa-plus"></i> Nuevo Plato</h3>
            <button class="modal-close-btn" onclick="Admin.closeForm()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="admin-modal-body" id="admin-form-container"></div>
        </div>
      </div>

      <!-- Modal de confirmación eliminación -->
      <div class="confirm-overlay" id="confirm-modal">
        <div class="confirm-box">
          <div class="confirm-icon"><i class="fas fa-triangle-exclamation"></i></div>
          <h4>¿Eliminar este plato?</h4>
          <p>Esta acción no se puede deshacer.</p>
          <div class="confirm-actions">
            <button class="btn-confirm-cancel" onclick="Admin.closeConfirm()">Cancelar</button>
            <button class="btn-confirm-delete" id="confirm-delete-btn">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  };

  const _renderTableRows = (dishes) => {
    if (!dishes.length) return `<tr><td colspan="7" class="empty-table">No hay platos registrados</td></tr>`;
    return dishes.map(d => `
      <tr data-id="${d.id}">
        <td><span class="dish-id">#${d.id}</span></td>
        <td>
          <div class="dish-cell">
            <img src="${d.imagen}" alt="${d.imagenAlt}" class="dish-thumb" loading="lazy">
            <div>
              <strong>${d.nombre}</strong>
              <small>${d.tiempoCoccion}</small>
            </div>
          </div>
        </td>
        <td><span class="cat-badge cat-${d.categoria.replace(/\s/g, '-').toLowerCase()}">${d.categoria}</span></td>
        <td>${d.dificultad}</td>
        <td>
          <div class="rating-cell">
            <i class="fas fa-star" style="color:#F18F01"></i>
            <span>${d.rating || 'N/A'}</span>
          </div>
        </td>
        <td>
          <span class="featured-badge ${d.destacado ? 'yes' : 'no'}">
            ${d.destacado ? '<i class="fas fa-check"></i>' : '<i class="fas fa-minus"></i>'}
          </span>
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-action btn-view" onclick="App.navigateToDish(${d.id})" title="Ver">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action btn-edit" onclick="Admin.openForm(${d.id})" title="Editar">
              <i class="fas fa-pen"></i>
            </button>
            <button class="btn-action btn-delete" onclick="Admin.confirmDelete(${d.id})" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  // ── Formulario CRUD ──────────────────────────────────────────────────────
  const _renderForm = (dish = null) => {
    const isEdit = !!dish;
    return `
      <form class="admin-form" onsubmit="Admin.saveDish(event)">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="f-nombre"><i class="fas fa-tag"></i> Nombre del plato *</label>
            <input type="text" id="f-nombre" required placeholder="Ej: Sancocho de Gallina" 
                   value="${dish?.nombre || ''}">
          </div>
          <div class="form-group">
            <label for="f-categoria"><i class="fas fa-folder"></i> Categoría *</label>
            <select id="f-categoria" required>
              ${['Plato Fuerte','Bebida','Postre','Entrada','Panadería'].map(c => 
                `<option value="${c}" ${dish?.categoria === c ? 'selected' : ''}>${c}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="f-dificultad"><i class="fas fa-signal"></i> Dificultad</label>
            <select id="f-dificultad">
              ${['Fácil','Media','Difícil'].map(d => 
                `<option value="${d}" ${dish?.dificultad === d ? 'selected' : ''}>${d}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="f-tiempo"><i class="fas fa-clock"></i> Tiempo de cocción</label>
            <input type="text" id="f-tiempo" placeholder="Ej: 1.5 horas" value="${dish?.tiempoCoccion || ''}">
          </div>
          <div class="form-group">
            <label for="f-porciones"><i class="fas fa-users"></i> Porciones</label>
            <input type="number" id="f-porciones" min="1" max="50" placeholder="4" value="${dish?.porciones || 4}">
          </div>
          <div class="form-group full-width">
            <label for="f-descripcion"><i class="fas fa-align-left"></i> Descripción corta *</label>
            <textarea id="f-descripcion" required rows="3" 
                      placeholder="Descripción breve del plato...">${dish?.descripcionCorta || ''}</textarea>
          </div>
          <div class="form-group full-width">
            <label for="f-historia"><i class="fas fa-book-open"></i> Historia cultural</label>
            <textarea id="f-historia" rows="5" 
                      placeholder="Historia y contexto cultural del plato...">${dish?.historia || ''}</textarea>
          </div>
          <div class="form-group full-width">
            <label for="f-imagen"><i class="fas fa-image"></i> URL de Imagen</label>
            <div class="image-input-group">
              <input type="url" id="f-imagen" placeholder="https://..." value="${dish?.imagen || ''}"
                     oninput="Admin.previewImage(this.value)">
              <div class="image-preview" id="img-preview">
                ${dish?.imagen ? `<img src="${dish.imagen}" alt="preview">` : '<span><i class="fas fa-image"></i></span>'}
              </div>
            </div>
          </div>
          <div class="form-group full-width">
            <label for="f-alt"><i class="fas fa-universal-access"></i> Texto alternativo (accesibilidad)</label>
            <input type="text" id="f-alt" placeholder="Descripción de la imagen para accesibilidad"
                   value="${dish?.imagenAlt || ''}">
          </div>
          <div class="form-group full-width">
            <label for="f-video"><i class="fas fa-video"></i> URL de Video (YouTube embed)</label>
            <input type="url" id="f-video" placeholder="https://www.youtube.com/embed/..."
                   value="${dish?.video || ''}">
          </div>
          <div class="form-group full-width">
            <label><i class="fas fa-map-marker-alt"></i> Ubicación</label>
            <div class="form-grid">
              <div class="form-group">
                <input type="text" id="f-ubic-nombre" placeholder="Nombre del lugar"
                       value="${dish?.ubicacion?.nombre || ''}">
              </div>
              <div class="form-group">
                <input type="text" id="f-ubic-dir" placeholder="Dirección"
                       value="${dish?.ubicacion?.direccion || ''}">
              </div>
              <div class="form-group">
                <input type="number" id="f-ubic-lat" step="0.0001" placeholder="Latitud (ej: 3.4516)"
                       value="${dish?.ubicacion?.lat || ''}">
              </div>
              <div class="form-group">
                <input type="number" id="f-ubic-lng" step="0.0001" placeholder="Longitud (ej: -76.5320)"
                       value="${dish?.ubicacion?.lng || ''}">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="toggle-label">
              <input type="checkbox" id="f-destacado" ${dish?.destacado ? 'checked' : ''}>
              <span class="toggle-text"><i class="fas fa-star"></i> Plato Destacado</span>
            </label>
          </div>
          <div class="form-group">
            <label for="f-tags"><i class="fas fa-hashtag"></i> Etiquetas (separadas por coma)</label>
            <input type="text" id="f-tags" placeholder="tradicional, festivo, popular"
                   value="${dish?.tags?.join(', ') || ''}">
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-form-cancel" onclick="Admin.closeForm()">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button type="submit" class="btn-form-save">
            <i class="fas fa-save"></i> ${isEdit ? 'Actualizar Plato' : 'Crear Plato'}
          </button>
        </div>
      </form>
    `;
  };

  // ── API Pública ───────────────────────────────────────────────────────────
  return {
    render,

    async openForm(id = null) {
      _editingId = id;
      const modal = document.getElementById('admin-modal');
      const title = document.getElementById('modal-title');
      const container = document.getElementById('admin-form-container');

      let dish = null;
      if (id) {
        dish = await window.DB.getDishById(id);
        title.innerHTML = `<i class="fas fa-pen"></i> Editar Plato`;
      } else {
        title.innerHTML = `<i class="fas fa-plus"></i> Nuevo Plato`;
      }

      container.innerHTML = _renderForm(dish);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Animación
      if (window.gsap) {
        gsap.fromTo('.admin-modal', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    },

    closeForm() {
      const modal = document.getElementById('admin-modal');
      modal.classList.remove('active');
      document.body.style.overflow = '';
      _editingId = null;
    },

    closeFormOnOverlay(e) {
      if (e.target.id === 'admin-modal') this.closeForm();
    },

    previewImage(url) {
      const preview = document.getElementById('img-preview');
      if (!preview) return;
      if (url) {
        preview.innerHTML = `<img src="${url}" alt="preview" onerror="this.parentElement.innerHTML='<span><i class=\\"fas fa-image\\"></i></span>'">`;
      } else {
        preview.innerHTML = `<span><i class="fas fa-image"></i></span>`;
      }
    },

    async saveDish(e) {
      e.preventDefault();
      const btn = e.target.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

      const data = {
        nombre: document.getElementById('f-nombre').value.trim(),
        categoria: document.getElementById('f-categoria').value,
        subcategoria: document.getElementById('f-categoria').value,
        dificultad: document.getElementById('f-dificultad').value,
        tiempoCoccion: document.getElementById('f-tiempo').value.trim(),
        porciones: parseInt(document.getElementById('f-porciones').value) || 4,
        descripcionCorta: document.getElementById('f-descripcion').value.trim(),
        historia: document.getElementById('f-historia').value.trim(),
        imagen: document.getElementById('f-imagen').value.trim() ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
        imagenAlt: document.getElementById('f-alt').value.trim(),
        video: document.getElementById('f-video').value.trim(),
        audio: null,
        ubicacion: {
          nombre: document.getElementById('f-ubic-nombre').value.trim(),
          direccion: document.getElementById('f-ubic-dir').value.trim(),
          lat: parseFloat(document.getElementById('f-ubic-lat').value) || 3.4516,
          lng: parseFloat(document.getElementById('f-ubic-lng').value) || -76.5320,
          descripcion: ''
        },
        destacado: document.getElementById('f-destacado').checked,
        tags: document.getElementById('f-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        ingredientes: [],
        preparacion: []
      };

      try {
        if (_editingId) {
          await window.DB.updateDish(_editingId, data);
          Admin.showToast('Plato actualizado exitosamente', 'success');
        } else {
          await window.DB.createDish(data);
          Admin.showToast('Plato creado exitosamente', 'success');
        }
        Admin.closeForm();
        await Admin.render();
      } catch (err) {
        Admin.showToast('Error: ' + err.message, 'error');
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-save"></i> ${_editingId ? 'Actualizar' : 'Crear'} Plato`;
      }
    },

    confirmDelete(id) {
      const modal = document.getElementById('confirm-modal');
      modal.classList.add('active');
      document.getElementById('confirm-delete-btn').onclick = () => Admin.deleteDish(id);
    },

    closeConfirm() {
      document.getElementById('confirm-modal').classList.remove('active');
    },

    async deleteDish(id) {
      try {
        await window.DB.deleteDish(id);
        Admin.closeConfirm();
        await Admin.render();
        Admin.showToast('Plato eliminado correctamente', 'success');
      } catch (err) {
        Admin.showToast('Error al eliminar: ' + err.message, 'error');
      }
    },

    filterTable(query) {
      const rows = document.querySelectorAll('#admin-dishes-body tr[data-id]');
      const q = query.toLowerCase();
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    },

    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `admin-toast toast-${type}`;
      toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 10);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };
})();

window.Admin = Admin;