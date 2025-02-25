import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import kbContacts from '../data/kbContacts.json';

export const Offices = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Krishi Bahavan Offices</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kbContacts.map((office) => (
          <div key={office.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{office.name}</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-700">{office.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-600" />
                <p className="text-gray-600">{office.contact}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-600" />
                <p className="text-gray-600">{office.email}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-green-600" />
                <p className="text-gray-600">9:00 AM - 5:00 PM (Mon-Sat)</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};