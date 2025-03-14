import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
      
      {status === 'success' && (
        <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded mb-6">
          Thank you for your message! We'll get back to you soon.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 text-white">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded border border-accent-light/50 bg-white/10 text-white text-base"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-white">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded border border-accent-light/50 bg-white/10 text-white text-base"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block mb-2 text-white">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            className="w-full p-3 rounded border border-accent-light/50 bg-white/10 text-white text-base"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="bg-gradient-to-r from-accent to-accent-light bg-[length:200%] bg-[0%] text-white border-none py-3 px-6 rounded text-base cursor-pointer transition-all hover:bg-[100%] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
