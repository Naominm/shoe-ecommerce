// components/common/Loader.jsx

function Loader() {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-[#FC7106]" // Custom size and color
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" // Adjusted for better centering
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.0" // Thinner, more modern stroke width
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </div>
    );
  }
  
  export default Loader;
  