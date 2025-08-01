import React from "react";

// Icons (You can also use React Icons or custom SVGs)
const CodeIcon = () => <span className="icon">💻</span>;
const SchoolIcon = () => <span className="icon">📚</span>;
const IdeaIcon = () => <span className="icon">💡</span>;
const GroupIcon = () => <span className="icon">👥</span>;

const About = () => {
  const features = [
    {
      icon: <CodeIcon />,
      title: "Interactive Coding",
      description: "Engaging lessons designed for young learners.",
    },
    {
      icon: <SchoolIcon />,
      title: "Hands-On Learning",
      description: "Practical projects to reinforce concepts.",
    },
    {
      icon: <IdeaIcon />,
      title: "Creative Challenges",
      description: "Fun activities to spark innovation.",
    },
    {
      icon: <GroupIcon />,
      title: "Community Support",
      description: "A safe space for kids to learn and grow.",
    },
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <h1 className="about-title">About Us</h1>
      <p className="about-subtitle">
        Welcome to <strong>Coding for Kids</strong>! We help young minds explore coding and technology.
      </p>

      {/* Mission Statement */}
      <div className="mission-box">
        <h2>Our Mission</h2>
        <p>
          We make coding <strong>fun</strong>, <strong>engaging</strong>, and <strong>accessible</strong> for kids. 
          Through interactive lessons, hands-on projects, and creative challenges, we inspire the next generation of innovators.
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="why-us">
        <h2>Why Choose Us?</h2>
        <p>
          At <strong>Coding for Kids</strong>, we focus on <strong>problem-solving</strong>, <strong>logic</strong>, and <strong>creativity</strong>—skills that benefit kids beyond coding.
        </p>
      </div>
    </div>
  );
};

export default About;