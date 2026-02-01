
import React, { useState } from 'react';
import { User, Severity, DisasterType } from '../types';

interface UserListProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const UserList: React.FC<UserListProps> = ({ users, setUsers }) => {
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    phone: '',
    location: { lat: 37.7749, lng: -122.4194, address: '' },
    alertRadiusKm: 10,
    disasterTypes: ['FIRE'],
    minSeverity: Severity.MEDIUM
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.phone || !newUser.location?.address) return;

    const userToAdd: User = {
      id: crypto.randomUUID(),
      name: newUser.name!,
      phone: newUser.phone!,
      location: {
        lat: newUser.location!.lat,
        lng: newUser.location!.lng,
        address: newUser.location!.address
      },
      alertRadiusKm: newUser.alertRadiusKm || 10,
      disasterTypes: newUser.disasterTypes || ['FIRE'],
      minSeverity: newUser.minSeverity || Severity.MEDIUM,
    };

    setUsers(prev => [...prev, userToAdd]);
    setShowForm(false);
    setNewUser({
      name: '',
      phone: '',
      location: { lat: 37.7749, lng: -122.4194, address: '' },
      alertRadiusKm: 10,
      disasterTypes: ['FIRE'],
      minSeverity: Severity.MEDIUM
    });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleDisaster = (type: DisasterType) => {
    const current = newUser.disasterTypes || [];
    if (current.includes(type)) {
      setNewUser({ ...newUser, disasterTypes: current.filter(t => t !== type) });
    } else {
      setNewUser({ ...newUser, disasterTypes: [...current, type] });
    }
  };

  const disasterOptions: DisasterType[] = ['FIRE', 'FLOOD', 'STORM', 'EARTHQUAKE', 'CHEMICAL', 'OTHER'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">User Registry</h2>
          <p className="text-slate-400">Manage citizen notification preferences and geographical locations.</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-sm">
          <span className="text-slate-500">Active Subscriptions:</span> <span className="text-white font-bold">{users.length}</span>
        </div>
      </div>

      {showForm ? (
        <div className="bg-slate-800 border border-indigo-500/50 rounded-xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-indigo-400">Add New Resident</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={newUser.phone}
                  onChange={e => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="+15550000"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Residential Address</label>
                <input 
                  required
                  type="text" 
                  value={newUser.location?.address}
                  onChange={e => setNewUser({...newUser, location: {...newUser.location!, address: e.target.value}})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="123 Main St, San Francisco"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Radius (KM)</label>
                <input 
                  type="number" 
                  value={newUser.alertRadiusKm}
                  onChange={e => setNewUser({...newUser, alertRadiusKm: parseInt(e.target.value)})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Min. Severity Threshold</label>
                <select 
                  value={newUser.minSeverity}
                  onChange={e => setNewUser({...newUser, minSeverity: e.target.value as Severity})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Disaster Interests</label>
              <div className="flex flex-wrap gap-2">
                {disasterOptions.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleDisaster(type)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                      newUser.disasterTypes?.includes(type) 
                      ? 'bg-indigo-600 border-indigo-400 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Save Resident
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => (
            <div key={user.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 transition-all group relative">
              <button 
                onClick={() => deleteUser(user.id)}
                className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400">
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
                    <p className="text-xs text-slate-500">{user.phone}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                  user.minSeverity === Severity.CRITICAL ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                  user.minSeverity === Severity.HIGH ? 'bg-orange-900/20 text-orange-400 border-orange-900/50' :
                  'bg-slate-900 text-slate-500 border-slate-700'
                }`}>
                  MIN: {user.minSeverity}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <i className="fas fa-location-dot text-slate-500 mt-1"></i>
                  <div>
                    <p className="text-slate-300 font-medium">{user.location.address}</p>
                    <p className="text-xs text-slate-500 italic">Radius: {user.alertRadiusKm}km coverage</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.disasterTypes.map(type => (
                    <span key={type} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-400 uppercase tracking-tighter">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setShowForm(true)}
            className="bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-800 hover:border-indigo-500/50 transition-all group"
          >
            <i className="fas fa-user-plus text-3xl text-slate-700 group-hover:text-indigo-500 mb-2 transition-colors"></i>
            <h4 className="font-bold text-slate-400 group-hover:text-indigo-300 transition-colors">Add New Resident</h4>
            <p className="text-xs text-slate-500">Add a citizen to the emergency notification pool.</p>
          </button>
        </div>
      )}
    </div>
  );
};
