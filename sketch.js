// Global variables
let song;
let fft;
let playButton, volumeUp, volumeDown;
let playing = false;
let currentVolume = 0.5;
let currentSongIndex = -1;
let songs = [];
let songListElement;
let songTitleElement;
let songTimeElement;
let updateTimeInterval;

async function preload() {
    // Load songs from the assets folder
    try {
        // Manually list your actual MP3 files here:
        songs = [
            { name: 'Song.mp3', path: './assets/Song.mp3' }, // Add more files as needed
        ];
        
        // Initialize the first song if available
        if (songs.length > 0) {
            song = loadSound(songs[0].path, () => {
                console.log('First song loaded successfully');
                updateSongList();
            });
        }
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}

function setup() {
    // Create canvas with dynamic size
    let canvas = createCanvas(680, 350);
    canvas.parent('musicBox');
    
    // Configure UI elements
    playButton = select('#playButton');
    volumeUp = select('#volumeUp');
    volumeDown = select('#volumeDown');
    songListElement = select('#songList');
    songTitleElement = select('#songTitle');
    songTimeElement = select('#songTime');
    
    // Set up event handlers
    playButton.mousePressed(togglePlay);
    volumeUp.mousePressed(() => changeVolume(0.1));
    volumeDown.mousePressed(() => changeVolume(-0.1));
    
    // Set up FFT for audio analysis
    fft = new p5.FFT(0.8, 128);
    
    // Set initial volume
    if (song) {
        song.setVolume(currentVolume);
    }
    
    // Set up time update interval
    updateTimeInterval = setInterval(updateTimeDisplay, 500);
    
    // Update the song list display
    updateSongList();
    // Set the song title to the first song if available
    if (songs.length > 0 && songTitleElement) {
        songTitleElement.html(songs[0].name);
    }

}

function draw() {
    // Fondo blanco con un sutil gradiente
    let bgColor1 = color(255, 255, 255);
    let bgColor2 = color(248, 250, 252);
    
    // Aplicar gradiente de fondo
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(bgColor1, bgColor2, inter);
        stroke(c);
        line(0, y, width, y);
    }
    
    // Borde sutil con brillo
    noFill();
    stroke(0, 243, 255, 50);
    strokeWeight(1);
    rect(0, 0, width, height, 8);
    
    // Efecto de brillo en los bordes
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(0, 243, 255, 0.3)';
    noFill();
    stroke(0, 243, 255, 30);
    strokeWeight(3);
    rect(0, 0, width, height, 8);
    drawingContext.shadowBlur = 0;
    
    // Solo dibujar si hay una canción cargada
    if (song && song.isLoaded()) {
        // Obtener el espectro de frecuencia
        const spectrum = fft.analyze();
        const barCount = Math.floor(spectrum.length * 0.6);
        const barWidth = width / barCount;
        const barSpacing = barWidth * 0.3;
        
        // Dibujar barras de frecuencia con efecto de neón
        for (let i = 0; i < barCount; i++) {
            // Mapear el valor de frecuencia a la altura
            const h = map(spectrum[i], 0, 255, 0, height * 0.8);
            const x = (width - (barWidth * barCount)) / 2 + i * barWidth;
            
            // Color de neón azul con gradiente
            const neonBlueGlow = color(0, 150, 255, 100);
            
            // Dibujar brillo suave
            fill(neonBlueGlow);
            rect(x + barSpacing/2, height - h - 5, barWidth - barSpacing, h + 5, 4);
            
            // Dibujar barra principal con gradiente
            const barGradient = drawingContext.createLinearGradient(0, height - h, 0, height);
            barGradient.addColorStop(0, 'rgba(0, 200, 255, 0.9)');
            barGradient.addColorStop(1, 'rgba(0, 100, 255, 0.7)');
            drawingContext.fillStyle = barGradient;
            drawingContext.fillRect(x + barSpacing/2, height - h, barWidth - barSpacing, h);
            
            // Efecto de brillo en la parte superior
            drawingContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
            drawingContext.fillRect(x + barSpacing/2, height - h, barWidth - barSpacing, 2);
        }
        
        // Dibujar un círculo en el centro que reaccione al volumen
        const volumeLevel = song.getVolume();
        const centerX = width / 2;
        const centerY = height / 2;
        const pulseSize = 20 + volumeLevel * 30;
        
        // Círculo exterior pulsante con efecto de neón
        noFill();
        stroke(0, 200, 255, 100);
        strokeWeight(2);
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = 'rgba(0, 200, 255, 0.7)';
        ellipse(centerX, centerY, pulseSize * 1.5, pulseSize * 1.5);
        
        // Círculo interior con gradiente
        const gradient = drawingContext.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, pulseSize/2
        );
        gradient.addColorStop(0, 'rgba(0, 200, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 100, 255, 0.3)');
        drawingContext.fillStyle = gradient;
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = 'rgba(0, 200, 255, 0.5)';
        noStroke();
        ellipse(centerX, centerY, pulseSize, pulseSize);
        drawingContext.shadowBlur = 0;
    } else {
        // Mostrar mensaje cuando no hay canción cargada
        textAlign(CENTER, CENTER);
        textSize(18);
        fill(100);
        text("Sube una canción para comenzar", width / 2, height / 2);
    }
    
    // Mostrar el título de la canción actual
    textAlign(CENTER, BOTTOM);
    textSize(14);
    fill(150);
    text(songTitle, width / 2, height - 10);
}

