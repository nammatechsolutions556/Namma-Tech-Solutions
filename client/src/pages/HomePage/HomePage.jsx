import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  // Simple intersection observer to add visible class for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const hiddenElements = document.querySelectorAll(".fade-in-section");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">Innovate. Build. Scale.</div>
          <h1>Namma Tech <span className="highlight">Solutions</span></h1>
          <p>
            Your Vision, Our Code. We engineer modern web applications, robust mobile apps,
            intelligent AI solutions, and empower the next generation through premium internship programs.
          </p>
          <div className="hero-buttons">
            <Link to="/projects" className="primary-btn pulse-glow">
              Start Your Project
            </Link>
            <Link to="/services" className="secondary-btn">
              Explore Services
            </Link>
          </div>
        </div>

        {/* Floating animated shapes for hero background */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </section>

      {/* TRUST STATS SECTION */}
      <section className="stats-section fade-in-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>50+</h3>
            <p>Projects Delivered</p>
          </div>
          <div className="stat-card">
            <h3>150+</h3>
            <p>Happy Interns</p>
          </div>
          <div className="stat-card">
            <h3>99%</h3>
            <p>Client Satisfaction</p>
          </div>
          <div className="stat-card">
            <h3>5+</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </section>

      {/* ABOUT / WHY CHOOSE US */}
      <section className="why-choose-us fade-in-section">
        <h2>Why Partner With Us?</h2>
        <p>We blend technical excellence with business understanding to deliver solutions that drive real growth.</p>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h4>Agile Methodology</h4>
            <p>Fast iterations, continuous feedback, and rapid delivery of working software.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <h4>Quality Assurance</h4>
            <p>Rigorous testing protocols ensuring bug-free, secure, and highly performant applications.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">👥</div>
            <h4>Expert Team</h4>
            <p>A dedicated team of seasoned developers, designers, and AI specialists at your service.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h4>Client-Centric</h4>
            <p>Your success is our priority. We offer 24/7 support and transparent communication.</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services fade-in-section">
        <h2>Our Core Services</h2>
        <p>Comprehensive technology solutions tailored to modernize and scale your business.</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>Web Development</h3>
            <p>Custom, responsive, and scalable web applications built using React, Node.js, and modern frameworks.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📱</div>
            <h3>Mobile Apps</h3>
            <p>High-performance native and cross-platform mobile applications using Flutter and React Native.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🤖</div>
            <h3>AI & Machine Learning</h3>
            <p>Intelligent automation, predictive analytics, and smart business solutions using advanced AI models.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏢</div>
            <h3>Enterprise Solutions</h3>
            <p>Secure and tailored software solutions designed to streamline complex business workflows.</p>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="tech-stack-section fade-in-section">
        <h2>Technologies We Master</h2>
        <p>We leverage industry-leading tools to build future-proof solutions.</p>
        <div className="tech-marquee">
          <div className="tech-track">
            {/* Repeated for seamless scrolling effect */}
            <div className="tech-badge">React.js</div>
            <div className="tech-badge">Node.js</div>
            <div className="tech-badge">Python</div>
            <div className="tech-badge">Flutter</div>
            <div className="tech-badge">MongoDB</div>
            <div className="tech-badge">PostgreSQL</div>
            <div className="tech-badge">AWS</div>
            <div className="tech-badge">Docker</div>
            <div className="tech-badge">UI/UX</div>

            <div className="tech-badge">React.js</div>
            <div className="tech-badge">Node.js</div>
            <div className="tech-badge">Python</div>
            <div className="tech-badge">Flutter</div>
            <div className="tech-badge">MongoDB</div>
            <div className="tech-badge">PostgreSQL</div>
            <div className="tech-badge">AWS</div>
            <div className="tech-badge">Docker</div>
            <div className="tech-badge">UI/UX</div>
          </div>
        </div>
      </section>

      {/* INTERNSHIP SECTION */}
      <section className="internship split-section fade-in-section">
        <div className="split-content">
          <h2>Launch Your Career</h2>
          <p>
            Join our exclusive internship programs. Transition from theory to practice by working
            on real-world industry projects under the mentorship of senior engineers.
          </p>
          <ul className="benefits-list">
            <li>✓ Hands-on Live Projects</li>
            <li>✓ Expert Mentorship</li>
            <li>✓ Industry-Recognized Certificate</li>
            <li>✓ Placement Assistance</li>
          </ul>
          <Link to="/internships" className="primary-btn mt-4">
            Explore Internships
          </Link>
        </div>
        <div className="split-visual internship-visual">
          {/* Decorative visual for internship */}
          <div className="glass-card visual-card">
            <h4>Internship Track</h4>
            <div className="progress-bar"><div className="progress-fill p-100"></div></div>
            <p>Front-End Masterclass</p>

            <div className="progress-bar mt-2"><div className="progress-fill p-80"></div></div>
            <p>Backend & APIs</p>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="portfolio-preview fade-in-section">
        <h2>Featured Work</h2>
        <p>Discover how we've transformed ideas into impactful digital products.</p>
        <Link to="/portfolio" className="secondary-btn">
          View Full Portfolio
        </Link>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials fade-in-section">
        <h2>Client & Student Success</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            <p>
              "Namma Tech Solutions helped us develop our ecommerce platform quickly and professionally. Their technical expertise is unmatched."
            </p>
            <div className="testifier">
              <div className="testifier-avatar">R</div>
              <div>
                <h4>Rahul Sharma</h4>
                <span>Startup Founder</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            <p>
              "The internship program was incredibly practical. I learned full stack development by deploying actual production code."
            </p>
            <div className="testifier">
              <div className="testifier-avatar">P</div>
              <div>
                <h4>Priya R</h4>
                <span>Software Engineer (Alum)</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            <p>
              "Excellent support and robust architecture design for our enterprise management system. Highly recommended team."
            </p>
            <div className="testifier">
              <div className="testifier-avatar">A</div>
              <div>
                <h4>Arjun K</h4>
                <span>Operations Director</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION & CONTACT */}
      <section className="cta-contact-unified fade-in-section">
        <div className="cta-box glass-panel">
          <h2>Ready to Transform Your Business?</h2>
          <p>Let’s build something amazing together. Reach out today for a free technical consultation.</p>
          <div className="hero-buttons">
            <Link to="/projects" className="primary-btn">Request a Quote</Link>
            <a href="mailto:support@nammatechsolutions.com" className="secondary-btn">Email Us</a>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <h4>Email</h4>
            <p>support@nammatechsolutions.com</p>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <h4>Phone</h4>
            <p>+91 87920 44661</p>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <h4>Location</h4>
            <p>Bangalore, Karnataka, India</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
