import React, { useState, useEffect } from "react";
import Header from "../../components/common/header.jsx";
import Sidebar from "../../components/common/sidebar.jsx";
import Footer from "../../components/common/footer.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, CheckCircle, Info, Users, Search,
  MapPin, Phone, Mail, Calendar, Eye, 
  Plus, X, Download, TrendingUp, Briefcase, ChevronRight, Save,
  Clock, AlertCircle, Check, MessageSquare, Globe, Hash, Building2,
  Edit3, ArrowLeft, Send, Shield
} from "lucide-react";
import api from "../../api.js";

const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, type = "text", required = false, name }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-emerald-400 transition-colors flex items-center gap-2">
      {Icon && <Icon size={12} />}
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all font-outfit text-sm"
      />
    </div>
  </div>
);

const SelectGroup = ({ label, icon: Icon, value, onChange, options, required = false, name }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-emerald-400 transition-colors flex items-center gap-2">
      {Icon && <Icon size={12} />}
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer font-outfit text-sm"
      >
        <option value="" className="bg-[#1e293b]">Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-[#1e293b]">{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <ChevronRight className="rotate-90" size={16} />
      </div>
    </div>
  </div>
);

const CUISINE_MAP = {
  "0": "Indian",
  "1": "Afghan",
  "2": "Pakistani",
  "3": "Chinese",
  "4": "Italian",
  "5": "Thai",
  "6": "Mexican",
  "7": "Fried Chicken"
};

const DetailRow = ({ label, value, icon: Icon, isFile = false, isCuisine = false }) => {
  const API = import.meta.env.VITE_API_URL || "";
  const API_BASE = API ? API.replace(/\/api\/?$/i, "") : "";
  const fileUrl = (value && isFile && typeof value === 'string') ? `${API_BASE}/uploads/${value}` : null;
  
  let displayValue = value;
  if (isCuisine && value) {
    displayValue = String(value).split(',').map(id => CUISINE_MAP[id.trim()] || id.trim()).join(', ');
  }

  return (
    <div className="flex items-center gap-4 p-5 bg-white/[0.03] rounded-2xl border border-white/10 group hover:border-emerald-500/30 transition-all">
      <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
        {Icon && <Icon className="text-emerald-400" size={20} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">{label}</p>
        {fileUrl ? (
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 font-black uppercase tracking-tighter hover:text-white transition-colors flex items-center gap-1.5"
          >
            View Document <Eye size={12} />
          </a>
        ) : (
          <p className="text-sm text-white font-bold truncate">{displayValue || "—"}</p>
        )}
      </div>
    </div>
  );
};

const FileUpload = ({ label, name, value, onChange, icon: Icon, required = false }) => {
  const fileInputRef = React.useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ target: { name, value: file } });
    }
  };

  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-emerald-400 transition-colors flex items-center gap-2">
        {Icon && <Icon size={12} />}
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex items-center gap-4 p-4 bg-white/[0.03] border-2 border-dashed ${value ? 'border-emerald-500/30 bg-emerald-500/20' : 'border-white/10'} rounded-2xl hover:border-emerald-500/50 transition-all cursor-pointer overflow-hidden group/upload`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
        />
        <div className="flex-1 min-w-0">
          {value ? (
            <div className="flex items-center gap-3 truncate">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Check className="text-emerald-400" size={14} />
              </div>
              <span className="text-sm text-white font-bold truncate">
                {typeof value === 'string' ? value : value.name}
              </span>
            </div>
          ) : (
            <span className="text-sm text-white/20 font-medium">Click to upload document (PDF/JPG/PNG)</span>
          )}
        </div>
        <div className="p-2 bg-white/5 group-hover/upload:bg-emerald-500/10 rounded-lg transition-colors">
          <Plus className="text-white/20 group-hover/upload:text-emerald-400" size={16} />
        </div>
      </div>
    </div>
  );
};

export default function RestaurantRegistration() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [merchantProfiles, setMerchantProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Modals state
  const [viewingProfile, setViewingProfile] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    surname: "",
    email: "",
    country_code: "IN",
    mobile_number: "",
    landline_number: "",
    store_address: "",
    floor_suite: "",
    store_name: "",
    brand_name: "",
    business_type: "Restaurant",
    cuisine_type: "",
    number_of_locations: "",
    social_media_website_link: "",
    // Verification fields
    food_business_license: "",
    food_hygiene_certificate: "",
    business_registration_certificate: "",
    vat_registration_number: "",
    owner_id_proof_type: "",
    owner_id_proof_file: "",
    bank_account_name: "",
    bank_account_number: "",
    bank_sort_code: "",
    bank_statement_file: "",
    address_proof_type: "",
    address_proof_file: "",
    food_hygiene_rating: "",
    allergen_info_file: "",
    is_halal: "0"
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const isSA = Number(user.role_id) === 6;
        setIsSuperAdmin(isSA);
        
        if (isSA) {
          await fetchMerchantProfiles();
        } else {
          await fetchMyProfile();
        }
      }
    } catch (err) {
      console.error("Init error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchantProfiles = async () => {
    try {
      const res = await api.get("/merchant-profiles");
      if (res.data.success) {
        setMerchantProfiles(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching merchant profiles:", err);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const res = await api.get("/merchant-profile/me");
      if (res.data.success && res.data.data) {
        setMyProfile(res.data.data);
        // Sync formData just in case user wants to edit
        setFormData({
          first_name: res.data.data.first_name || "",
          surname: res.data.data.surname || "",
          email: res.data.data.email || "",
          country_code: res.data.data.country_code || "IN",
          mobile_number: res.data.data.mobile_number || "",
          landline_number: res.data.data.landline_number || "",
          store_address: res.data.data.store_address || "",
          floor_suite: res.data.data.floor_suite || "",
          store_name: res.data.data.store_name || "",
          brand_name: res.data.data.brand_name || "",
          business_type: res.data.data.business_type || "Restaurant",
          cuisine_type: res.data.data.cuisine_type || "",
          number_of_locations: res.data.data.number_of_locations || "",
          social_media_website_link: res.data.data.social_media_website_link || "",
          food_business_license: res.data.data.food_business_license || "",
          food_hygiene_certificate: res.data.data.food_hygiene_certificate || "",
          business_registration_certificate: res.data.data.business_registration_certificate || "",
          vat_registration_number: res.data.data.vat_registration_number || "",
          owner_id_proof_type: res.data.data.owner_id_proof_type || "",
          owner_id_proof_file: res.data.data.owner_id_proof_file || "",
          bank_account_name: res.data.data.bank_account_name || "",
          bank_account_number: res.data.data.bank_account_number || "",
          bank_sort_code: res.data.data.bank_sort_code || "",
          bank_statement_file: res.data.data.bank_statement_file || "",
          address_proof_type: res.data.data.address_proof_type || "",
          address_proof_file: res.data.data.address_proof_file || "",
          food_hygiene_rating: res.data.data.food_hygiene_rating || "",
          allergen_info_file: res.data.data.allergen_info_file || "",
          is_halal: String(res.data.data.is_halal || "0")
        });
      } else {
        setMyProfile(null);
      }
    } catch (err) {
      console.error("Error fetching my profile:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
            fd.append(key, formData[key]);
        } else if (formData[key] !== "" && formData[key] !== null) {
            fd.append(key, formData[key]);
        }
    });

    try {
      let res;
      if (myProfile) {
        // Update
        res = await api.put("/merchant-profile/my-update", fd);
      } else {
        // Create
        res = await api.post("/merchant-profiles", fd);
      }

      if (res.data.success) {
        await fetchMyProfile();
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error submitting registration:", err);
      if (err.response?.status === 409) {
        alert("A registration request has already been submitted for this account.");
        await fetchMyProfile();
      } else {
        alert("Submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status, reason = null) => {
    try {
      const res = await api.put(`/merchant-profile/update-status/${id}`, { status, rejection_reason: reason });
      if (res.data.success) {
        await fetchMerchantProfiles();
        setRejectingId(null);
        setRejectionReason("");
        setViewingProfile(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Update failed.");
    }
  };

  const filteredProfiles = merchantProfiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.store_name?.toLowerCase().includes(q) ||
      p.first_name?.toLowerCase().includes(q) ||
      p.surname?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-teal-800 to-emerald-900 font-outfit">
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`flex-1 flex flex-col pt-36 lg:pt-24 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:pl-72" : "lg:pl-0"}`}>
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 text-white min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            
            {/* Page Header - Hidden when editing or viewing status to save space */}
            {!isEditing && !(myProfile && !isSuperAdmin) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                      <Store className="text-white" size={28} />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black text-white drop-shadow-lg tracking-tight uppercase">Restaurant Registration</h1>
                      <p className="text-white/90 mt-1 text-base drop-shadow">
                        {isSuperAdmin ? "Approval queue for merchant store profiles" : "Register your business and track your application status"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {isSuperAdmin ? (
              /* SUPER ADMIN VIEW: LIST OF SUBMISSIONS */
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Total Apps</p>
                      <h3 className="text-2xl font-black mt-1">{merchantProfiles.length}</h3>
                    </div>
                    <Users className="text-white/20" size={28} />
                  </div>
                  <div className="bg-amber-500/10 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/20 shadow-2xl flex items-center justify-between text-amber-400">
                    <div>
                      <p className="text-amber-400/60 text-[10px] font-black uppercase tracking-widest">Pending</p>
                      <h3 className="text-2xl font-black mt-1">{merchantProfiles.filter(p=>p.status===0).length}</h3>
                    </div>
                    <Clock size={28} />
                  </div>
                  <div className="bg-emerald-500/10 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/20 shadow-2xl flex items-center justify-between text-emerald-400">
                    <div>
                      <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-widest">Approved</p>
                      <h3 className="text-2xl font-black mt-1">{merchantProfiles.filter(p=>p.status===1).length}</h3>
                    </div>
                    <CheckCircle size={28} />
                  </div>
                  <div className="bg-rose-500/10 backdrop-blur-xl rounded-2xl p-5 border border-rose-500/20 shadow-2xl flex items-center justify-between text-rose-400">
                    <div>
                      <p className="text-rose-400/60 text-[10px] font-black uppercase tracking-widest">Declined</p>
                      <h3 className="text-2xl font-black mt-1">{merchantProfiles.filter(p=>p.status===2).length}</h3>
                    </div>
                    <AlertCircle size={28} />
                  </div>
                </div>

                {/* Search & Actions */}
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input 
                    type="text"
                    placeholder="Search by store name, applicant name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 shadow-2xl transition-all"
                  />
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-white/5 text-left border-b border-white/5">
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Business</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Applicant</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Status</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-white/30 tracking-[0.3em] text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredProfiles.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="px-10 py-16 text-center opacity-40 uppercase tracking-widest font-black">No Records Found</td>
                            </tr>
                        ) : (
                          filteredProfiles.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg ${p.status === 1 ? 'bg-emerald-500' : p.status === 2 ? 'bg-rose-500' : 'bg-amber-500'}`}>
                                      {p.store_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="font-black text-lg tracking-tight uppercase">{p.store_name}</p>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <p className="font-bold">{p.first_name} {p.surname}</p>
                                  <p className="text-white/40 text-[10px] mt-0.5">{p.email}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                      <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 ${p.status === 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : p.status === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                        {p.status === 0 && <Clock size={10} />}
                                        {p.status === 1 && <CheckCircle size={10} />}
                                        {p.status === 2 && <X size={10} />}
                                        {p.status === 0 ? "Pending" : p.status === 1 ? "Approved" : "Declined"}
                                      </span>
                                      <button onClick={() => setViewingProfile(p)} className="p-1.5 bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 rounded-lg transition-all border border-white/10"><Eye size={14} /></button>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center justify-center gap-3">
                                    {p.status === 0 && (
                                      <>
                                        <button onClick={() => handleUpdateStatus(p.id, 1)} className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition-all"><Check size={18} /></button>
                                        <button onClick={() => setRejectingId(p.id)} className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-all"><X size={18} /></button>
                                      </>
                                    )}
                                  </div>
                                </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : myProfile && !isEditing ? (
              /* COMPACT USER VIEW: STATUS SCREEN */
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="bg-white/10 backdrop-blur-[40px] rounded-[2.5rem] p-10 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden w-full max-w-4xl">
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="relative flex flex-col items-center text-center space-y-8">
                     
                     {/* Status Icon */}
                     <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border shadow-2xl relative ${myProfile.status === 0 ? 'bg-amber-500/10 border-amber-500/30' : myProfile.status === 1 ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                        {myProfile.status === 0 && <Clock size={40} className="text-amber-400" />}
                        {myProfile.status === 1 && <CheckCircle size={40} className="text-emerald-400" />}
                        {myProfile.status === 2 && <AlertCircle size={40} className="text-rose-400" />}
                     </div>

                     {/* Main Text */}
                     <div className="space-y-4">
                        <h2 className={`text-4xl font-black uppercase tracking-tight leading-none ${myProfile.status === 1 ? 'text-emerald-400' : myProfile.status === 2 ? 'text-rose-400' : 'text-white'}`}>
                           {myProfile.status === 0 ? "APPLICATION UNDER REVIEW" : myProfile.status === 1 ? "PARTNER VERIFIED" : "APPLICATION DECLINED"}
                        </h2>
                        <p className="text-white/60 text-lg font-medium max-w-2xl leading-relaxed">
                           {myProfile.status === 0 && <>Your request has been successfully submitted. Our enterprise compliance team is currently auditing your store details. Please expect formal acceptance within <span className="text-emerald-400 font-black">24 hours</span>.</>}
                           {myProfile.status === 1 && <>Congratulations! <span className="font-black text-white">{myProfile.store_name}</span> is now a verified ZingBite partner. You can now access your restaurant operations.</>}
                           {myProfile.status === 2 && <>Unfortunately, your application for <span className="font-black text-white">{myProfile.store_name}</span> was not successful this time.</>}
                        </p>
                     </div>

                     {/* Compact Info Badges */}
                     <div className="flex flex-wrap items-center justify-center gap-3">
                        <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-start">
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Store Profile</span>
                           <span className="font-black text-sm uppercase">{myProfile.store_name}</span>
                        </div>
                        <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-start">
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Reference ID</span>
                           <span className="font-black text-sm text-emerald-400">#ZBR-{myProfile.id.toString().padStart(4, '0')}</span>
                        </div>
                        {myProfile.status === 2 && myProfile.rejection_reason && (
                           <div className="px-5 py-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex flex-col items-start max-w-xs">
                              <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Audit Feedback</span>
                              <span className="font-bold text-rose-100 text-[11px] italic line-clamp-1">"{myProfile.rejection_reason}"</span>
                           </div>
                        )}
                     </div>

                     {/* Action Buttons */}
                     <div className="pt-4 flex flex-wrap gap-4 items-center justify-center">
                        {myProfile.status === 1 ? (
                          <button className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl transition-all active:scale-95">
                             Launch My Dashboard
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => setViewingProfile(myProfile)}
                              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/10 transition-all flex items-center gap-2"
                            >
                               <Eye size={16} /> View Submitted Details
                            </button>
                            <button 
                               onClick={() => setIsEditing(true)}
                               className="px-8 py-4 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-emerald-500/20 transition-all flex items-center gap-2"
                            >
                               <Edit3 size={16} /> Edit & Resubmit
                            </button>
                          </>
                        )}
                     </div>

                     {myProfile.status === 2 && (
                       <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Modified application will go back for a fresh review audit</p>
                     )}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* REGISTRATION FORM (Create or Edit) */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto bg-white/10 backdrop-blur-[40px] rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden mb-10"
              >
                <div className="px-10 py-10 border-b border-white/10 bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div>
                    <div className="flex items-center gap-4 mb-2">
                        {isEditing ? (
                           <button onClick={() => setIsEditing(false)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"><ArrowLeft size={20} /></button>
                        ) : (
                          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-400/30"><Plus className="text-emerald-400" size={24} /></div>
                        )}
                        <h2 className="text-3xl font-black uppercase tracking-tight text-white">{isEditing ? "Modify Application" : "Merchant Onboarding"}</h2>
                    </div>
                    <p className="text-white/40 font-bold text-sm uppercase tracking-widest">{isEditing ? "Refine your business profile and trigger a re-audit" : "Initiate your enterprise partnership with ZingBite"}</p>
                   </div>
                   {isEditing && (
                     <div className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} /> Editing Mode
                     </div>
                   )}
                </div>

                <form onSubmit={handleSubmit} className="p-10 md:p-12 space-y-12">
                   {/* Personal Info */}
                   <div className="space-y-10">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 shrink-0">Section 01. Contact Protocol</h3>
                      <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <InputGroup label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Legal name" icon={Users} required />
                      <InputGroup label="Last Name" name="surname" value={formData.surname} onChange={handleInputChange} placeholder="Last name" icon={Users} required />
                      <InputGroup label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Business email" icon={Mail} required />
                      <InputGroup label="Land Line Number" name="landline_number" value={formData.landline_number} onChange={handleInputChange} placeholder="Landline connection" icon={Phone} />
                      
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-emerald-400 transition-colors flex items-center gap-2">
                          <Phone size={12} /> Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                           <div className="col-span-1">
                              <select
                                name="country_code"
                                value={formData.country_code}
                                onChange={handleInputChange}
                                className="w-full px-2 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 transition-all text-center text-xs font-bold appearance-none cursor-pointer"
                              >
                                <option value="IN" className="bg-[#1e293b]">+91 (IN)</option>
                                <option value="UK" className="bg-[#1e293b]">+44 (UK)</option>
                              </select>
                           </div>
                           <div className="col-span-3">
                              <input
                                type="text"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleInputChange}
                                placeholder="Main operator line"
                                required
                                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all font-outfit text-sm"
                              />
                           </div>
                        </div>
                      </div>

                      <InputGroup label="Digital Signature" name="social_media_website_link" value={formData.social_media_website_link} onChange={handleInputChange} placeholder="Website or Social link" icon={Globe} />
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="space-y-10 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 shrink-0">Section 02. Establishment Profile</h3>
                      <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                       <InputGroup label="Trading Name" name="store_name" value={formData.store_name} onChange={handleInputChange} placeholder="Licensed name" icon={Store} required />
                       <InputGroup label="Brand identity" name="brand_name" value={formData.brand_name} onChange={handleInputChange} placeholder="Public brand name" icon={Briefcase} required />
                       
                       <SelectGroup label="Business Category" name="business_type" value={formData.business_type} onChange={handleInputChange} options={[{ value: "Restaurant", label: "Restaurant" }, { value: "Bakery", label: "Bakery" }, { value: "Cafe", label: "Cafe" }]} icon={Briefcase} required />
                        <SelectGroup 
                          label="Primary Cuisine" 
                          name="cuisine_type" 
                          value={formData.cuisine_type} 
                          onChange={handleInputChange} 
                          options={[
                            { value: "0", label: "Indian" }, 
                            { value: "1", label: "Afghan" }, 
                            { value: "2", label: "Pakistani" }, 
                            { value: "3", label: "Chinese" }, 
                            { value: "4", label: "Italian" }, 
                            { value: "5", label: "Thai" }, 
                            { value: "6", label: "Mexican" }, 
                            { value: "7", label: "Fried Chicken" }
                          ]} 
                          icon={Store} 
                          required 
                        />
                       
                       <SelectGroup label="Network Scope" name="number_of_locations" value={formData.number_of_locations} onChange={handleInputChange} options={[{ value: "1", label: "Single Unit" }, { value: "2-5", label: "2-5 Units" }, { value: "5+", label: "5+ Units" }]} icon={Building2} required />
                       <InputGroup label="Floor / Unit Number" name="floor_suite" value={formData.floor_suite} onChange={handleInputChange} placeholder="e.g. Ground Floor, Suite 402" icon={Building2} />
                       
                       <div className="md:col-span-2">
                        <InputGroup label="Operational Address" name="store_address" value={formData.store_address} onChange={handleInputChange} placeholder="Full physical location address" icon={MapPin} required />
                       </div>
                    </div>
                  </div>

                  {/* Section 03: Verification & Compliance */}
                  <div className="space-y-10 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 shrink-0">Section 03. Verification & Compliance</h3>
                      <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                    </div>
                    <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Please upload clear, valid copies of your official licensing to ensure a smooth audit process.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                       <FileUpload label="Food Business License" name="food_business_license" value={formData.food_business_license} onChange={handleInputChange} icon={CheckCircle} required />
                       <FileUpload label="Food Hygiene Certificate" name="food_hygiene_certificate" value={formData.food_hygiene_certificate} onChange={handleInputChange} icon={Shield} required />
                       <FileUpload label="Business Registration Cert" name="business_registration_certificate" value={formData.business_registration_certificate} onChange={handleInputChange} icon={Briefcase} required />
                       <InputGroup label="VAT Registration Number" name="vat_registration_number" value={formData.vat_registration_number} onChange={handleInputChange} placeholder="Tax Identifier" icon={Hash} />
                    </div>
                  </div>

                  {/* Section 04: Ownership Verification */}
                  <div className="space-y-10 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 shrink-0">Section 04. Ownership Verification</h3>
                      <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                       <div className="space-y-8">
                          <SelectGroup 
                            label="Owner ID Proof Type" 
                            name="owner_id_proof_type" 
                            value={formData.owner_id_proof_type} 
                            onChange={handleInputChange} 
                            options={[
                              { value: "passport", label: "International Passport" }, 
                              { value: "driving_license", label: "Driving License" }, 
                              { value: "national_id", label: "National ID Card" }
                            ]} 
                            icon={Users} 
                            required 
                          />
                          <FileUpload label="Owner ID Proof File" name="owner_id_proof_file" value={formData.owner_id_proof_file} onChange={handleInputChange} icon={Plus} required />
                       </div>

                       <div className="space-y-8">
                          <SelectGroup 
                            label="Address Proof Type" 
                            name="address_proof_type" 
                            value={formData.address_proof_type} 
                            onChange={handleInputChange} 
                            options={[
                              { value: "utility_bill", label: "Utility Bill" }, 
                              { value: "bank_statement", label: "Bank Statement" }, 
                              { value: "lease_agreement", label: "Lease Agreement" }
                            ]} 
                            icon={MapPin} 
                            required 
                          />
                          <FileUpload label="Address Proof File" name="address_proof_file" value={formData.address_proof_file} onChange={handleInputChange} icon={Plus} required />
                       </div>
                    </div>
                  </div>

                  {/* Section 05: Financial Architecture */}
                  <div className="space-y-10 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 shrink-0">Section 05. Financial Architecture</h3>
                      <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                       <InputGroup label="Bank Account Name" name="bank_account_name" value={formData.bank_account_name} onChange={handleInputChange} placeholder="Primary beneficiary" icon={Users} required />
                       <InputGroup label="Bank Account Number" name="bank_account_number" value={formData.bank_account_number} onChange={handleInputChange} placeholder="Account digits" icon={Hash} required />
                       <InputGroup label="Bank Sort Code" name="bank_sort_code" value={formData.bank_sort_code} onChange={handleInputChange} placeholder="Financial identifier" icon={Building2} required />
                       <FileUpload label="Bank Statement" name="bank_statement_file" value={formData.bank_statement_file} onChange={handleInputChange} icon={Download} required />
                    </div>
                  </div>

                  {/* Section 06: Food Safety Standards */}
                  <div className="space-y-10 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 shrink-0">Section 06. Food Safety Standards</h3>
                      <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                       <InputGroup label="Food Hygiene Rating" name="food_hygiene_rating" value={formData.food_hygiene_rating} onChange={handleInputChange} placeholder="Latest Audit Score" icon={TrendingUp} />
                       <SelectGroup 
                          label="Halal Certified?" 
                          name="is_halal" 
                          value={formData.is_halal} 
                          onChange={handleInputChange} 
                          options={[
                            { value: "0", label: "No / Not Applicable" }, 
                            { value: "1", label: "Yes, 100% Halal" }
                          ]} 
                          icon={Shield} 
                       />
                       <div className="md:col-span-2">
                        <FileUpload label="Allergen Information File" name="allergen_info_file" value={formData.allergen_info_file} onChange={handleInputChange} icon={AlertCircle} />
                       </div>
                    </div>
                  </div>

                   <div className="md:col-span-2 space-y-12">
                     <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black uppercase tracking-widest text-lg rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-40"
                     >
                        {submitting ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : (isEditing ? <><Send size={22} /> Resubmit Application for Audit</> : <><Save size={22} /> Finalize & Submit Application</>)}
                     </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* DETAIL VIEW MODAL (UNI-MODAL FOR BOTH ADMIN & USER) */}
            <AnimatePresence>
              {viewingProfile && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#0f172a] w-full max-w-4xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                  >
                    <div className="px-8 py-6 bg-white/5 border-b border-white/10 flex justify-between items-center shrink-0">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg ${viewingProfile.status === 1 ? 'bg-emerald-500' : viewingProfile.status === 2 ? 'bg-rose-500' : 'bg-amber-500'}`}>
                            {viewingProfile.store_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">{viewingProfile.store_name}</h3>
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Application ID #ZBR-{viewingProfile.id}</p>
                          </div>
                       </div>
                       <button onClick={() => setViewingProfile(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Contact Details */}
                            <div className="space-y-4">
                               <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2 flex items-center gap-2">
                                  <Users size={14} /> Contact Information
                               </h5>
                               <div className="grid grid-cols-1 gap-3">
                                  <DetailRow label="Applicant Name" value={`${viewingProfile.first_name} ${viewingProfile.surname}`} icon={Users} />
                                  <DetailRow label="Direct Email" value={viewingProfile.email} icon={Mail} />
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <DetailRow label="Mobile Line" value={`${viewingProfile.country_code} ${viewingProfile.mobile_number}`} icon={Phone} />
                                    <DetailRow label="Landline" value={viewingProfile.landline_number || "N/A"} icon={Phone} />
                                  </div>
                               </div>
                            </div>

                            {/* Store Details */}
                            <div className="space-y-4">
                               <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2 flex items-center gap-2">
                                  <Building2 size={14} /> Business Architecture
                               </h5>
                               <div className="grid grid-cols-1 gap-3">
                                  <DetailRow label="Brand Identify" value={viewingProfile.brand_name} icon={Briefcase} />
                                  <DetailRow label="Business Category" value={viewingProfile.business_type} icon={Info} />
                                  <DetailRow label="Cuisine Type" value={viewingProfile.cuisine_type} icon={Store} isCuisine={true} />
                                  <DetailRow label="Network reach" value={`${viewingProfile.number_of_locations} Location(s)`} icon={Globe} />
                               </div>
                            </div>

                             {/* Documentation & Compliance */}
                             <div className="lg:col-span-2 space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2 flex items-center gap-2">
                                   <Shield size={14} /> Documentation & Compliance
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                   <DetailRow label="Food License" value={viewingProfile.food_business_license} icon={CheckCircle} isFile={true} />
                                   <DetailRow label="Hygiene Certificate" value={viewingProfile.food_hygiene_certificate} icon={Shield} isFile={true} />
                                   <DetailRow label="Business Registration" value={viewingProfile.business_registration_certificate} icon={Briefcase} isFile={true} />
                                   <DetailRow label="VAT Number" value={viewingProfile.vat_registration_number} icon={Hash} />
                                </div>
                             </div>

                             {/* Ownership & Identity */}
                             <div className="lg:col-span-2 space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2 flex items-center gap-2">
                                   <Users size={14} /> Identity & Ownership
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                   <div className="space-y-3">
                                      <DetailRow label="ID Proof Type" value={viewingProfile.owner_id_proof_type?.toUpperCase()} icon={Users} />
                                      <DetailRow label="ID Proof File" value={viewingProfile.owner_id_proof_file} icon={Plus} isFile={true} />
                                   </div>
                                   <div className="space-y-3">
                                      <DetailRow label="Address Proof Type" value={viewingProfile.address_proof_type?.toUpperCase()} icon={MapPin} />
                                      <DetailRow label="Address Proof File" value={viewingProfile.address_proof_file} icon={Plus} isFile={true} />
                                   </div>
                                </div>
                             </div>

                             {/* Financial Architecture */}
                             <div className="lg:col-span-2 space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2 flex items-center gap-2">
                                   <Building2 size={14} /> Financial Profile
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                   <DetailRow label="Account Name" value={viewingProfile.bank_account_name} icon={Users} />
                                   <DetailRow label="Account Number" value={viewingProfile.bank_account_number} icon={Hash} />
                                   <DetailRow label="Sort Code" value={viewingProfile.bank_sort_code} icon={Building2} />
                                   <DetailRow label="Statement" value={viewingProfile.bank_statement_file} icon={Download} isFile={true} />
                                </div>
                             </div>

                             {/* Standards */}
                             <div className="lg:col-span-2 space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2 flex items-center gap-2">
                                   <TrendingUp size={14} /> Food Safety Standards
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                   <DetailRow label="Audit Rating" value={viewingProfile.food_hygiene_rating} icon={TrendingUp} />
                                   <DetailRow label="Allergen Info" value={viewingProfile.allergen_info_file} icon={AlertCircle} isFile={true} />
                                </div>
                             </div>

                            {/* Address & Social */}
                            <div className="lg:col-span-2 space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2 flex items-center gap-2">
                                  <MapPin size={14} /> Logistics & Digital
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Physical Location</p>
                                      <p className="text-sm font-bold leading-relaxed">{viewingProfile.store_address}</p>
                                      {viewingProfile.floor_suite && <p className="text-xs text-emerald-400 mt-2 font-bold">{viewingProfile.floor_suite}</p>}
                                   </div>
                                   {viewingProfile.social_media_website_link ? (
                                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Digital Signature</p>
                                        <a href={viewingProfile.social_media_website_link} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline font-bold text-sm block truncate">
                                          {viewingProfile.social_media_website_link}
                                        </a>
                                     </div>
                                   ) : (
                                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5 opacity-30 flex items-center justify-center italic text-xs tracking-widest font-black uppercase">No Digital Signature</div>
                                   )}
                                </div>
                            </div>
                       </div>
                    </div>

                    {isSuperAdmin && viewingProfile.status === 0 && (
                      <div className="px-8 py-6 bg-white/5 border-t border-white/10 flex gap-4 shrink-0">
                         <button onClick={() => handleUpdateStatus(viewingProfile.id, 1)} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl flex items-center justify-center gap-2"><Check size={18} /> Approve</button>
                         <button onClick={() => setRejectingId(viewingProfile.id)} className="flex-1 py-4 bg-white/5 hover:bg-rose-500 hover:text-white text-rose-400 font-black uppercase tracking-widest text-xs rounded-xl border border-rose-500/20"><X size={18} /> Decline</button>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Admin Rejection Modal */}
            <AnimatePresence>
              {rejectingId && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1e293b] w-full max-w-lg rounded-3xl border border-rose-500/20 shadow-2xl overflow-hidden p-8 space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="text-xl font-black uppercase tracking-tight text-rose-400">Audit Decline</h3>
                       <button onClick={() => setRejectingId(null)} className="text-white/40 hover:text-white"><X size={24} /></button>
                    </div>
                    <textarea 
                      className="w-full h-32 px-5 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-white placeholder-white/20 focus:outline-none focus:border-rose-500/50 transition-all resize-none text-sm font-medium"
                      placeholder="Enter specific audit failure feedback..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    ></textarea>
                    <div className="flex gap-3">
                       <button onClick={() => setRejectingId(null)} className="flex-1 py-4 bg-white/5 text-white/40 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl">Cancel</button>
                       <button disabled={!rejectionReason.trim()} onClick={() => handleUpdateStatus(rejectingId, 2, rejectionReason)} className="flex-1 py-4 bg-rose-500 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-xl disabled:opacity-40">Finalize Decline</button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
