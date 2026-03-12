import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { patientService } from '../services/patientService';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getPatients();
        setPatients(data);
      } catch (error) {
        setPatients(mockPatients);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const mockPatients = [
    { id: 1, name: 'John Doe', phone: '123-456-7890', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', phone: '098-765-4321', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', phone: '111-222-3333', email: 'bob@example.com', age: 45 },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading patients...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Age</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.age}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900 p-1 rounded transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;

