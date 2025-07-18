function openModal(artId) {
  const modal = document.getElementById('artModal');
  const modalImg = document.getElementById('modalImg');
  const caption = document.getElementById('caption');

  const images = {
    art1: { src: 'images/modern1.jpg', caption: 'Abstract Thoughts by Artist Ram' },
    art2: { src: 'images/modern2.jpg', caption: 'Surreal Vision by Artist Latha' },
    art3: { src: 'images/modern3.jpg', caption: 'Color Harmony by Artist William' },
    art4: { src: 'images/modern4.jpg', caption: 'Digital Dreams by Artist John' },
    art5: { src: 'images/modern5.jpg', caption: 'Neon Lights by Artist Shake' },
    art6: { src: 'images/classical1.jpg', caption: 'Mona Lisa by Leonardo da Vinci' },
    art7: { src: 'images/classical2.jpg', caption: 'Starry Night by Vincent van Gogh' },
    art8: { src: 'images/photography1.jpg', caption: 'Sunset Boulevard by Photographer A' },
    art9: { src: 'images/photography2.jpg', caption: 'Urban Jungle by Photographer B' }
  };

  modal.style.display = 'block';
  modalImg.src = images[artId].src;
  caption.innerHTML = images[artId].caption;
}

function closeModal() {
  document.getElementById('artModal').style.display = 'none';
}

// Zoom toggle
const modalImg = document.getElementById("modalImg");
modalImg.addEventListener("click", () => {
  modalImg.classList.toggle("zoomed");
});

// Music Play
function playMusic() {
  const music = document.getElementById("bgMusic");
  music.play().catch(err => {
    console.log("Autoplay blocked, must click play button.");
  });
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

// Search
function searchArtworks() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".art-card");
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(input) ? "" : "none";
  });
}
