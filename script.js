function createStars() {
  const starsContainer = document.querySelector(".stars");
  const numberOfStars = 50;

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("div");
    star.style.position = "absolute";
    star.style.width = "2px";
    star.style.height = "2px";
    star.style.background = "#fff";
    star.style.borderRadius = "50%";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animation = `twinkle ${
      Math.random() * 2 + 1
    }s infinite alternate`;
    starsContainer.appendChild(star);
  }
}

function createShootingStars() {
  const nightSky = document.querySelector(".night-sky");

  setInterval(() => {
    const star = document.createElement("div");
    star.className = "shooting-star";

    // Random position at the top-right area
    star.style.top = Math.random() * 40 + "%";
    star.style.right = "-50px";

    nightSky.appendChild(star);

    // Remove the star after animation
    setTimeout(() => {
      star.remove();
    }, 3000);
  }, 4000); // Create new shooting star every 4 seconds
}
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.classList.add("playing");
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("playing");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  createStars();
  createShootingStars();

  // Auto-play music with error handling
  bgMusic.play().catch((error) => {
    console.log("Auto-play prevented by browser:", error);
    // Add visual indicator that music needs user interaction to play
    musicToggle.classList.add("needs-interaction");
  });

  // Update music toggle button state
  if (!bgMusic.paused) {
    musicToggle.classList.add("playing");
  }
});

document.addEventListener(
  "click",
  function () {
    if (bgMusic.muted) {
      bgMusic.muted = false;
      musicToggle.classList.add("playing");
    }
  },
  { once: true }
); // Event listener will only trigger once

// Add twinkling animation to CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes twinkle {
        from { opacity: 0.2; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
