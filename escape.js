    window.addEventListener("error", function (e) {
      console.error("Page error:", e.message, "at", e.filename + ":" + e.lineno);
    });
/* =========================================================
       DATA
    ========================================================= */
    const TREATMENTS = [
      { name: "Thai Signature Massage", cat: "Massage", duration: "60 / 90 min", price: "From ₦25,000", desc: "Deep stretching and rhythmic pressure along the body's energy lines." },
      { name: "Balinese Warm Oil", cat: "Massage", duration: "60 / 90 min", price: "From ₦25,000", desc: "Long, flowing strokes with warmed oils to release deep tension." },
      { name: "Deep Tissue Release", cat: "Massage", duration: "45 / 60 min", price: "From ₦22,000", desc: "Firm, focused work for knots that have earned a name." },
      { name: "Radiance Facial", cat: "Skin", duration: "45 min", price: "From ₦18,000", desc: "Cleanse, steam, and mask suited to Abuja's dry-season air." },
      { name: "Manicure & Pedicure", cat: "Nails", duration: "75 min", price: "From ₦15,000", desc: "Shaping, soak, and polish, finished with a hand massage." },
      { name: "Mommy Bliss Package", cat: "Home Service", duration: "120 min", price: "From ₦40,000", desc: "Massage and facial, brought to your home, for the days you can't leave." },
    ];
    const CATS = ["All", "Massage", "Skin", "Nails", "Home Service"];

    const ROOMS = [
      { name: "The Studio", cat: "Rooms", duration: "32 sqm · 1 queen", price: "₦85,000 / night", desc: "A quiet room for one or two, facing the inner courtyard." },
      { name: "The Garden Suite", cat: "Rooms", duration: "48 sqm · 1 king", price: "₦135,000 / night", desc: "A private balcony onto the garden, away from the road." },
      { name: "The Maitama Suite", cat: "Rooms", duration: "70 sqm · 1 king + sofa", price: "₦210,000 / night", desc: "Our largest room, with a sitting area and soaking tub." },
    ];

    const MENU = [
      { name: "Pepper Soup", cat: "Starters", duration: "Starter", price: "₦6,500", desc: "Goat meat, uziza, and scotch bonnet, served with plantain." },
      { name: "Suya Skewers", cat: "Starters", duration: "Starter", price: "₦5,000", desc: "Charcoal-grilled beef, yaji spice, onion and tomato." },
      { name: "Jollof & Grilled Chicken", cat: "Mains", duration: "Main", price: "₦9,000", desc: "Smoked jollof rice, half chicken, fried plantain." },
      { name: "Catfish Pepper Stew", cat: "Mains", duration: "Main", price: "₦11,500", desc: "Whole catfish in a slow pepper stew, served with eba or rice." },
      { name: "Pan-Seared Salmon", cat: "Mains", duration: "Main", price: "₦14,000", desc: "Continental plate, lemon butter, seasonal vegetables." },
      { name: "Chin Chin & Ice Cream", cat: "Desserts", duration: "Dessert", price: "₦3,500", desc: "Warm chin chin, vanilla ice cream, palm syrup." },
    ];
    const MENU_CATS = ["All", "Starters", "Mains", "Desserts"];

    const SPACES = [
      { label: "The Reception", note: "Where the city's pace ends." },
      { label: "Treatment Room I", note: "Warm wood, low light, soft linen." },
      { label: "The Steam Room", note: "Pre-massage, for those who want it." },
      { label: "Treatment Room II", note: "Our quietest room, by request." },
    ];
    const SPACE_GRADIENTS = ["#241D17", "#241b13", "#22271c", "#241d18"];
    const VOICES = [
      { quote: "I fell asleep halfway through and woke up lighter. Best in the city.", name: "Adaeze O." },
      { quote: "Calm from the second you walk in. The therapist remembered my last visit.", name: "Tunde B." },
      { quote: "Booked the home service for a tough week — worth every kobo.", name: "Funmi A." },
      { quote: "Quiet, clean, unhurried. Exactly what I needed after a long quarter.", name: "Ahmed Y." },
    ];

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* =========================================================
       NAV — show/hide on scroll
    ========================================================= */
    const navEl = document.getElementById("nav");
    window.addEventListener("scroll", () => {
      navEl.classList.toggle("visible", window.scrollY > 320);
    });

    /* =========================================================
       HERO — staggered fade-in + 3D key scene
    ========================================================= */
    const fadeBlocks = ["fade-1", "fade-2", "fade-3", "fade-4"];
    fadeBlocks.forEach((id, i) => {
      const el = document.getElementById(id);
      setTimeout(() => el && el.classList.add("in"), 200 + i * 250);
    });
    setTimeout(() => {
      document.getElementById("scroll-indicator").classList.add("in");
    }, 1600);

    function buildKeyGeometry() {
      // Build a classic key silhouette as a 2D shape, then extrude it for depth.
      const shape = new THREE.Shape();

      const bowOuterR = 0.55;
      const bowInnerR = 0.28;
      const shaftLen = 1.3;
      const shaftW = 0.16;

      // Bow (the round loop you hold) — outer circle
      shape.absarc(0, 0.9, bowOuterR, 0, Math.PI * 2, false);

      // Shaft, drawn as its own path attached below the bow
      const shaft = new THREE.Shape();
      shaft.moveTo(-shaftW / 2, 0.9 - bowOuterR * 0.4);
      shaft.lineTo(-shaftW / 2, -shaftLen);
      shaft.lineTo(shaftW / 2, -shaftLen);
      shaft.lineTo(shaftW / 2, 0.9 - bowOuterR * 0.4);
      shaft.closePath();

      // Teeth notches near the tip of the shaft (the bit pattern)
      const teeth = [
        { y: -shaftLen + 0.18, w: 0.14 },
        { y: -shaftLen + 0.42, w: 0.09 },
        { y: -shaftLen + 0.64, w: 0.16 },
        { y: -shaftLen + 0.88, w: 0.08 },
      ];

      // The bow's inner hole (so it reads as a ring, not a solid disc)
      const bowHole = new THREE.Path();
      bowHole.absarc(0, 0.9, bowInnerR, 0, Math.PI * 2, true);
      shape.holes.push(bowHole);

      const extrudeSettings = { depth: 0.16, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 2 };
      const bowGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const shaftGeo = new THREE.ExtrudeGeometry(shaft, extrudeSettings);

      // Teeth as small notch boxes cut visually by overlaying dark wedges (kept simple: small extra teeth blocks jutting from one side)
      const toothGeoms = teeth.map((t) => {
        const toothShape = new THREE.Shape();
        toothShape.moveTo(shaftW / 2, t.y);
        toothShape.lineTo(shaftW / 2 + t.w, t.y);
        toothShape.lineTo(shaftW / 2 + t.w, t.y + 0.06);
        toothShape.lineTo(shaftW / 2, t.y + 0.06);
        toothShape.closePath();
        return new THREE.ExtrudeGeometry(toothShape, extrudeSettings);
      });

      // Merge everything into one BufferGeometry via simple grouping (kept as a Group of meshes for clarity/perf at this scale)
      return { bowGeo, shaftGeo, toothGeoms };
    }

    function initHeroScene() {
      const mount = document.getElementById("hero-canvas-wrap");
      let width = mount.clientWidth;
      let height = mount.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0.6, 4.6);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xfff4dd, 0.55));
      const dir = new THREE.DirectionalLight(0xf0d9a8, 1.5);
      dir.position.set(3, 4, 2);
      scene.add(dir);
      const point = new THREE.PointLight(0xd4906b, 0.6);
      point.position.set(-3, -1, -2);
      scene.add(point);

      const { bowGeo, shaftGeo, toothGeoms } = buildKeyGeometry();
      const keyMat = new THREE.MeshStandardMaterial({ color: 0xe8c77e, roughness: 0.3, metalness: 0.75 });

      const keyGroup = new THREE.Group();
      keyGroup.add(new THREE.Mesh(bowGeo, keyMat));
      keyGroup.add(new THREE.Mesh(shaftGeo, keyMat));
      toothGeoms.forEach((g) => keyGroup.add(new THREE.Mesh(g, keyMat)));

      // Scale and center the whole key so it reads well in frame
      keyGroup.scale.set(1.05, 1.05, 1.05);
      keyGroup.position.y = -0.3;
      scene.add(keyGroup);

      const rings = [0, 1.3, 2.6].map((delay) => {
        const ringGeo = new THREE.RingGeometry(0.98, 1.05, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8c77e, transparent: true, opacity: 0, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -1.55;
        scene.add(ring);
        return { mesh: ring, delay };
      });

      const target = { x: 0, y: 0 };
      if (!reducedMotion) {
        window.addEventListener("pointermove", (e) => {
          target.x = (e.clientX / window.innerWidth) * 2 - 1;
          target.y = (e.clientY / window.innerHeight) * 2 - 1;
        });
      }

      /* -----------------------------------------------------
         INTERACTIVITY — drag the key to spin it, click to book
      ----------------------------------------------------- */
      const raycaster = new THREE.Raycaster();
      const pointerNDC = new THREE.Vector2();
      const keyMeshes = keyGroup.children;

      let isDragging = false;
      let dragMoved = false;
      let lastPointerX = 0;
      let lastPointerY = 0;
      let manualRotationY = 0;
      let manualRotationX = 0;
      let idlePaused = false;
      let idleResumeTimer = null;
      let idleOffset = 0; // keeps auto-rotation from snapping when resuming after a drag

      function getCanvasPoint(e) {
        const rect = renderer.domElement.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        return { clientX, clientY };
      }

      function isPointerOnKey(e) {
        getCanvasPoint(e);
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObjects(keyMeshes, false);
        return hits.length > 0;
      }

      function onPointerDown(e) {
        const { clientX, clientY } = getCanvasPoint(e);
        if (!isPointerOnKey(e)) return;
        isDragging = true;
        dragMoved = false;
        idlePaused = true;
        if (idleResumeTimer) clearTimeout(idleResumeTimer);
        lastPointerX = clientX;
        lastPointerY = clientY;
        renderer.domElement.style.cursor = "grabbing";
        e.preventDefault();
      }

      function onPointerMoveDrag(e) {
        if (!isDragging) {
          // Hover feedback even when not dragging
          renderer.domElement.style.cursor = isPointerOnKey(e) ? "grab" : "default";
          return;
        }
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const dx = clientX - lastPointerX;
        const dy = clientY - lastPointerY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragMoved = true;
        manualRotationY += dx * 0.01;
        manualRotationX += dy * 0.008;
        manualRotationX = Math.max(-0.6, Math.min(0.6, manualRotationX));
        lastPointerX = clientX;
        lastPointerY = clientY;
      }

      function onPointerUp(e) {
        if (isDragging) {
          isDragging = false;
          renderer.domElement.style.cursor = "grab";
          // Resume idle auto-rotation after a short pause, anchored so it doesn't snap from the dragged position
          idleResumeTimer = setTimeout(() => {
            idleOffset = manualRotationY - clock.getElapsedTime() * 0.22;
            idlePaused = false;
          }, 1200);
          // If the pointer didn't really move, treat it as a click/tap on the key
          if (!dragMoved && isPointerOnKey(e)) {
            openModal();
          }
        }
      }

      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMoveDrag);
      window.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("touchstart", onPointerDown, { passive: false });
      window.addEventListener("touchmove", onPointerMoveDrag, { passive: true });
      window.addEventListener("touchend", onPointerUp);

      const clock = new THREE.Clock();
      function animate() {
        const t = clock.getElapsedTime();
        if (!reducedMotion) {
          if (!idlePaused) {
            keyGroup.rotation.y = t * 0.22 + idleOffset;
          } else {
            keyGroup.rotation.y = manualRotationY;
          }
          keyGroup.rotation.x = manualRotationX;
          keyGroup.rotation.z = Math.sin(t * 0.4) * 0.06;
          keyGroup.position.y = -0.3 + Math.sin(t * 0.5) * 0.06;
          rings.forEach(({ mesh, delay }) => {
            const local = (t + delay) % 4;
            const p = local / 4;
            const scale = 0.6 + p * 3.2;
            mesh.scale.set(scale, scale, scale);
            mesh.material.opacity = Math.max(0, 0.35 * (1 - p));
          });
          const tx = target.x * 0.5;
          const ty = -target.y * 0.25 + 0.6;
          camera.position.x += (tx - camera.position.x) * 0.03;
          camera.position.y += (ty - camera.position.y) * 0.03;
          camera.lookAt(0, -0.3, 0);
        } else {
          keyGroup.rotation.y = t * 0.06 + manualRotationY;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      window.addEventListener("resize", () => {
        width = mount.clientWidth;
        height = mount.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      });
    }

    function initBambooScene() {
      const mount = document.getElementById("bamboo-card");
      let width = mount.clientWidth || 320;
      let height = mount.clientHeight || 400;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 1.6, 3.4);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mount.appendChild(renderer.domElement);

      // A plate (flat disc ring of particles) with a mound of "food" particles piled in the center
      const PLATE_COUNT = 1400;
      const FOOD_COUNT = 1100;
      const TOTAL = PLATE_COUNT + FOOD_COUNT;
      const positions = new Float32Array(TOTAL * 3);
      const colors = new Float32Array(TOTAL * 3);

      const plateColor = [0.93, 0.91, 0.86];   // warm ivory ceramic
      const foodPalette = [
        [0.83, 0.56, 0.42],  // terracotta / stew
        [0.91, 0.78, 0.49],  // gold / jollof rice
        [0.42, 0.55, 0.33],  // herb green
        [0.70, 0.30, 0.22],  // deep pepper red
      ];

      let idx = 0;

      // Plate: flat disc, particles spread across a radius with slightly raised rim
      const plateRadius = 1.3;
      for (let i = 0; i < PLATE_COUNT; i++) {
        const r = Math.sqrt(Math.random()) * plateRadius;
        const theta = Math.random() * Math.PI * 2;
        const rim = r > plateRadius * 0.82 ? 0.06 : 0; // slight rim lip
        positions[idx * 3] = Math.cos(theta) * r;
        positions[idx * 3 + 1] = rim + (Math.random() - 0.5) * 0.01;
        positions[idx * 3 + 2] = Math.sin(theta) * r * 0.9; // slight perspective squash

        const flicker = 0.9 + Math.random() * 0.1;
        colors[idx * 3] = plateColor[0] * flicker;
        colors[idx * 3 + 1] = plateColor[1] * flicker;
        colors[idx * 3 + 2] = plateColor[2] * flicker;
        idx++;
      }

      // Food: domed mound piled near the center of the plate
      const moundRadius = 0.68;
      const moundHeight = 0.5;
      for (let i = 0; i < FOOD_COUNT; i++) {
        const r = Math.sqrt(Math.random()) * moundRadius;
        const theta = Math.random() * Math.PI * 2;
        const heightFrac = 1 - r / moundRadius; // taller near center
        const y = Math.random() * moundHeight * heightFrac + 0.05;

        positions[idx * 3] = Math.cos(theta) * r;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = Math.sin(theta) * r * 0.9;

        const c = foodPalette[Math.floor(Math.random() * foodPalette.length)];
        const flicker = 0.8 + Math.random() * 0.25;
        colors[idx * 3] = c[0] * flicker;
        colors[idx * 3 + 1] = c[1] * flicker;
        colors[idx * 3 + 2] = c[2] * flicker;
        idx++;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.026,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const plateGroup = new THREE.Points(geometry, material);
      scene.add(plateGroup);

      const clock = new THREE.Clock();
      function animate() {
        const t = clock.getElapsedTime();
        plateGroup.rotation.y = t * (reducedMotion ? 0.04 : 0.18);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      window.addEventListener("resize", () => {
        width = mount.clientWidth;
        height = mount.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      });
    }

    try {
      if (typeof THREE === "undefined") {
        throw new Error("THREE is not defined — the three.js CDN script did not load.");
      }
      initHeroScene();
      initBambooScene();
    } catch (err) {
      console.error("3D scene initialization failed:", err.message);
      var heroWrap = document.getElementById("hero-canvas-wrap");
      if (heroWrap) heroWrap.style.display = "none";
      var bambooCard = document.getElementById("bamboo-card");
      if (bambooCard) bambooCard.style.background = "#161210";
    }

    /* =========================================================
       SCATTER / ASSEMBLE IMAGE — vanilla Canvas 2D, no CDN needed
    ========================================================= */
    function initScatterImage() {
      const canvas = document.getElementById("scatter-canvas");
      const wrap = document.querySelector(".welcome-canvas-wrap");
      if (!canvas || !wrap) return;

      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = "reception.jpeg";

      let particles = [];
      let assembled = false;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);

      function sizeCanvas() {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { w, h };
      }

      function buildParticles(w, h) {
        particles = [];
        const cols = 48;
        const rows = 48;
        const cellW = w / cols;
        const cellH = h / rows;

        const off = document.createElement("canvas");
        off.width = cols;
        off.height = rows;
        const offCtx = off.getContext("2d");
        offCtx.drawImage(img, 0, 0, cols, rows);
        const data = offCtx.getImageData(0, 0, cols, rows).data;

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
            if (a < 20) continue;
            const targetX = x * cellW + cellW / 2;
            const targetY = y * cellH + cellH / 2;
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              targetX,
              targetY,
              color: `rgb(${r},${g},${b})`,
              size: Math.max(cellW, cellH) * 0.9,
            });
          }
        }
      }

      function draw() {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        ctx.clearRect(0, 0, w, h);
        const ease = assembled ? 0.08 : 0.04;
        particles.forEach((p) => {
          p.x += (p.targetX - p.x) * ease;
          p.y += (p.targetY - p.y) * ease;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        });
        requestAnimationFrame(draw);
      }

      img.onload = () => {
        const { w, h } = sizeCanvas();
        buildParticles(w, h);
        if (!reducedMotion) {
          draw();
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                assembled = true;
                observer.disconnect();
              }
            });
          }, { threshold: 0.3 });
          observer.observe(wrap);
        } else {
          // reduced motion: snap straight to assembled image, no animation
          particles.forEach((p) => { p.x = p.targetX; p.y = p.targetY; });
          draw();
        }
      };

      img.onerror = () => {
        console.error("Scatter image failed to load: reception.jpeg not found next to index.html.");
        wrap.style.background = "linear-gradient(160deg, #241D17, #15110d)";
      };

      window.addEventListener("resize", () => {
        const { w, h } = sizeCanvas();
        buildParticles(w, h);
      });
    }

    initScatterImage();

    /* =========================================================
       SCROLL-TRIGGERED REVEALS (philosophy block, bamboo card, space cards)
    ========================================================= */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "-60px 0px -60px 0px" });

    document.getElementById("philosophy-copy") && revealObserver.observe(document.getElementById("philosophy-copy"));
    document.getElementById("bamboo-card") && revealObserver.observe(document.getElementById("bamboo-card"));

    /* =========================================================
       TREATMENTS — filter pills + card grid
    ========================================================= */
    const pillsEl = document.getElementById("filter-pills");
    const gridEl = document.getElementById("treatment-grid");
    let activeCat = "All";

    function renderPills() {
      pillsEl.innerHTML = "";
      CATS.forEach((c) => {
        const btn = document.createElement("button");
        btn.className = "pill" + (c === activeCat ? " active" : "");
        btn.textContent = c;
        btn.addEventListener("click", () => {
          activeCat = c;
          renderPills();
          renderGrid();
        });
        pillsEl.appendChild(btn);
      });
    }

    function renderGrid() {
      gridEl.innerHTML = "";
      const filtered = activeCat === "All" ? TREATMENTS : TREATMENTS.filter((t) => t.cat === activeCat);
      filtered.forEach((t) => {
        const card = document.createElement("div");
        card.className = "treatment-card";
        card.innerHTML = `
          <div class="row-top">
            <div class="eyebrow">${t.cat}</div>
            <span class="duration">${t.duration}</span>
          </div>
          <h3>${t.name}</h3>
          <p class="desc">${t.desc}</p>
          <div class="row-bottom">
            <span class="price">${t.price}</span>
            <button class="link-cta" data-service="${t.name}">Reserve →</button>
          </div>
        `;
        gridEl.appendChild(card);
      });
      gridEl.querySelectorAll(".link-cta").forEach((btn) => {
        btn.addEventListener("click", () => openModal(btn.dataset.service));
      });
    }

    renderPills();
    renderGrid();

    /* =========================================================
       ROOMS — static card grid (no filter, only 3 rooms)
    ========================================================= */
    const roomGridEl = document.getElementById("room-grid");
    if (roomGridEl) {
      ROOMS.forEach((r) => {
        const card = document.createElement("div");
        card.className = "treatment-card";
        card.innerHTML = `
          <div class="row-top">
            <div class="eyebrow">${r.cat}</div>
            <span class="duration">${r.duration}</span>
          </div>
          <h3>${r.name}</h3>
          <p class="desc">${r.desc}</p>
          <div class="row-bottom">
            <span class="price">${r.price}</span>
            <button class="link-cta" data-service="${r.name}">Book →</button>
          </div>
        `;
        roomGridEl.appendChild(card);
      });
      roomGridEl.querySelectorAll(".link-cta").forEach((btn) => {
        btn.addEventListener("click", () => openModal(btn.dataset.service));
      });
    }

    /* =========================================================
       MENU — filter pills + card grid (same pattern as treatments)
    ========================================================= */
    const menuPillsEl = document.getElementById("menu-pills");
    const menuGridEl = document.getElementById("menu-grid");
    let activeMenuCat = "All";

    function renderMenuPills() {
      menuPillsEl.innerHTML = "";
      MENU_CATS.forEach((c) => {
        const btn = document.createElement("button");
        btn.className = "pill" + (c === activeMenuCat ? " active" : "");
        btn.textContent = c;
        btn.addEventListener("click", () => {
          activeMenuCat = c;
          renderMenuPills();
          renderMenuGrid();
        });
        menuPillsEl.appendChild(btn);
      });
    }

    function renderMenuGrid() {
      menuGridEl.innerHTML = "";
      const filtered = activeMenuCat === "All" ? MENU : MENU.filter((m) => m.cat === activeMenuCat);
      filtered.forEach((m) => {
        const card = document.createElement("div");
        card.className = "treatment-card";
        card.innerHTML = `
          <div class="row-top">
            <div class="eyebrow">${m.cat}</div>
            <span class="duration">${m.duration}</span>
          </div>
          <h3>${m.name}</h3>
          <p class="desc">${m.desc}</p>
          <div class="row-bottom">
            <span class="price">${m.price}</span>
            <button class="link-cta" data-service="${m.name}">Reserve →</button>
          </div>
        `;
        menuGridEl.appendChild(card);
      });
      menuGridEl.querySelectorAll(".link-cta").forEach((btn) => {
        btn.addEventListener("click", () => openModal(btn.dataset.service));
      });
    }

    if (menuPillsEl && menuGridEl) {
      renderMenuPills();
      renderMenuGrid();
    }

    /* =========================================================
       SPACES — horizontal scroll gallery with reveal
    ========================================================= */
    const photos = ["reception.jpeg", "room1.jpg", "steamroom.jpg", "room2.jpg"];
    const spaceScrollEl = document.getElementById("space-scroll");
    SPACES.forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "space-card";
      card.style.background = `linear-gradient(155deg, ${SPACE_GRADIENTS[i % 4]}, #15110d)`;
      card.style.transitionDelay = `${i * 0.06}s`;
      card.innerHTML = `
        <div class="space-card-inner">
          <span class="space-num">0${i + 1}</span>
          <h4>${s.label}</h4>
          <p class="note">${s.note}</p>
        </div>
      `;
      spaceScrollEl.appendChild(card);
      revealObserver.observe(card);
    });

    /* =========================================================
       VOICES — auto-rotating testimonial carousel
    ========================================================= */
    const voiceDisplay = document.getElementById("voice-display");
    const voiceDots = document.getElementById("voice-dots");
    let voiceIdx = 0;

    VOICES.forEach((v, i) => {
      const slide = document.createElement("div");
      slide.className = "voice-slide" + (i === 0 ? " active" : "");
      slide.dataset.idx = i;
      slide.innerHTML = `<blockquote>"${v.quote}"</blockquote><p class="name">— ${v.name}</p>`;
      voiceDisplay.appendChild(slide);

      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
      dot.addEventListener("click", () => setVoice(i));
      voiceDots.appendChild(dot);
    });

    function setVoice(i) {
      voiceIdx = i;
      voiceDisplay.querySelectorAll(".voice-slide").forEach((s) => s.classList.toggle("active", Number(s.dataset.idx) === i));
      voiceDots.querySelectorAll(".dot").forEach((d, di) => d.classList.toggle("active", di === i));
    }

    if (!reducedMotion) {
      setInterval(() => setVoice((voiceIdx + 1) % VOICES.length), 6000);
    }

    /* =========================================================
       BOOKING MODAL
    ========================================================= */
    const overlay = document.getElementById("modal-overlay");
    const formView = document.getElementById("form-view");
    const confirmView = document.getElementById("confirm-view");
    const serviceSelect = document.getElementById("service-select");
    const dateInput = document.getElementById("date-input");
    const timeInput = document.getElementById("time-input");
    const guestsInput = document.getElementById("guests-input");
    const nameInput = document.getElementById("name-input");
    const phoneInput = document.getElementById("phone-input");
    const bookingForm = document.getElementById("booking-form");

    function addOptGroup(label, items) {
      const group = document.createElement("optgroup");
      group.label = label;
      items.forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t.name;
        opt.textContent = t.name;
        group.appendChild(opt);
      });
      serviceSelect.appendChild(group);
    }
    addOptGroup("Treatments", TREATMENTS);
    addOptGroup("Rooms", ROOMS);
    addOptGroup("Menu", MENU);

    function openModal(presetService) {
      formView.style.display = "block";
      confirmView.style.display = "none";
      nameInput.value = "";
      phoneInput.value = "";
      dateInput.value = "";
      timeInput.value = "";
      guestsInput.value = "1 Person";
      if (presetService) serviceSelect.value = presetService;
      overlay.classList.add("open");
      requestAnimationFrame(() => overlay.classList.add("show"));
    }

    function closeModal() {
      overlay.classList.remove("show");
      setTimeout(() => overlay.classList.remove("open"), 300);
    }

    document.getElementById("nav-book-btn").addEventListener("click", () => openModal());
    document.getElementById("hero-book-btn").addEventListener("click", () => openModal());
    document.getElementById("visit-book-btn").addEventListener("click", () => openModal());
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("confirm-done-btn").addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const service = serviceSelect.value;
      const date = dateInput.value;
      const time = timeInput.value;
      const guests = guestsInput.value;

      const dateLabel = date ? new Date(date + "T00:00:00").toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : "a date to be confirmed";
      const timeLabel = time || "a time to be confirmed";

      document.getElementById("confirm-heading").textContent = `Request received, ${name.split(" ")[0] || "friend"}.`;
      document.getElementById("confirm-detail").textContent = `We'll call ${phone} to confirm your ${service.toLowerCase()} for ${guests} on ${dateLabel} at ${timeLabel}.`;

      formView.style.display = "none";
      confirmView.style.display = "block";
    });

    /* =========================================================
       FOOTER YEAR
    ========================================================= */
    document.getElementById("copyright-year").textContent = `© ${new Date().getFullYear()} Escape House Spa`;
  