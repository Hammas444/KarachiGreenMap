'use client';

import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    title: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    company: 'Tech Innovations Inc.',
    joinDate: 'January 2022',
    bio: 'Passionate designer focused on creating intuitive and beautiful user experiences. Love solving complex problems with simple, elegant solutions.',
    avatar: null
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({ ...tempProfile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4">
      
       <Link href="/Pages/UserDashboard" className="absolute top-5 left-5 z-50 flex items-center gap-2 rounded-md bg-white/80 px-3 py-2 shadow-md hover:bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700 transition">
        <IconArrowLeft className="h-5 w-5 text-black dark:text-white" />
        <span className="text-black dark:text-white font-medium">Back</span>
      </Link>
      
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-linear-to-r from-[#1B5E20] via-[#4CAF50] to-[#81C784]">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/90 hover:bg-white text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-white/90 hover:bg-white text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white/90 hover:bg-white text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Picture */}
          <div className="relative px-8 pb-8">
            <div className="absolute -top-20 left-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-linear-to-br from-[#2E7D32] to-[#AED581]">
                  {tempProfile.avatar ? (
                    <img src={tempProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                      {tempProfile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-900 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-24">
              {/* Name and Title */}
              <div className="mb-6">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      className="text-3xl font-bold text-slate-800 border-b-2 border-violet-300 focus:border-violet-600 outline-none w-full"
                    />
                    <input
                      type="text"
                      value={tempProfile.title}
                      onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                      className="text-lg text-slate-600 border-b-2 border-violet-300 focus:border-violet-600 outline-none w-full"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{profile.name}</h1>
                    <p className="text-lg text-slate-600">{profile.title}</p>
                  </>
                )}
              </div>

              {/* Bio */}
              <div className="mb-8">
                {isEditing ? (
                  <textarea
                    value={tempProfile.bio}
                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                    className="w-full text-slate-700 leading-relaxed border-2 border-violet-300 focus:border-violet-600 outline-none rounded-lg p-3 resize-none"
                    rows="3"
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
                )}
              </div>

              {/* Contact Information Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <InfoCard
                  icon={<Mail size={20} className="text-green-600" />}
                  label="Email"
                  
                  value={tempProfile.email}
                  isEditing={isEditing}
                  onChange={(value) => setTempProfile({ ...tempProfile, email: value })}
                />
                <InfoCard
                  icon={<Phone size={20}  className="text-green-600" />}
                  label="Phone"
                 
                  value={tempProfile.phone}
                  isEditing={isEditing}
                  onChange={(value) => setTempProfile({ ...tempProfile, phone: value })}
                />
                <InfoCard
                  icon={<MapPin size={20} className="text-green-600" />}
                  label="Location"
                  
                  value={tempProfile.location}
                  isEditing={isEditing}
                  onChange={(value) => setTempProfile({ ...tempProfile, location: value })}
                />
                <InfoCard
                  icon={<Briefcase size={20} className="text-green-600" />}
                  label="Company"
                  
                  value={tempProfile.company}
                  isEditing={isEditing}
                  onChange={(value) => setTempProfile({ ...tempProfile, company: value })}
                />
              </div>

              {/* Additional Info */}
              <div className="bg-linear-to-r from-violet-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar size={20} className="text-green-600" />
                  <span className="font-medium">Joined:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.joinDate}
                      onChange={(e) => setTempProfile({ ...tempProfile, joinDate: e.target.value })}
                      className="bg-white border-2 border-violet-300 focus:border-violet-600 outline-none rounded px-2 py-1"
                    />
                  ) : (
                    <span>{profile.joinDate}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, isEditing, onChange }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-all">
      <div className="flex items-start gap-3">
        <div className="text-violet-600 mt-1">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          {isEditing ? (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full text-slate-800 font-medium bg-white border-2 border-violet-300 focus:border-violet-600 outline-none rounded px-2 py-1"
            />
          ) : (
            <p className="text-slate-800 font-medium">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}