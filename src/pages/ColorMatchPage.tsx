import React from 'react';
import ColorMatcher from '../components/colorMatch/ColorMatcher';
import './ColorMatchPage.css';

const ColorMatchPage: React.FC = () => {
  return (
    <div className="color-match-page">
      <ColorMatcher />
    </div>
  );
};

export default ColorMatchPage;

