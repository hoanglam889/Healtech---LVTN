import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center md:text-left space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Modern Healthcare <br /> <span className="text-blue-600">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto md:mx-0">
            Access top-tier medical professionals, skip the waiting room with our digital queue system, and manage your health seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow">
              Find a Doctor
            </button>
            <button className="bg-gray-50 text-gray-900 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all border border-gray-200">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="aspect-square md:aspect-[4/3] bg-blue-50 rounded-3xl overflow-hidden border border-blue-100 relative">
             <div className="absolute inset-0 flex items-center justify-center text-blue-300 font-medium text-lg">
                Hero Image Placeholder
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;