// Gallery data
const galleryData = [
    { 
        id: 1,
        src:'img/mountainmajesty.jpg' , 
        category: 'nature', 
        title: 'Mountain Majesty',
        description: 'A breathtaking view of majestic mountains.',
        date: '2023-06-15',
        likes: 142
    },
    { 
        id: 2,
        src: 'img/starrynight.webp', 
        category: 'nature', 
        title: 'Starry Night',
        description: 'The Milky Way shining over a tranquil landscape.',
        date: '2023-05-22',
        likes: 218
    },
    { 
        id: 3,
        src: 'img/misty forest.jpeg', 
        category: 'nature', 
        title: 'Misty Forest',
        description: 'Early morning fog in the forest.',
        date: '2023-07-03',
        likes: 95
    },
    { 
        id: 4,
        src: 'img/urban skyline.jpeg', 
        category: 'city', 
        title: 'Urban Skyline',
        description: 'City skyline at golden hour.',
        date: '2023-04-18',
        likes: 167
    },
    { 
        id: 5,
        src: 'img/modern architecture.jpg', 
        category: 'city', 
        title: 'Modern Architecture',
        description: 'Contemporary building design.',
        date: '2023-08-05',
        likes: 124
    },
    { 
        id: 6,
        src: 'img/city.jpg', 
        category: 'city', 
        title: 'City from Above',
        description: 'Bird\'s eye view of a city.',
        date: '2023-03-12',
        likes: 203
    },
    { 
        id: 7,
        src: 'img/costal beauty.webp', 
        category: 'travel', 
        title: 'Coastal Beauty',
        description: 'Beautiful coastline with cliffs.',
        date: '2023-07-28',
        likes: 189
    },
    { 
        id: 8,
        src: 'img/mountainadventure.jpg', 
        category: 'travel', 
        title: 'Mountain Adventure',
        description: 'Exploring mountain terrain.',
        date: '2023-05-07',
        likes: 156
    },
    { 
        id: 9,
        src: 'img/desert oasis.jpg', 
        category: 'travel', 
        title: 'Desert Oasis',
        description: 'Oasis in the desert.',
        date: '2023-09-14',
        likes: 178
    },
    { 
        id: 10,
        src: 'img/curiois dolphin.jpeg', 
        category: 'animals', 
        title: 'Curious Dolphin',
        description: 'Playful dolphin in the ocean.',
        date: '2023-06-30',
        likes: 245
    },
    { 
        id: 11,
        src: 'img/majestic lion.jpg', 
        category: 'animals', 
        title: 'Majestic Lion',
        description: 'Lion in natural habitat.',
        date: '2023-04-05',
        likes: 312
    },
    { 
        id: 12,
        src: 'img/colourfulparrot.jpg', 
        category: 'animals', 
        title: 'Colorful Parrot',
        description: 'Vibrant parrot with beautiful colors.',
        date: '2023-08-19',
        likes: 134
    }
];

let currentFilter = 'all';
let currentSort = 'default';
let currentImageIndex = 0;
let filteredImages = [];

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    renderGallery(galleryData);
    filteredImages = galleryData;
    setupEventListeners();
}

function setupEventListeners() {
       document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.getAttribute('data-filter');
            updateActiveButton('.filter-btn', this);
            filterImages();
        });
    });

       document.querySelectorAll('.sort-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentSort = this.getAttribute('data-sort');
            updateActiveButton('.sort-btn', this);
            filterImages();
        });
    });

       document.getElementById('search-input').addEventListener('input', function() {
        filterImages();
    });

        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    document.querySelector('.lightbox-next').addEventListener('click', showNextImage);

        document.querySelector('.lightbox').addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });

        document.addEventListener('keydown', function(e) {
        if (!document.querySelector('.lightbox').classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

function updateActiveButton(selector, activeButton) {
    document.querySelectorAll(selector).forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

function filterImages() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    
       let results = galleryData.filter(image => {
        return currentFilter === 'all' || image.category === currentFilter;
    });
    
        if (searchQuery) {
        results = results.filter(image => {
            return image.title.toLowerCase().includes(searchQuery) || 
                   image.description.toLowerCase().includes(searchQuery);
        });
    }
    
       if (currentSort === 'newest') {
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentSort === 'popular') {
        results.sort((a, b) => b.likes - a.likes);
    }
    
    filteredImages = results;
    renderGallery(results);
}

function renderGallery(images) {
    const gallery = document.querySelector('.gallery');
    
    if (images.length === 0) {
        gallery.innerHTML = `
            <div class="no-results">
                <i class="fas fa-image"></i>
                <h3>No images found</h3>
                <p>Try adjusting your search or filter</p>
            </div>
        `;
        return;
    }
    
    gallery.innerHTML = images.map((image, index) => `
        <div class="gallery-item ${image.category}" onclick="openLightbox(${index})">
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="image-actions">
                <div class="action-btn like" onclick="toggleLike(event, ${image.id})">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
            <div class="image-info">
                <h3 class="image-title">${image.title}</h3>
                <span class="image-category">${image.category}</span>
                <div class="image-stats">
                    <span><i class="fas fa-heart"></i> ${image.likes}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(image.date)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function toggleLike(event, imageId) {
    event.stopPropagation();
    
    const image = galleryData.find(img => img.id === imageId);
    if (!image) return;
    
    image.likes += image.liked ? -1 : 1;
    image.liked = !image.liked;
    
    const likeBtn = event.target.closest('.action-btn');
    if (likeBtn) {
        likeBtn.innerHTML = image.liked ? 
            '<i class="fas fa-heart" style="color: #e63946;"></i>' : 
            '<i class="fas fa-heart"></i>';
        
               const likesCount = likeBtn.closest('.gallery-item').querySelector('.image-stats span:first-child');
        if (likesCount) {
            likesCount.innerHTML = `<i class="fas fa-heart"></i> ${image.likes}`;
        }
    }
}

function openLightbox(index) {
    currentImageIndex = index;
    const image = filteredImages[currentImageIndex];
    
    document.querySelector('.lightbox-img').src = image.src;
    document.querySelector('.lightbox-title').textContent = image.title;
    document.querySelector('.lightbox-description').textContent = image.description;
    document.querySelector('.lightbox-date').textContent = formatDate(image.date);
    document.querySelector('.lightbox-likes').textContent = image.likes;
    
       const thumbnailsContainer = document.querySelector('.lightbox-thumbnails');
    thumbnailsContainer.innerHTML = filteredImages.map((img, idx) => `
        <img class="lightbox-thumb ${idx === index ? 'active' : ''}" 
             src="${img.src}" 
             alt="${img.title}"
             onclick="switchToImage(${idx})">
    `).join('');
    
    document.querySelector('.lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function switchToImage(index) {
    currentImageIndex = index;
    updateLightbox();
    
      document.querySelectorAll('.lightbox-thumb').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
    });
}

function updateLightbox() {
    const image = filteredImages[currentImageIndex];
    document.querySelector('.lightbox-img').src = image.src;
    document.querySelector('.lightbox-title').textContent = image.title;
    document.querySelector('.lightbox-description').textContent = image.description;
    document.querySelector('.lightbox-date').textContent = formatDate(image.date);
    document.querySelector('.lightbox-likes').textContent = image.likes;
}

function closeLightbox() {
    document.querySelector('.lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightbox();
    
        document.querySelectorAll('.lightbox-thumb').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentImageIndex);
    });
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    updateLightbox();
    
        document.querySelectorAll('.lightbox-thumb').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentImageIndex);
    });
}