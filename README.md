# Caja de Música Interactiva

¡Bienvenido a la **Caja de Música Interactiva**!

Este proyecto es una aplicación web interactiva que visualiza música usando p5.js y p5.sound.js, con un diseño moderno y futurista en blanco y azul neón.

---

## 🎵 Características
- Visualizador de espectro de frecuencia en tiempo real.
- Controles de reproducción (play/pausa, volumen).
- Lista de canciones cargadas desde la carpeta `/assets`.
- Diseño limpio, responsivo y con efectos de neón.
- Navegación por teclado (espacio: play/pausa, flechas: volumen y cambio de canción).

---

## 🚀 Instalación y uso
1. **Descarga o clona este repositorio.**
2. Asegúrate de tener la siguiente estructura:

```
caja-musica/
├── assets/
│   └── Song.mp3 (y otros .mp3 que agregues)
├── index.html
├── styles.css
├── sketch.js
├── README.md
```

3. **Agrega tus canciones**
   - Coloca tus archivos `.mp3` en la carpeta `/assets`.
   - Abre `sketch.js` y edita la sección `songs = [...]` en la función `preload()` para añadir o quitar canciones. Ejemplo:
     ```js
     songs = [
         { name: 'Song.mp3', path: './assets/Song.mp3' },
         { name: 'Otra Canción', path: './assets/otra_cancion.mp3' }
     ];
     ```
   - El campo `name` es el nombre que aparecerá en la lista y `path` es la ruta al archivo.

4. **Abre `index.html` en tu navegador**
   - ¡Listo! Selecciona y reproduce cualquier canción de la lista.

---

## ⚡ Personalización
- Cambia el diseño editando `styles.css`.
- Modifica la visualización o agrega efectos en `sketch.js`.
- Puedes cambiar los nombres y rutas de las canciones desde el array `songs`.

---

## 🛠️ Dependencias
- [p5.js v1.4.0](https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js)
- [p5.sound.js v1.4.0](https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js)

Estas bibliotecas se cargan desde CDN en el archivo `index.html`.

---

## ❗ Notas importantes
- **No es posible** listar automáticamente los archivos en `/assets` solo con JavaScript del lado del cliente. Por eso, debes mantener actualizado el array `songs` en `sketch.js`.
- El proyecto no permite subir canciones desde la web, solo desde la carpeta local.
- Si necesitas automatizar la detección de canciones, se requiere un backend (Node.js, Python, etc.).

---

## 📄 Licencia
Este proyecto es para fines educativos y personales.

---

¡Disfruta creando y visualizando tu música!
