AOS.init();

            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        const navHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = target.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Navbar background on scroll
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 50) {
                    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                } else {
                    navbar.style.backgroundColor = 'white';
                    navbar.style.backdropFilter = 'none';
                }
            });

            // Animation on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            document.querySelectorAll('.feature-card, .portfolio-card, .service-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.8s ease-out';
                observer.observe(el);
            });

            // Testimonial carousel auto-play with pause on hover
            const testimonialCarousel = document.getElementById('testimonialCarousel');
            let carousel; // Declare carousel here

            // Function to load testimonials from JSON
            async function loadTestimonials() {
                try {
                    const response = await fetch('testimoni.json');
                    const testimonials = await response.json();
                    const carouselInner = document.getElementById('testimonialCarouselInner');
                    const carouselIndicators = document.getElementById('testimonialCarouselIndicators');

                    testimonials.forEach((testimonial, index) => {
                        // Create carousel item
                        const carouselItem = document.createElement('div');
                        carouselItem.classList.add('carousel-item');
                        if (index === 0) {
                            carouselItem.classList.add('active');
                        }

                        // Create testimonial card content
                        const starsHtml = '<i class="fas fa-star"></i>'.repeat(testimonial.stars);
                        carouselItem.innerHTML = `
                            <div class="testimonial-card">
                                <div class="d-flex align-items-start">
                                    <div class="testimonial-avatar me-3">
                                        <img src="${testimonial.avatar}" alt="${testimonial.name}" class="rounded-circle" width="60" height="60">
                                    </div>
                                    <div>
                                        <h5 class="mb-1">${testimonial.name}</h5>
                                        <div class="testimonial-stars mb-2">
                                            ${starsHtml}
                                        </div>
                                        <p class="mb-0">${testimonial.testimonial}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                        carouselInner.appendChild(carouselItem);

                        // Create carousel indicator
                        const indicatorButton = document.createElement('button');
                        indicatorButton.setAttribute('type', 'button');
                        indicatorButton.setAttribute('data-bs-target', '#testimonialCarousel');
                        indicatorButton.setAttribute('data-bs-slide-to', index);
                        indicatorButton.setAttribute('aria-label', `Slide ${index + 1}`);
                        if (index === 0) {
                            indicatorButton.classList.add('active');
                            indicatorButton.setAttribute('aria-current', 'true');
                        }
                        carouselIndicators.appendChild(indicatorButton);
                    });

                    // Initialize the carousel after content is loaded
                    carousel = new bootstrap.Carousel(testimonialCarousel, {
                        interval: 5000,
                        wrap: true
                    });

                    testimonialCarousel.addEventListener('mouseenter', () => {
                        carousel.pause();
                    });

                    testimonialCarousel.addEventListener('mouseleave', () => {
                        carousel.cycle();
                    });

                } catch (error) {
                    console.error('Error fetching testimonials:', error);
                }
            }

            // Call the function to load testimonials when the DOM is fully loaded
            document.addEventListener('DOMContentLoaded', loadTestimonials);

            // Counter animation for stats
            function animateCounters() {
                const counters = document.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const originalText = counter.textContent;
                    const target = parseInt(originalText.replace(/\D/g, ''));
                    const hasPercent = originalText.includes('%');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    counter.textContent = hasPercent ? '0%' : '0';
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        
                        const displayValue = Math.round(current);
                        counter.textContent = hasPercent ? displayValue + '%' : displayValue.toLocaleString();
                    }, 16);
                });
            }

            // Observe stats section for counter animation
            const statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        entry.target.classList.add('animated');
                        setTimeout(animateCounters, 200);
                    }
                });
            }, { threshold: 0.5 });

            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                statsObserver.observe(statsSection);
            }