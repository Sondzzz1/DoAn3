import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', minHeight: '50vh' }}>
      <h1 style={{ color: '#ff7b00' }}>{title}</h1>
      <p>Trang này đang được xây dựng.</p>
    </div>
  );
};

export default PlaceholderPage;
