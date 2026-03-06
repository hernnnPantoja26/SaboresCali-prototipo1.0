/**
 * auth.js - Módulo de Autenticación y Gestión de Sesión
 * Arquitectura: Capa de Servicio (simulación servidor de autenticación)
 * Patrón: Service + Observer
 */

const Auth = (() => {
  'use strict';

  const SESSION_KEY = 'sabores_cali_session';
  const REMEMBER_KEY = 'sabores_cali_remember';

  // ── Estado interno ─────────────────────────────────────────────────────────
  let _currentUser = null;
  let _listeners = [];

  // ── Validaciones ──────────────────────────────────────────────────────────
  const _validators = {
    email: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    password: pwd => pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd),
    nombre: name => name.trim().length >= 3
  };

  const _sanitize = str => str.trim().replace(/[<>'"]/g, '');

  // ── Manejo de sesión ──────────────────────────────────────────────────────
  const _saveSession = (user, remember = false) => {
    const session = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      avatar: user.avatar,
      favoritos: user.favoritos || [],
      loginTime: Date.now()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify(session));
    }
    _currentUser = session;
    _notifyListeners('login', session);
  };

  const _clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    _currentUser = null;
    _notifyListeners('logout', null);
  };

  const _loadSession = () => {
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY) ||
                          localStorage.getItem(REMEMBER_KEY);
      if (sessionData) {
        _currentUser = JSON.parse(sessionData);
        return _currentUser;
      }
    } catch (e) {
      _clearSession();
    }
    return null;
  };

  // ── Observer ──────────────────────────────────────────────────────────────
  const _notifyListeners = (event, data) => {
    _listeners.forEach(fn => {
      try { fn(event, data); } catch (e) { /* silent */ }
    });
  };

  // ── Inicialización ────────────────────────────────────────────────────────
  _loadSession();

  // ── API Pública ───────────────────────────────────────────────────────────
  return {
    // Estado
    isAuthenticated: () => _currentUser !== null,
    isAdmin: () => _currentUser?.rol === 'admin',
    getCurrentUser: () => _currentUser ? { ..._currentUser } : null,

    // Observer
    onChange(callback) {
      _listeners.push(callback);
      return () => { _listeners = _listeners.filter(fn => fn !== callback); };
    },

    // Login
    async login(email, password, remember = false) {
      if (!email || !password) {
        throw new Error('Correo y contraseña son requeridos.');
      }
      if (!_validators.email(email)) {
        throw new Error('El correo electrónico no es válido.');
      }

      const user = await window.DB.findUserByEmail(_sanitize(email));
      if (!user) {
        throw new Error('No existe una cuenta con este correo.');
      }
      if (user.password !== btoa(password)) {
        throw new Error('Contraseña incorrecta.');
      }

      _saveSession(user, remember);
      return { ..._currentUser };
    },

    // Registro
    async register(nombre, email, password, confirmPassword) {
      const errors = [];

      if (!_validators.nombre(nombre)) errors.push('El nombre debe tener al menos 3 caracteres.');
      if (!_validators.email(email)) errors.push('El correo electrónico no es válido.');
      if (!_validators.password(password)) {
        errors.push('La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.');
      }
      if (password !== confirmPassword) errors.push('Las contraseñas no coinciden.');

      if (errors.length > 0) throw new Error(errors.join('\n'));

      const existing = await window.DB.findUserByEmail(_sanitize(email));
      if (existing) throw new Error('Ya existe una cuenta con este correo.');

      const newUser = await window.DB.createUser({
        nombre: _sanitize(nombre),
        email: _sanitize(email),
        password
      });

      _saveSession({ ...newUser, favoritos: [] });
      return { ..._currentUser };
    },

    // Logout
    logout() {
      _clearSession();
    },

    // Favoritos
    async toggleFavorite(dishId) {
      if (!_currentUser) throw new Error('Debes iniciar sesión para guardar favoritos.');
      const favs = [...(_currentUser.favoritos || [])];
      const idx = favs.indexOf(dishId);
      if (idx === -1) {
        favs.push(dishId);
      } else {
        favs.splice(idx, 1);
      }
      await window.DB.updateUserFavorites(_currentUser.id, favs);
      _currentUser.favoritos = favs;

      // Sincronizar sesión
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        session.favoritos = favs;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
      const remembered = localStorage.getItem(REMEMBER_KEY);
      if (remembered) {
        const session = JSON.parse(remembered);
        session.favoritos = favs;
        localStorage.setItem(REMEMBER_KEY, JSON.stringify(session));
      }

      _notifyListeners('favoritesUpdate', favs);
      return favs;
    },

    isFavorite(dishId) {
      return (_currentUser?.favoritos || []).includes(dishId);
    },

    getFavorites() {
      return [...(_currentUser?.favoritos || [])];
    }
  };
})();

window.Auth = Auth;