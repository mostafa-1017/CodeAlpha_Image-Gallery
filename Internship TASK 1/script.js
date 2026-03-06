// ── Image Data ────────────────────────────────────────────────────────────────
// HOW TO ADD YOUR OWN PHOTOS:
// 1. Create a folder called "images" inside your project folder
// 2. Put your JPG photos inside that "images" folder
// 3. Update the "src" field below with your actual filename (e.g. "images/myphoto.jpg")
// 4. Update "title", "cat", and "desc" to match your photo
// 5. You can add or remove items from this list as needed

const images = [
  { src: 'images/photo1.jpg',  cat: 'portraits',       title: 'MOSTAFA',                      desc: 'A peaceful moment watching the sunset by the sea, capturing the calm beauty of nature..'     },
  { src: 'images/photo2.jpg',  cat: 'portraits',       title: 'FOOTBALL',                     desc: 'A football match in action on a Campus field, capturing the energy of sports and teamwork' },
  { src: 'images/photo3.jpg',  cat: 'travel',          title: 'COX\'s BAZAR',                 desc: 'A candid silhouette of friends enjoying the waves of the Bay of Bengal, capturing the vibrant spirit of Chittagong.'   },
  { src: 'images/photo4.jpg',  cat: 'nature',          title: 'SAMPANS',                      desc: 'A serene view of iconic Sampans resting along a tree-lined shore, reflecting the unique maritime heritage of Bangladesh.'  },
  { src: 'images/photo5.jpg',  cat: 'nature',          title: 'TEKNAF',                       desc: 'Traditional fishing boats resting near the beach, surrounded by tall coastal trees..' },
  { src: 'images/photo6.jpg',  cat: 'nature',          title: 'COX\'s BAZAR',                 desc: 'A colorful artificial bird model displayed against a clean background.' },
  { src: 'images/photo7.jpg',  cat: 'nature',          title: ':Freedom in the Sky',          desc: 'A lone bird flying through the cloudy sky, creating a peaceful and dramatic moment in nature.'     },
  { src: 'images/photo8.jpg',  cat: 'nature',          title: 'Journey Across the Horizon',   desc: 'An airplane flying across the soft evening sky, symbolizing travel, distance, and endless possibilities.'     },
  { src: 'images/photo9.jpg',  cat: 'nature',          title: 'FOYZ LAKE',                    desc: 'A quiet river flowing through a foggy forest, creating a calm and natural atmosphere.'  },
  { src: 'images/photo10.jpg', cat: 'nature',          title: 'SKY',                          desc: 'Sunlight breaking through dramatic clouds, creating a powerful and peaceful sky view.' },
  { src: 'images/photo11.jpg', cat: 'nature',          title: 'THE OCEAN',                    desc: 'Sunlight reflecting across the calm ocean waves under a clear blue sky, creating a peaceful and refreshing seaside view.'},
  { src: 'images/photo12.jpg', cat: 'portraits',       title: 'MY LITTLE CHAMP',              desc: 'My little kitten sitting on my desk, quietly looking around with its bright blue eyes. This adorable moment captures my cat’s curious and innocent personality.'},
];

// ── State ─────────────────────────────────────────────────────────────────────
let currentFilter = 'all';
let currentSearch = '';
let currentIndex  = 0;
let currentView   = 'grid';
let favorites     = new Set();

// ── Get Visible Images ────────────────────────────────────────────────────────
function getVisible() {
  return images.filter(img => {
    const catOk  = currentFilter === 'all' || img.cat === currentFilter;
    const termOk = img.title.toLowerCase().includes(currentSearch) ||
                   img.cat.toLowerCase().includes(currentSearch);
    return catOk && termOk;
  });
}

// ── Render Gallery ────────────────────────────────────────────────────────────
function renderGallery() {
  const gallery = document.getElementById('gallery');
  const noRes   = document.getElementById('noResults');
  const visible = getVisible();

  document.getElementById('count-display').textContent = visible.length + ' IMAGES';
  gallery.innerHTML = '';

  if (visible.length === 0) {
    noRes.classList.add('visible');
    return;
  }
  noRes.classList.remove('visible');

  visible.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item' + (favorites.has(img.src) ? ' faved' : '');
    item.setAttribute('data-cat', img.cat);
    item.setAttribute('data-idx', i);

    item.innerHTML = `
      <div class="fav-dot"></div>
      <img src="${img.src}" alt="${img.title}" loading="lazy"
           onerror="this.src='https://placehold.co/800x600/111/c9a84c?text=Add+Your+Photo'" />
      <div class="item-overlay">
        <div class="item-category">${img.cat}</div>
        <div class="item-title">${img.title}</div>
        <div class="item-actions">
          <button class="item-btn" onclick="event.stopPropagation(); openLightbox(${i})">View</button>
          <button class="item-btn fav-btn ${favorites.has(img.src) ? 'faved' : ''}"
                  onclick="event.stopPropagation(); toggleFav('${img.src}', this, event)">
            ${favorites.has(img.src) ? '&#9829; Saved' : '&#9825; Save'}
          </button>
        </div>
      </div>`;

    item.addEventListener('click', () => openLightbox(i));
    gallery.appendChild(item);
  });
}

