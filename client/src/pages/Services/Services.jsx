import "./Services.css";

const Services = () => {
    return (
        <div className="services-page">
            <div className="services-container">

                <h1 className="services-title">Our Services</h1>

                <p className="services-intro">
                    At Namma Tech Solutions Pvt Ltd, we provide innovative software
                    development services and internship opportunities designed to help
                    businesses grow and students gain real-world technical experience.
                </p>

                {/* Services Offered */}
                <div className="services-section">
                    <h2>What We Offer</h2>

                    <div className="services-list">

                        <div className="service-card">
                            <h3>Web Application Development</h3>
                            <p>
                                We develop modern, scalable, and responsive web applications
                                for startups, businesses, and enterprise solutions.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>Mobile Application Development</h3>
                            <p>
                                We build Android and cross-platform mobile applications using
                                modern technologies for high performance and usability.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>AI / Machine Learning Solutions</h3>
                            <p>
                                We create intelligent systems including predictive analytics,
                                automation tools, and AI-powered business applications.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>Enterprise Software Development</h3>
                            <p>
                                We design and build large-scale enterprise applications that
                                improve efficiency and streamline business operations.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>Student Academic Projects</h3>
                            <p>
                                We provide final-year projects, IEEE projects, and mini
                                projects with full documentation and guidance.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>Internship Programs</h3>
                            <p>
                                We offer remote and on-site internships with hands-on
                                experience in real-world development projects.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>Application Hosting & Maintenance</h3>
                            <p>
                                We help businesses deploy, manage, and maintain their
                                applications with reliable hosting and support services.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Technologies */}
                <div className="services-section">
                    <h2>Technologies We Work With</h2>

                    <ul className="tech-list">
                        <li>React.js</li>
                        <li>Node.js</li>
                        <li>Express.js</li>
                        <li>PostgreSQL</li>
                        <li>Flutter</li>
                        <li>Android Development</li>
                        <li>Python</li>
                        <li>Machine Learning</li>
                        <li>MongoDB</li>
                        <li>MySQL</li>
                        <li>Java</li>
                        <li>JavaScript Frameworks</li>
                        <li>SpringBoot</li>
                        <li>Next.js</li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Services;
