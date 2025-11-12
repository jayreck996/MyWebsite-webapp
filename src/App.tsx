import React, { useState } from 'react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import './styles/App.css';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { getApiUrl } from './utils/api/config';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface Contact {
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  createdAt: number;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [showAdmin, setShowAdmin] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // POST contact
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);
  setSubmitStatus({ type: null, message: '' });

  try {
    const response = await fetch(`${getApiUrl()}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit form');
    }

    setSubmitStatus({
      type: 'success',
      message: 'Thank you for your message! We will get back to you soon.',
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    setSubmitStatus({
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to submit form. Please try again.',
    });
  } finally {
    setIsSubmitting(false);
  }
};

// GET contacts
const fetchContacts = async () => {
  const res = await fetch(`${getApiUrl()}/submissions`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  cache: 'no-store' // <- bypass browser cache
});
  const data = await res.json(); // safe now
      setContacts(data.contacts || []);
      setShowAdmin(true);
};

    const scrollToContact = () => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

  return (
    <div className="app">
      {/* Navigation */}
      {/* <nav className="navbar">
        <div className="container">
          <div className="nav-brand">MyWebsite</div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav> */}

      {/* Hero Section */}
      {/* <section id="home" className="hero">
        <div className="hero-content">
          <h1>Welcome to MyWebsite</h1>
          <p>Building innovative solutions with modern technologies and cloud services</p>
          <a href="#contact" className="btn btn-primary">Get in Touch</a>
        </div>
      </section> */}
      <section style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYxNTMwMTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hero background"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))'
        }} />
      </div>
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        color: 'white',
        padding: '0 1rem'
      }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Welcome to My Website</h1>
        <p style={{
          maxWidth: '48rem',
          margin: '0 auto 2rem',
          color: '#cbd5e1',
          fontSize: '1.125rem'
        }}>
          Building innovative solutions with modern technologies and cloud services
        </p>
        <button
          onClick={scrollToContact}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Get in Touch
          {/* <svg className="icon" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg> */}
        </button>
      </div>
    </section>


      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title">About Jay</h2>
          <p className="section-description">
            I am dedicated young professional committed to delivering exceptional
            services and cloud solutions. With passion of software development, I pride
            myself on our attention to detail and success.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section section-gray">
        <div className="container">
          <h2 className="section-title">Powered by AWS</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🚀</div>
              <h3>AWS S3 Integration</h3>
              <p>Secure file storage and management with Amazon S3</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💡</div>
              <h3>DynamoDB Database</h3>
              <p>Fast and scalable NoSQL database for all your data needs</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎯</div>
              <h3>Lambda Functions</h3>
              <p>Serverless computing for efficient and cost-effective operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-description">
           Send me a message and I'll get back to you as soon as possible
          </p>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'input-error' : ''}
                disabled={isSubmitting}
              />
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>

            {submitStatus.type && (
              <div className={`alert alert-${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 MyWebsite. All rights reserved.</p>
          <p className="footer-tech">Powered by AWS DynamoDB, S3, IAM & Lambda</p>
          <button onClick={fetchContacts} className="btn btn-secondary btn-sm">
            View Submissions (Admin)
          </button> 
        </div>
      </footer>

      {/* Admin Modal */}
      {showAdmin && (
        <div className="modal-backdrop" onClick={() => setShowAdmin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Submissions</h2>
              <button onClick={() => setShowAdmin(false)} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              {contacts.length === 0 ? (
                <p className="text-center text-muted">No submissions yet.</p>
              ) : (
                <div className="contacts-list">
                  {contacts.map((contact) => (
                    <div key={contact.userId} className="contact-item">
                      <div className="contact-header">
                        <strong>{contact.name}</strong>
                        <span className="contact-date">
                          {new Date(contact.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="contact-email">{contact.email}</div>
                      {contact.subject && (
                        <div className="contact-subject">Subject: {contact.subject}</div>
                      )}
                      <div className="contact-message">{contact.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
