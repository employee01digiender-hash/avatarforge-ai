/**
 * AvatarForge AI - Landing Page
 */

(function () {
    'use strict';

    // ===============================
// NAVBAR MOBILE
// ===============================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');


if (navToggle && navLinks) {

    navToggle.addEventListener('click', function(e) {

        e.stopPropagation();

        navToggle.classList.toggle('active');

        navLinks.classList.toggle('open');

    });


    navLinks.querySelectorAll('a').forEach(function(link) {

        link.addEventListener('click', function() {

            navToggle.classList.remove('active');

            navLinks.classList.remove('open');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
            });
        });

    });

}



if (navbar) {

    window.addEventListener('scroll', function() {

        navbar.classList.toggle(
            'scrolled',
            window.scrollY > 50
        );

    }, { passive: true });

}
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // Three.js Hero Viewer
    const container = document.getElementById('hero3dContainer');

    if (container && typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined') {
        try {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a0f);

            const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0.5, 3);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);

            // Lighting
            const ambient = new THREE.AmbientLight(0x404060, 0.5);
            scene.add(ambient);
            const main = new THREE.DirectionalLight(0xffffff, 1);
            main.position.set(2, 3, 4);
            main.castShadow = true;
            scene.add(main);
            const fill = new THREE.DirectionalLight(0x7c3aed, 0.3);
            fill.position.set(-2, 1, -1);
            scene.add(fill);
            const rim = new THREE.DirectionalLight(0x8b5cf6, 0.2);
            rim.position.set(0, -1, 3);
            scene.add(rim);

            // Ground
            const ground = new THREE.Mesh(
                new THREE.CircleGeometry(1.2, 32),
                new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8, metalness: 0.2, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
            );
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -0.85;
            ground.receiveShadow = true;
            scene.add(ground);

            // Ring
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(0.6, 0.85, 64),
                new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
            );
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = -0.84;
            scene.add(ring);

            // Avatar
            const avatar = new THREE.Group();

            // Head
            const head = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 32, 32),
                new THREE.MeshPhysicalMaterial({ color: 0x7c3aed, roughness: 0.3, metalness: 0.05, emissive: new THREE.Color(0x3a1a6d), emissiveIntensity: 0.05 })
            );
            head.castShadow = true;
            head.position.y = 0.1;
            avatar.add(head);

            // Eyes
            const eyeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: new THREE.Color(0x7c3aed), emissiveIntensity: 0.5, roughness: 0.1, metalness: 0.9 });
            const eyeGeo = new THREE.SphereGeometry(0.06, 12, 12);
            const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
            leftEye.position.set(-0.18, 0.15, 0.45);
            avatar.add(leftEye);
            const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
            rightEye.position.set(0.18, 0.15, 0.45);
            avatar.add(rightEye);

            // Body
            const body = new THREE.Mesh(
                new THREE.CylinderGeometry(0.4, 0.6, 0.8, 16),
                new THREE.MeshPhysicalMaterial({ color: 0x2d1b4e, roughness: 0.4, metalness: 0.05 })
            );
            body.position.y = -0.5;
            body.castShadow = true;
            avatar.add(body);

            // Shoulders
            const shoulderMat = new THREE.MeshPhysicalMaterial({ color: 0x2d1b4e, roughness: 0.4, metalness: 0.05 });
            const shoulderGeo = new THREE.SphereGeometry(0.25, 16, 16);
            const leftShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
            leftShoulder.position.set(-0.45, -0.2, 0);
            avatar.add(leftShoulder);
            const rightShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
            rightShoulder.position.set(0.45, -0.2, 0);
            avatar.add(rightShoulder);

            scene.add(avatar);

            // Controls
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 2;
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.maxPolarAngle = Math.PI / 2;
            controls.minPolarAngle = 0.2;
            controls.target.set(0, -0.1, 0);

            let floatTime = 0;

            function animate() {
                requestAnimationFrame(animate);
                floatTime += 0.02;
                avatar.position.y = Math.sin(floatTime) * 0.03;
                ring.rotation.z += 0.005;
                controls.update();
                renderer.render(scene, camera);
            }
            animate();

            function resize() {
                const w = container.clientWidth;
                const h = container.clientHeight;
                if (w > 0 && h > 0) {
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                    renderer.setSize(w, h);
                }
            }
            new ResizeObserver(resize).observe(container);
            window.addEventListener('resize', resize);

            console.log('✅ 3D Viewer initialized');

        } catch (e) {
            console.warn('3D Viewer error:', e.message);
        }
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.feature-card, .step').forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
            observer.observe(el);
        });
    }

    console.log('🚀 AvatarForge AI - Landing Page Loaded');
})();