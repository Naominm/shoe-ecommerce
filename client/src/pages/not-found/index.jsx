import React from 'react';
import backgroundImage from '@/assets/unauth.png'; // Import the background image

function UnauthPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Set the background image
    >
      <h1 className="text-9xl font-extrabold text-gray drop-shadow-lg text-center">
        {/* 404 - Page Not Found */}
      </h1>
    </div>
  );
}

export default UnauthPage;
