const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

if (mobileMenu && navLinks) {
  mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    playSound("open");
  });
}

/**
 * BLACK MBIRO - UNIFIED SYSTEM SCRIPT
 * Consolidated Version
 */

/* ==========================================
   1. NEON TRAIL CURSOR SYSTEM
   ========================================== */
const trailCanvas = document.createElement("canvas");
trailCanvas.id = "neon-cursor-canvas";
document.body.appendChild(trailCanvas);
const tCtx = trailCanvas.getContext("2d");

let points = [];
const maxPoints = 20;
let mouse = { x: 0, y: 0 };

function resizeTrail() {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeTrail);
resizeTrail();

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  points.push({ x: mouse.x, y: mouse.y });
});

let trailTick = 0; // Add this variable at the top of your script

function drawTrail() {
  tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  if (points.length > 1) {
    tCtx.beginPath();
    tCtx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      tCtx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }

    tCtx.strokeStyle = "#00ffe7";
    tCtx.lineWidth = 3;
    tCtx.lineCap = "round";
    tCtx.lineJoin = "round";
    tCtx.shadowBlur = 15;
    tCtx.shadowColor = "#00ffe7";
    tCtx.stroke();
  }

  // THE FIX: Only remove points every 2nd frame to allow the trail to grow
  // This makes the trail look like a long ribbon that follows you
  trailTick++;
  if (trailTick % 2 === 0) {
    if (points.length > 0) {
      points.shift();
    }
  }

  // Keep the trail from getting infinitely long if you move constantly
  if (points.length > maxPoints) {
    points.shift();
  }

  requestAnimationFrame(drawTrail);
}
drawTrail();

/* ==========================================
   2. UI UTILITIES (Text Effects & Sounds)
   ========================================== */
function decodeText(element) {
  if (!element) return;
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

function playSound(type) {
  const sound = document.getElementById(`ui-${type}`);
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
}

/* ==========================================
   3. DOM CONTENT LOADED (Main Logic)
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  // A. Reveal Animations (Intersection Observer)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  document
    .querySelectorAll(".animate-on-scroll")
    .forEach((el) => observer.observe(el));

  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 50 },
        color: { value: "#00ffe7" },
        size: { value: 2 },
        move: { speed: 1 },
        line_linked: { enable: false },
      },
    });
  }

  // B. Hero Text Decode
  const title = document.querySelector(".typing-text");
  if (title) decodeText(title);

  // C. Global Hover/Click Sounds
  document.querySelectorAll(".btn, a, .card, .project-card").forEach((item) => {
    item.addEventListener("mouseenter", () => playSound("hover"));
    item.addEventListener("click", () => playSound("click"));
  });

  // D. Interactive Particle Lab (CanvasDemo)
  const labCanvas = document.getElementById("canvasDemo");
  if (labCanvas) {
    const lCtx = labCanvas.getContext("2d");
    const particles = [];

    const resizeLab = () => {
      labCanvas.width = labCanvas.offsetWidth;
      labCanvas.height = 400;
    };
    resizeLab();

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * labCanvas.width,
        y: Math.random() * labCanvas.height,
        dx: (Math.random() - 0.5) * 1.2,
        dy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 2 + 1,
      });
    }

    function animateLab() {
      lCtx.clearRect(0, 0, labCanvas.width, labCanvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > labCanvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > labCanvas.height) p.dy *= -1;
        lCtx.fillStyle = "rgba(0, 255, 231, 0.7)";
        lCtx.fillRect(p.x, p.y, p.size, p.size);
      });
      requestAnimationFrame(animateLab);
    }
    animateLab();
  }

  // E. Project Modal Logic
  const projectModal = document.getElementById("projectModal");
  if (projectModal && document.getElementById("modalTitle")) {
    document.querySelectorAll(".view-project").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".project-card");
        document.getElementById("modalTitle").innerText = card.dataset.title;
        document.getElementById("modalDesc").innerText = card.dataset.desc;
        document.getElementById("modalImg").src = card.dataset.img;
        const stackList = document.getElementById("modalStack");
        stackList.innerHTML = card.dataset.stack
          .split(",")
          .map((i) => `<li>${i.trim()}</li>`)
          .join("");
        projectModal.style.display = "flex";
        playSound("open");
      });
    });

    document.getElementById("closeProject")?.addEventListener("click", () => {
      projectModal.style.display = "none";
      playSound("close");
    });
  }

  // F. Live Demo Modal Logic
  const demoModal = document.getElementById("demoModal");
  const demoFrame = document.getElementById("demoFrame");
  if (demoModal) {
    document.querySelectorAll(".live-demo-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        demoFrame.src = btn.dataset.demo;
        demoModal.style.display = "flex";
        playSound("open");
      });
    });

    document.getElementById("closeDemo")?.addEventListener("click", () => {
      demoModal.style.display = "none";
      demoFrame.src = "";
      playSound("close");
    });
  }

  // G. Contact Form Logic
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("formStatus");
      status.innerHTML = "SENDING... <span class='loader'></span>";

      emailjs
        .sendForm("service_8fyjm9m", "template_t53xt59", contactForm)
        .then(() => {
          document.getElementById("successModal").style.display = "flex";
          contactForm.reset();
          status.textContent = "";
        })
        .catch((err) => {
          status.textContent = "TRANSMISSION FAILED.";
          status.style.color = "#ff4d4d";
        });
    });
  }
});

/* ==========================================
   4. SYSTEM STATE (Tab Titles)
   ========================================== */
window.addEventListener("blur", () => {
  document.title = "SYSTEM PAUSED | Black Mbiro";
});
window.addEventListener("focus", () => {
  document.title = "Black Mbiro";
});
