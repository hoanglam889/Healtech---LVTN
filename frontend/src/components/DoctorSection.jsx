import React from 'react';

const doctors = [
  { name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', rating: 4.9, reviews: 124 },
  { name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.8, reviews: 98 },
  { name: 'Dr. Emily Brooks', specialty: 'Pediatrician', rating: 5.0, reviews: 210 },
  { name: 'Dr. James Wilson', specialty: 'Orthopedist', rating: 4.7, reviews: 85 },
];

const DoctorSection = () => {
  return (
    <section id="doctors" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Top Rated Doctors</h2>
            <p className="text-gray-500 text-lg max-w-xl">Meet our team of experienced and highly recommended healthcare professionals.</p>
          </div>
          <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            View All Doctors &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doc, idx) => (
            <div key={idx} className="group flex flex-col gap-5 cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden relative transition-transform group-hover:scale-[1.02]">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">Photo</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                <p className="text-blue-600 font-medium mt-1">{doc.specialty}</p>
                <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                  <span className="text-yellow-400 text-base">★</span> 
                  <span className="font-semibold text-gray-700">{doc.rating}</span> 
                  ({doc.reviews} reviews)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;