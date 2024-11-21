import React from 'react';
import './About.css'
const About = () => {
  return (
    <div>
      <h1>About WeaveSense</h1>
      <p>
        Welcome to WeaveSense! Our platform is designed to make exploring properties by ZIP code seamless and intuitive. Whether you're searching for your dream home or analyzing real estate trends, WeaveSense is here to help.
      </p>
      <p>
        Currently, you can search properties in the following states and territories:
      </p>
      <p className="state-list">
        Connecticut, Delaware, Georgia, Maine, Massachusetts, New Hampshire, New Jersey, 
        New York, Pennsylvania, Puerto Rico, 
        Rhode Island, South Carolina, Tennessee, 
        Vermont, Virgin Islands, Virginia, West Virginia, Wyoming.
      </p>
      <p>
        We are continuously working to expand our coverage and include more states and ZIP codes. Stay tuned for updates!
      </p>
    </div>
  );
};

export default About;

