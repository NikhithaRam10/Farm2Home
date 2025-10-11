import React from 'react';
import '../index.css';

const About = () => {
  return (
    <div className="box">
      <h2>About Farm-to-Home</h2>
      <p style={{ margin: '1rem 0' }}>
        <strong>Farm-to-Home</strong> is a platform that bridges the gap between local producers and consumers.
        Our goal is to promote healthy, direct-from-farm food delivery while supporting small-scale farmers.
      </p>

      <p>
        Built with a passion for sustainable living and transparency in food sourcing, this initiative aims to empower
        both ends of the supply chain.
      </p>

      <hr style={{ margin: '1.5rem 0', borderColor: 'rgba(255, 255, 255, 0.3)' }} />

      <h3>Contact</h3>
      <p>Name: <strong>Ketha Akhila</strong></p>
      <p>Email: <a href="mailto:akhilaketha123@gmail.com" style={{ color: '#fff', textDecoration: 'underline' }}>akhilaketha123@gmail.com</a></p>
    </div>
  );
};

export default About;
