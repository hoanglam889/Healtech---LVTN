import React from 'react';

const ContactSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get in Touch</h2>
          <p className="text-gray-500 text-lg leading-relaxed">Have questions about our services or need help booking an appointment? Our support team is here to help you.</p>
          
          <div className="space-y-8 mt-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">📍</div>
              <div className="pt-1">
                <h4 className="font-semibold text-gray-900 mb-1">Office Location</h4>
                <p className="text-gray-500">123 Healthcare Ave, Medical District<br />New York, NY 10001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">📞</div>
              <div className="pt-1">
                <h4 className="font-semibold text-gray-900 mb-1">Phone Number</h4>
                <p className="text-gray-500">+1 (555) 123-4567<br />Mon-Fri 8am-6pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <form className="bg-white p-8 md:p-10 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;