// ── Set Category Filter ───────────────────────────────────────────────────────
function setFilter(btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.cat;
  renderGallery();
}

// ── Search Filter ─────────────────────────────────────────────────────────────
function filterGallery() {
  currentSearch = document.getElementById('searchInput').value.toLowerCase().trim();
  renderGallery();
}

// ── Toggle Grid / List View ───────────────────────────────────────────────────
function setView(v, btn) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentView = v;
  document.getElementById('gallery').classList.toggle('list-view', v === 'list');
}

// ── Toggle Favourite (from card) ──────────────────────────────────────────────
function toggleFav(id, btn, e) {
  if (e) e.stopPropagation();
  if (favorites.has(id)) {
    favorites.delete(id);
    showToast('Removed from favourites');
  } else {
    favorites.add(id);
    showToast('Added to favourites ♥');
  }
  renderGallery();
  updateLbFav();
}

// ── Toggle Favourite (from lightbox) ─────────────────────────────────────────
function toggleFavLightbox() {
  const img = getVisible()[currentIndex];
  if (!img) return;
  toggleFav(img.src, null, null);
}

// ── Update Lightbox Fav Button State ─────────────────────────────────────────
function updateLbFav() {
  const img = getVisible()[currentIndex];
  if (!img) return;
  const btn   = document.getElementById('lb-fav-btn');
  const faved = favorites.has(img.src);
  btn.className = 'lb-fav-btn' + (faved ? ' faved' : '');
  btn.innerHTML = faved ? '&#9829; Saved to Favourites' : '&#9825; Add to Favourites';
}

// ── Open Lightbox ─────────────────────────────────────────────────────────────
function openLightbox(index) {
  const visible = getVisible();
  currentIndex  = index;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
  populateLightbox(visible[index], index, visible.length);
}

// ── Populate Lightbox Content ─────────────────────────────────────────────────
function populateLightbox(img, idx, total) {
  const lbImg = document.getElementById('lb-img');
  lbImg.classList.remove('zoomed');

  // Clear inline styles so CSS transition takes over properly
  lbImg.style.opacity   = '';
  lbImg.style.transform = '';

  // Set image source
  lbImg.src = img.src;
  lbImg.alt = img.title;
  lbImg.onerror = () => {
    lbImg.src = 'https://placehold.co/800x600/111111/c9a84c?text=Photo+Not+Found';
  };

  document.getElementById('lb-category').textContent = '— ' + img.cat.toUpperCase();
  document.getElementById('lb-title').textContent    = img.title;
  document.getElementById('lb-desc').textContent     = img.desc;
  document.getElementById('lb-idx').textContent      = idx + 1;
  document.getElementById('lb-total').textContent    = total;
  updateLbFav();
}

// ── Close Lightbox ────────────────────────────────────────────────────────────
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Navigate Lightbox ─────────────────────────────────────────────────────────
function navigate(dir) {
  const visible = getVisible();
  currentIndex  = (currentIndex + dir + visible.length) % visible.length;
  populateLightbox(visible[currentIndex], currentIndex, visible.length);
}

// ── Toggle Zoom on Lightbox Image ─────────────────────────────────────────────
function toggleZoom(img) {
  img.classList.toggle('zoomed');
}

// ── Toast Notification ────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Keyboard Navigation ───────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight')        navigate(1);
  if (e.key === 'ArrowLeft')         navigate(-1);
  if (e.key === 'Escape')            closeLightbox();
  if (e.key.toLowerCase() === 'f')   toggleFavLightbox();
});

// ── Custom Cursor ─────────────────────────────────────────────────────────────
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animRing);
})();

// ── Init ──────────────────────────────────────────────────────────────────────
renderGallery();

// ════════════════════════════════════════════════════════════
//  WELCOME PAGE
// ════════════════════════════════════════════════════════════

// ── Animated particle canvas background ──────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const dots = Array.from({ length: 55 }, () => ({
  x:     Math.random() * window.innerWidth,
  y:     Math.random() * window.innerHeight,
  r:     Math.random() * 1.2 + 0.3,
  vx:    (Math.random() - 0.5) * 0.3,
  vy:    (Math.random() - 0.5) * 0.3,
  alpha: Math.random() * 0.5 + 0.1
}));

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);

  // Lines between nearby dots
  dots.forEach((a, i) => {
    dots.slice(i + 1).forEach(b => {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 140) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(201,168,76,${(1 - dist / 140) * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });

  // Dots
  dots.forEach(d => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${d.alpha})`;
    ctx.fill();
    d.x += d.vx;
    d.y += d.vy;
    if (d.x < 0 || d.x > W) d.vx *= -1;
    if (d.y < 0 || d.y > H) d.vy *= -1;
  });

  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ── Enter Gallery button ──────────────────────────────────────────────────────
document.getElementById('enterGalleryBtn').addEventListener('click', function () {
  const welcomePage = document.getElementById('welcome-page');
  const galleryPage = document.getElementById('gallery-page');

  // Animate welcome out
  welcomePage.classList.add('exiting');

  setTimeout(() => {
    // Hide welcome, show gallery
    welcomePage.style.display = 'none';
    galleryPage.style.display = 'block';
    document.body.style.overflowY = 'auto';

    // Fade gallery in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        galleryPage.classList.add('visible');
      });
    });
  }, 600);
});