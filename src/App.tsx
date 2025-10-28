import React, { useState } from 'react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import './styles/App.css';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-928e78a6/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-928e78a6/contacts`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contacts');
      }

      setContacts(data.contacts || []);
      setShowAdmin(true);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Failed to fetch contacts: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">MyWebsite</div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Welcome to MyWebsite</h1>
          <p>Professional solutions for your business needs</p>
          <a href="#contact" className="btn btn-primary">Get in Touch</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <p className="section-description">
            We are a dedicated team of professionals committed to delivering exceptional
            services and solutions. With years of experience in the industry, we pride
            ourselves on our attention to detail and customer satisfaction.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section section-gray">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🚀</div>
              <h3>Strategy</h3>
              <p>Comprehensive business strategies tailored to your goals</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💡</div>
              <h3>Consulting</h3>
              <p>Expert consulting services to help your business grow</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎯</div>
              <h3>Solutions</h3>
              <p>Innovative solutions designed for your success</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-description">
            Have a question or want to work together? Send us a message!
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
