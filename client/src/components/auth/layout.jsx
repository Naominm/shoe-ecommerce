import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

// Import images from the assets folder
import image1 from '@/assets/image1.jpeg'; // Adjust the path as necessary
import image2 from '@/assets/images.jpeg'; // Adjust the path as necessary
import image3 from '@/assets/kids.jpg'; // Adjust the path as necessary
import icon from '@/assets/logo.png'; // Path to your icon image
import image6 from '@/assets/adriot.jpeg';
import image7 from '@/assets/white-sneakers.jpeg';


// Create an array of images

const shoeImages = [image1, image2, image3,image6,image7]; // Use the imported images

function AuthLayout() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % shoeImages.length);
    }, 6000); // Change image every 6 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-orange-500 w-1/2 m-2 px-12 py-8 relative overflow-hidden rounded-lg">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <img
          src={shoeImages[currentImage]}
          alt="Shoe"
          className="absolute inset-0 object-cover w-full h-full transition-opacity duration-700 ease-in-out opacity-100 transform scale-105 z-0"
        />
        <div className="max-w-md space-y-6 text-center text-white relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Welcome to Kanyoni's
          </h1>
          <p className="text-lg">Explore our unique collection of shoes today!</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-6">
          <img
            src={icon}
            alt="Kanyoni Icon"
            className="h-16 w-16 mb-2"
          />
          <h2 className="text-sm font-bold text-orange-600">
            Kanyoni Shoe Collection
          </h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
