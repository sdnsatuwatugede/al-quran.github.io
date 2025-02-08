let currentJuz = 1;
const totalJuz = 30;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeJuzSelector();
    loadJuz(currentJuz);
    updateNavigationButtons();
});

// Initialize Juz selector dropdown
function initializeJuzSelector() {
    const selector = document.getElementById('juzSelector');
    for (let i = 1; i <= totalJuz; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Juz ${i}`;
        selector.appendChild(option);
    }
    selector.value = currentJuz;
}

// Load Juz content
async function loadJuz(juzNumber) {
    const container = document.getElementById('quranContent');
    try {
        // Show loading state
        container.innerHTML = `
            <div class="loading-message">
                <div class="spinner"></div>
                <p>Memuat Juz ${juzNumber}...</p>
            </div>
        `;

        // Build the file path
        const filePath = `/data/juz${juzNumber}.json`;
        console.log('Attempting to load:', window.location.origin + filePath);

        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data || !data.verses || !Array.isArray(data.verses)) {
            throw new Error('Format data tidak valid');
        }
        
        displayJuz(data);
    } catch (error) {
        console.error('Error loading Juz:', error);
        let errorMessage = 'Terjadi kesalahan saat memuat data.';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage = `
                <p>File Juz ${juzNumber} tidak ditemukan. Pastikan:</p>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>File <code>data/juz${juzNumber}.json</code> tersedia</li>
                    <li>Anda menjalankan website melalui web server (bukan file protocol)</li>
                    <li>Tidak ada masalah jaringan</li>
                </ul>
            `;
        } else if (error.message.includes('HTTP error')) {
            errorMessage = `Gagal memuat Juz ${juzNumber}. Status: ${error.message}`;
        } else if (error.message.includes('JSON')) {
            errorMessage = 'Format data tidak valid. Mohon periksa struktur file JSON.';
        }

        container.innerHTML = `
            <div class="error-message">
                <h3>Maaf, terjadi kesalahan</h3>
                ${errorMessage}
                <div class="error-details">
                    <small>${error.message}</small>
                </div>
                <button onclick="loadJuz(${currentJuz})" class="retry-button">
                    <i class="fas fa-sync-alt"></i> Coba Lagi
                </button>
            </div>
        `;
    }
}

// Display Juz content
function displayJuz(juzData) {
    const container = document.getElementById('quranContent');
    container.innerHTML = '';

    let currentSurah = null;

    juzData.verses.forEach(verse => {
        // Create new surah header if we're starting a new surah
        if (currentSurah !== verse.surah) {
            currentSurah = verse.surah;
            const surahHeader = document.createElement('div');
            surahHeader.className = 'surah-header';
            surahHeader.innerHTML = `<h2>Surah ${verse.surah}</h2>`;
            container.appendChild(surahHeader);
        }

        const verseElement = document.createElement('div');
        verseElement.className = 'verse';
        
        // Create metadata section
        const metadata = [
            verse.juz ? `Juz ${verse.juz}` : '',
            verse.page ? `Halaman ${verse.page}` : '',
            verse.hizb ? `Hizb ${verse.hizb}` : ''
        ].filter(Boolean).join(' • ');
        
        // Create verse content
        verseElement.innerHTML = `
            <div class="verse-header">
                <span class="verse-number">Ayat ${verse.ayah}</span>
                ${metadata ? `<span class="verse-metadata">${metadata}</span>` : ''}
            </div>
            <div class="verse-content">
                <div class="arabic-text">${verse.arab}</div>
                <div class="latin-text">${verse.latin}</div>
                <div class="translation">${verse.text}</div>
                ${verse.notes ? `<div class="verse-notes">${verse.notes}</div>` : ''}
                ${verse.asbab && verse.asbab !== "0" ? `<div class="verse-asbab">Asbabun Nuzul: ${verse.asbab}</div>` : ''}
            </div>
        `;
        
        // Add audio player if available
        if (verse.audio) {
            const audioElement = document.createElement('div');
            audioElement.className = 'verse-audio';
            audioElement.innerHTML = `
                <audio controls>
                    <source src="${verse.audio}" type="audio/mpeg">
                    Browser Anda tidak mendukung pemutaran audio.
                </audio>
            `;
            verseElement.appendChild(audioElement);
        }
        
        container.appendChild(verseElement);
    });
}

// Navigation functions
function navigateJuz(direction) {
    if (direction === 'prev' && currentJuz > 1) {
        currentJuz--;
    } else if (direction === 'next' && currentJuz < totalJuz) {
        currentJuz++;
    }
    
    document.getElementById('juzSelector').value = currentJuz;
    loadJuz(currentJuz);
    updateNavigationButtons();
}

function changeJuz(juzNumber) {
    currentJuz = parseInt(juzNumber);
    loadJuz(currentJuz);
    updateNavigationButtons();
}

function updateNavigationButtons() {
    document.getElementById('prevJuz').disabled = currentJuz === 1;
    document.getElementById('nextJuz').disabled = currentJuz === totalJuz;
}
