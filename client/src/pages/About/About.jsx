
import "./About.css";
import founderImage from "../../assets/founder.png";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">

        <h1 className="about-title">About Namma Tech Solutions</h1>

        <p className="about-intro">
          Namma Tech Solutions is a software development company
          dedicated to building innovative digital solutions for businesses,
          startups, and students. We specialize in developing modern web
          applications, mobile applications, AI/ML systems, and enterprise
          software that help organizations succeed in the digital world.
        </p>

        <div className="about-section">
          <h2>Who We Are</h2>
          <p>
            We are a passionate team of developers, designers, and technology
            enthusiasts who believe in turning ideas into powerful software
            solutions. Our goal is to help businesses build scalable
            applications and provide students with real-world project
            experience through internships and practical training programs.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to deliver reliable, scalable, and innovative
            software solutions while empowering students and startups with
            industry-ready skills through hands-on learning and project-based
            experiences.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            Our vision is to become a trusted technology partner for businesses
            and a leading platform for students to gain real industry exposure
            through innovative software development and internship programs.
          </p>
        </div>

        {/* Founder Section */}
        <div className="founder-section">
          <div className="founder-image">
            <img src={founderImage} alt="Founder & CEO" />
          </div>

          <div className="founder-message">
            <h2>Message from the Founder & CEO</h2>

            <p>
              At Namma Tech Solutions, our vision has always been to bridge the
              gap between innovation and real-world technology solutions.
              We believe that technology should empower businesses and also
              provide learning opportunities for the next generation of
              developers.
            </p>

            <p>
              Through our software development services and internship
              programs, we aim to create an ecosystem where businesses get
              high-quality digital solutions and students gain practical
              industry experience.
            </p>

            <p className="founder-name">
              <strong>Founder & CEO</strong> <br />
              Namma Tech Solutions
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
