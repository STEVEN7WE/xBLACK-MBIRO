// =======================
// SMOOTH TRACKING REPTILE CURSOR (DESIGNATED SEGMENTS)
// =======================

const cursor = document.querySelector(".reptile-cursor");

// Mouse coordinates
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Cursor position (for smooth lag)
let cursorX = mouseX;
let cursorY = mouseY;

// Track whether we are inside a "cursor segment"
let activeSegment = false;

// Detect segments
document.querySelectorAll(".cursor-segment").forEach((segment) => {
  segment.addEventListener("mouseenter", () => {
    cursor.style.display = "block";
    activeSegment = true;
  });
  segment.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
    activeSegment = false;
  });
});

// Update mouse position
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animate cursor
function animateCursor() {
  if (activeSegment) {
    // Smooth follow using lerp
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    // Calculate rotation angle
    let angle =
      Math.atan2(mouseY - cursorY, mouseX - cursorX) * (180 / Math.PI);

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) rotate(${angle}deg)`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on buttons
const buttons = document.querySelectorAll(".btn");
buttons.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    cursor.style.transform += " scale(1.5)";
  });
  btn.addEventListener("mouseleave", () => {
    cursor.style.transform = cursor.style.transform.replace(" scale(1.5)", "");
  });
});

// CONTACT FORM FUNCTIONALITY
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

// Check if form exists before adding listeners
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    status.innerHTML = "Sending message... <span class='loader'></span>";
    status.style.color = "#00ffe7";

    emailjs
      .sendForm("service_8fyjm9m", "template_t53xt59", form)
      .then(() => {
        if (modal) modal.style.display = "flex";
        form.reset();
        status.textContent = "";
      })
      .catch((error) => {
        status.textContent = "Failed to send message. Try again.";
        status.style.color = "#ff4d4d";
        console.error(error);
      });
  });
}

// Check if modal and close button exist
if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// SCROLL ANIMATION
const animatedElements = document.querySelectorAll(".animate-on-scroll");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

animatedElements.forEach((el) => observer.observe(el));
// CANVAS INTERACTIVE DEMO
try {
  const canvas = document.getElementById("canvasDemo");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth || 800; // fallback width
    canvas.height = 400;
    // Use clientWidth
    canvas.height = 400; // Fixed height

    let particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 1.5,
        dy: (Math.random() - 0.5) * 1.5,
      });
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Replace the particle movement logic inside animateCanvas()
      particles.forEach((p) => {
        // Force movement in straight lines (Grid-based)
        if (Math.random() < 0.02) {
          // 2% chance to change direction
          const directions = [
            { dx: 1.5, dy: 0 },
            { dx: -1.5, dy: 0 },
            { dx: 0, dy: 1.5 },
            { dx: 0, dy: -1.5 },
          ];
          const newDir =
            directions[Math.floor(Math.random() * directions.length)];
          p.dx = newDir.dx;
          p.dy = newDir.dy;
        }

        p.x += p.dx;
        p.y += p.dy;

        // Boundary bounce
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        // Draw square particles instead of circles for "tech" feel
        ctx.fillStyle = "rgba(0, 255, 231, 0.8)";
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();

    canvas.addEventListener("mousemove", (e) => {
      particles.forEach((p) => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.dx += dx / 200;
          p.dy += dy / 200;
        }
      });
    });
  }
} catch (error) {
  console.error("Canvas init error:", error);
}

function decodeText(element) {
  const originalText = element.innerText;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
  let iterations = 0;

  const interval = setInterval(() => {
    element.innerText = originalText
      .split("")
      .map((char, index) => {
        if (index < iterations) return originalText[index];
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join("");

    if (iterations >= originalText.length) clearInterval(interval);
    iterations += 1 / 3;
  }, 30);
}

// Trigger it for your Hero Title
window.onload = () => {
  const title = document.querySelector(".typing-text");
  if (title) decodeText(title);
};

const projectModal = document.getElementById("projectModal");
const closeProject = document.getElementById("closeProject");

document.querySelectorAll(".view-project").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");

    // Fill Modal Data
    document.getElementById("modalTitle").innerText = card.dataset.title;
    document.getElementById("modalDesc").innerText = card.dataset.desc;
    document.getElementById("modalImg").src = card.dataset.img;

    const stackList = document.getElementById("modalStack");
    stackList.innerHTML = card.dataset.stack
      .split(",")
      .map((item) => `<li>${item.trim()}</li>`)
      .join("");

    // Show Modal
    projectModal.style.display = "flex";
  });
});

closeProject.addEventListener("click", () => {
  projectModal.style.display = "none";
});

// Close on background click
window.addEventListener("click", (e) => {
  if (e.target === document.querySelector(".modal-overlay")) {
    projectModal.style.display = "none";
  }
});
// ===== INTERACTIVE CANVAS LAB =====
const canvas = document.getElementById("canvasDemo");

if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
    });
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,255,255,0.6)";
      ctx.fill();
    });

    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();
}
const demoModal = document.getElementById("demoModal");
const demoFrame = document.getElementById("demoFrame");
const closeDemo = document.getElementById("closeDemo");

document.querySelectorAll(".live-demo-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const demoSrc = btn.getAttribute("data-demo");
    demoFrame.src = demoSrc;

    demoModal.style.display = "flex";
  });
});

closeDemo.addEventListener("click", () => {
  demoModal.style.display = "none";
  demoFrame.src = "";
});
document.addEventListener("DOMContentLoaded", () => {
  const demoModal = document.getElementById("demoModal");
  const demoFrame = document.getElementById("demoFrame");
  const closeDemo = document.getElementById("closeDemo");

  if (!demoModal) {
    console.error("❌ demoModal not found");
    return;
  }

  document.querySelectorAll(".live-demo-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const demoSrc = btn.dataset.demo;
      console.log("▶ Loading demo:", demoSrc);

      demoFrame.src = demoSrc;
      demoModal.style.display = "flex";
    });
  });

  closeDemo.addEventListener("click", () => {
    demoModal.style.display = "none";
    demoFrame.src = "";
  });
});
demoModal.classList.add("active");
/* ==========================
   UI SOUND CONTROLLER
========================== */

const sounds = {
  click: document.getElementById("ui-click"),
  hover: document.getElementById("ui-hover"),
  open: document.getElementById("ui-open"),
  close: document.getElementById("ui-close"),
};

function playSound(type) {
  if (!sounds[type]) return;
  sounds[type].currentTime = 0;
  sounds[type].play().catch(() => {});
}

window.addEventListener("blur", () => {
  document.title = "SYSTEM PAUSED | Black Mbiro";
});
window.addEventListener("focus", () => {
  document.title = "Black Mbiro";
});
