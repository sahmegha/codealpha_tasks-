document.addEventListener('DOMContentLoaded', function() {
    const audio = new Audio();
    
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const albumArt = document.querySelector('.album-art');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeProgress = document.getElementById('volume-progress');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const autoplayToggle = document.getElementById('autoplay');
    
    const playlist = [
        {
            title: "Zara Sa",
            artist: "KK , Pritam Chakraborty",
            duration: "5:02",
            src: "aud/song1.mp3",
            cover: "img/img1.jpg"
        },
        {
            title: "Hawayein",
            artist: "Arjit Singh , Pritam Chakraborty",
            duration: "4:51",
            src: "aud/song2.m4a",
            cover: "img/img2.jpg"
        },
        {
            title: "Agar Tum Sath Ho",
            artist: "Alka Yagnik , Arjit Singh",
            duration: "5:41",
            src: "aud/song3.m4a",
            cover: "img/img3.jpg"
        },
        {
            title: "Love Me Like You Do",
            artist: "Ellie Goulding",
            duration: "4:09",
            src: "aud/song4.m4a",
            cover: "img/img4.jpg"
        },
        {
            title: "Main Rang Sharbaton ka",
            artist: "Arjit Singh",
            duration: "4:30",
            src: "aud/song5.m4a",
            cover: "img/img5.jpg"
        }
    ];
    
    let currentSongIndex = 0;
    let isPlaying = false;
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
    
    function loadSong(index) {
        const song = playlist[index];
        audio.src = song.src;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        
        totalDurationEl.textContent = song.duration;
        document.querySelector('.album-art img').src = song.cover;
        
        playlistItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        
        audio.addEventListener('loadedmetadata', function() {
            if (audio.duration && !isNaN(audio.duration)) {
                totalDurationEl.textContent = formatTime(audio.duration);
            }
        }, { once: true });
    }
    
    function playSong() {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        albumArt.classList.add('playing');
        audio.play().catch(error => {
            console.log('Audio play failed:', error);
        });
    }
    
    function pauseSong() {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        albumArt.classList.remove('playing');
        audio.pause();
    }
    
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (duration && !isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(currentTime);
            
            if (totalDurationEl.textContent === '0:00') {
                totalDurationEl.textContent = formatTime(duration);
            }
        }
    }
    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        if (duration && !isNaN(duration)) {
            audio.currentTime = (clickX / width) * duration;
        }
    }
    
    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;
        
        audio.volume = volume;
        volumeProgress.style.width = `${volume * 100}%`;
    }
    
    playPauseBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });
    
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        if (autoplayToggle.checked) {
            nextSong();
        } else {
            pauseSong();
        }
    });
    
    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('click', setVolume);
    
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
    });
    
    loadSong(currentSongIndex);
    audio.volume = 0.7;
    volumeProgress.style.width = '70%';
});