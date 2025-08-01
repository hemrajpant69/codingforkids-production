import React from 'react';
//import 'bootstrap-icons/font/bootstrap-icons.css';
import logo from '../assets/logo.png'; // Replace with your actual logo path

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row text-start text-md-left">

          {/* Logo + Description + Social */}
          <div className="col-md-3 mb-4">
            <div className="d-flex align-items-center mb-3 ">
              <img src={logo} alt="Logo" width="80" height="60" className="me-2" />
            </div>
            <p>Building a brighter future by introducing kids to coding and digital creativity.</p>
            <div className="d-flex gap-3 fs-5">
              <a href="#"><i className="bi bi-facebook text-light"></i></a>
              <a href="#"><i className="bi bi-instagram text-light"></i></a>
              <a href="#"><i className="bi bi-linkedin text-light"></i></a>
              <a href="#"><i className="bi bi-tiktok text-light"></i></a>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Company</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text-light text-decoration-none">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Features Links */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Features</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Programs</a></li>
              <li><a href="#" className="text-light text-decoration-none">Discussion Board</a></li>
              <li><a href="#" className="text-light text-decoration-none">Live Classes</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Contact Us</h6>
            <ul className="list-unstyled">
              <li>
  <i className="bi bi-envelope-fill me-2"></i>
  <a href="mailto:nepal.codingforkids@gmail.com" className="text-decoration-none text-reset">
    nepal.codingforkids@gmail.com
  </a>
</li>
<li>
  <i className="bi bi-telephone-fill me-2"></i>
  <a href="tel:+9779806400774" className="text-decoration-none text-reset">
    +977-9806400774
  </a>
</li>
<li>
  <i className="bi bi-whatsapp me-2"></i>
  <a href="https://wa.me/9779806400774" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-reset">
    +977-9806400774
  </a>
</li>

            </ul>
          </div>

        </div>
      </div>
      <div className="text-center mt-4 pt-3 border-top border-secondary">
  <small>&copy; {new Date().getFullYear()} Code For Kids. All rights reserved.</small>
</div>
    </footer>
  );
};

export default Footer;
