import { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const { url } = useContext(StoreContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${url}/api/contact`, formData);
      alert("Your message has been submitted successfully!");
      setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("There was an error submitting your message. Please try again.");
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        <h1>Contact Us</h1>
        <p className="contact-description">
          Have a project idea or internship inquiry? Reach out to us and our team will get back to you soon.
        </p>

        <div className="contact-content">

          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get in Touch</h2>

            <p><strong>Email:</strong> support@nammatechsolutions.com</p>
            <p><strong>Phone:</strong> +91 87920 44661</p>
            <p><strong>Location:</strong> Karnataka, India</p>

            <div className="business-hours">
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday - Sunday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="contact-form">

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-btn">
                Send Message
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
