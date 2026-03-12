import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, MoreVertical, Calendar } from 'lucide-react';
import { patientService } from '../services/patientService';
import toast from 'react-hot-toast';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getPatients();
        setPatients(data || []);
      } catch (error) {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Patient Directory</h1>
          <p className="text-slate-500 mt-1">Manage and view all registered clinic patients.</p>
        </div>
        <button 
          onClick={() => toast('Add patient modal coming soon!')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Patient</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
           <div className="relative w-full max-w-md">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search patients by name or email..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
             />
           </div>
           
           <div className="text-sm text-slate-500 font-medium">
             Total: <span className="text-slate-900 font-bold">{filteredPatients.length}</span>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Patient Name</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Last Visit</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading patients database...</td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold font-mono text-lg border border-blue-200">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{patient.name}</div>
                          <div className="text-xs text-slate-500">ID: #{patient._id.substring(0,6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium text-sm">{patient.phone || 'N/A'}</div>
                      <div className="text-slate-500 text-sm">{patient.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-600 bg-slate-100 w-max px-2.5 py-1 rounded-md text-sm">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {patient.lastVisit || 'First Visit'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-slate-500 bg-slate-50">
                      <div className="flex flex-col items-center justify-center space-y-3">
                         <Users className="w-10 h-10 text-slate-300" />
                         <p>No patients found matching your search.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