function togglePlay() {
    if (!song || songs.length === 0) return;
    
    if (song.isPlaying()) {
        song.pause();
        playButton.html('▶️ Reproducir');
        playing = false;
    } else {
        // If it's the first time playing, set the volume
        if (song.getVolume() === 1) {
            song.setVolume(currentVolume);
        }
        song.loop();
        playButton.html('⏸️ Pausar');
        playing = true;
    }
    
    // Update the song list to reflect the current playing state
    updateSongList();
}

function changeVolume(amount) {
    if (!song) return;
    
    currentVolume = constrain(currentVolume + amount, 0, 1);
    song.setVolume(currentVolume);
    
    // Mostrar retroalimentación visual del volumen
    let volumeDisplay = select('#volumeDisplay');
    if (!volumeDisplay) {
        volumeDisplay = createDiv('Volumen: ' + Math.round(currentVolume * 100) + '%');
        volumeDisplay.id('volumeDisplay');
        volumeDisplay.style('color', '#90e0ef').style('margin', '10px');
        select('.controls').child(volumeDisplay);
    } else {
        volumeDisplay.html('Volumen: ' + Math.round(currentVolume * 100) + '%');
    }
    
    // Hacer que el indicador de volumen desaparezca después de 2 segundos
    if (volumeDisplay) {
        clearTimeout(window.volumeTimeout);
        window.volumeTimeout = setTimeout(() => {
            volumeDisplay.style('opacity', '0');
            setTimeout(() => volumeDisplay.remove(), 300);
        }, 2000);
    }
}

function handleFile(file) {
    if (file.type === 'audio') {
        // Si ya hay una canción cargada, detenerla y liberar recursos
        if (song) {
            song.stop();
            song = null;
        }
        
        // Cargar la nueva canción
        song = loadSound(file, () => {
            console.log('Canción cargada correctamente');
            songTitle = file.name;
            updateSongTitle();
            song.setVolume(currentVolume);
            fft.setInput(song);
            
            // Reproducir automáticamente
            song.play();
            playButton.html('⏸️ Pausar');
            playing = true;
        });
    } else {
        alert('Por favor, selecciona un archivo de audio válido.');
    }
}

function updateSongList() {
    if (!songListElement) return;
    
    // Clear the current list
    songListElement.html('');
    
    if (songs.length === 0) {
        songListElement.html('<p class="loading-text">No se encontraron canciones en la carpeta /assets</p>');
        return;
    }
    
    // Add each song to the list
    songs.forEach((songItem, index) => {
        const songElement = createDiv(`
            <div class="song-item ${currentSongIndex === index ? 'playing' : ''}" data-index="${index}">
                <span class="song-name">${songItem.name}</span>
                <span class="song-duration">${formatTime(songItem.duration || 0)}</span>
            </div>
        `);
        
        songElement.mousePressed(() => {
            loadSong(index);
        });
        
        songListElement.child(songElement);
    });
}

function loadSong(index) {
    if (index < 0 || index >= songs.length) return;
    
    const songItem = songs[index];
    
    // Stop the current song if playing
    if (song && song.isPlaying()) {
        song.stop();
    }
    
    // Load the new song
    song = loadSound(songItem.path, () => {
        currentSongIndex = index;
        songTitleElement.html(songItem.name);
        song.setVolume(currentVolume);
        song.loop();
        playing = true;
        playButton.html('⏸️ Pausar');
        updateSongList();
    });
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimeDisplay() {
    if (!song || !songTimeElement) return;
    
    const currentTime = song.currentTime() || 0;
    const duration = song.duration() || 0;
    
    songTimeElement.html(`${formatTime(currentTime)} / ${formatTime(duration)}`);
}

// Handle keyboard events for playback control
function keyPressed() {
    if (keyCode === 32) { // Space bar
        togglePlay();
        return false; // Prevent default behavior
    } else if (keyCode === 38) { // Up arrow
        changeVolume(0.1);
        return false;
    } else if (keyCode === 40) { // Down arrow
        changeVolume(-0.1);
        return false;
    } else if (keyCode === 37) { // Left arrow - previous song
        if (currentSongIndex > 0) {
            loadSong(currentSongIndex - 1);
        }
        return false;
    } else if (keyCode === 39) { // Right arrow - next song
        if (currentSongIndex < songs.length - 1) {
            loadSong(currentSongIndex + 1);
        }
        return false;
    }
}

// Clean up when the window is closed
function windowResized() {
    resizeCanvas(windowWidth * 0.8, 350);
}
