import { useState, useEffect } from "react";
import Header from "../../components/common/header.jsx";
import Sidebar from "../../components/common/sidebar.jsx";
import Footer from "../../components/common/footer.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, Sparkles, Megaphone, Plus, Image as ImageIcon, 
  Upload, X, Layers, ShoppingBag, Info, Save, Trash2, Edit 
} from "lucide-react";

export default function OffersPage() {
  const API = import.meta.env.VITE_API_URL;
  const API_BASE = API ? API.replace(/\/api\/?$/i, "") : "";
  const token = localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectionTab, setSelectionTab] = useState("categories"); // categories | products

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    banner: null,
    bannerPreview: null,
    target_categories: [],
    target_products: []
  });

  // State for real offers from DB
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all data
  const loadData = async () => {
    try {
      const res = await fetch(`${API}/offers`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setOffers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();

    // Fetch categories and products for the selection lists
    fetch(`${API}/category`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error(err));

    fetch(`${API}/products`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error(err));
  }, [API, token]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        banner: file,
        bannerPreview: URL.createObjectURL(file)
      }));
    }
  };

  const toggleTarget = (type, id) => {
    setForm(prev => {
      const current = prev[type];
      const exists = current.includes(id);
      return {
        ...prev,
        [type]: exists ? current.filter(i => i !== id) : [...current, id]
      };
    });
  };

  const handleSubmit = async () => {
    if (!form.title) return alert("Title is required");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("status", "active");
      if (form.banner) fd.append("banner", form.banner);
      
      const targets = [
        ...form.target_categories.map(id => ({ type: 'category', id })),
        ...form.target_products.map(id => ({ type: 'product', id }))
      ];
      fd.append("targets", JSON.stringify(targets));

      const url = isEdit ? `${API}/offers/${form.id}` : `${API}/offers`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      if (res.ok) {
        setShowModal(false);
        setIsEdit(false);
        setForm({
          id: null,
          title: "",
          description: "",
          banner: null,
          bannerPreview: null,
          target_categories: [],
          target_products: []
        });
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setIsEdit(true);
    setForm({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      banner: null,
      bannerPreview: offer.banner_image ? `${API_BASE}/uploads/${offer.banner_image}` : null,
      target_categories: offer.targets?.filter(t => t.type === 'category').map(t => t.id) || [],
      target_products: offer.targets?.filter(t => t.type === 'product').map(t => t.id) || []
    });
    setShowModal(true);
  };

  const handleSelectAll = () => {
    if (selectionTab === "categories") {
      const allIds = categories.map(c => c.id);
      const isAllSelected = form.target_categories.length === allIds.length;
      setForm(prev => ({
        ...prev,
        target_categories: isAllSelected ? [] : allIds
      }));
    } else {
      const allIds = products.map(p => p.id);
      const isAllSelected = form.target_products.length === allIds.length;
      setForm(prev => ({
        ...prev,
        target_products: isAllSelected ? [] : allIds
      }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      await fetch(`${API}/offers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (offer) => {
    const newStatus = offer.status === 'active' ? 'inactive' : 'active';
    try {
      await fetch(`${API}/offers/toggle/${offer.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      loadData();
    } catch (err) {
       console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-teal-800 to-emerald-900 font-sans">
      <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`flex-1 flex flex-col pt-36 lg:pt-24 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:pl-72" : "lg:pl-0"}`}>
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Professional Welcome Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                <div className="p-6 bg-white/10 rounded-3xl border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Megaphone className="text-emerald-400 w-16 h-16 rotate-[-10deg]" strokeWidth={1.5} />
                </div>
                
                <div className="flex-1 text-center lg:text-left space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-[0.3em]">
                    <Sparkles size={14} /> Campaign Hub
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none">
                    Promotional <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Offers</span>
                  </h1>
                  <p className="text-white/50 text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
                    Create high-impact banners to showcase in the <span className="text-white font-bold">mobile application</span>. Link your campaigns to specific products or entire categories for targeted sales.
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setIsEdit(false);
                    setForm({
                      id: null,
                      title: "",
                      description: "",
                      banner: null,
                      bannerPreview: null,
                      target_categories: [],
                      target_products: []
                    });
                    setShowModal(true);
                  }}
                  className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-2 flex items-center gap-4 active:scale-95"
                >
                  <Plus size={20} strokeWidth={3} /> Create New Offer
                </button>
              </div>
            </motion.div>

            {/* List Header */}
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <Tag className="text-emerald-400" /> Active Campaigns
               </h3>
               <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map((offer) => (
                  <motion.div 
                    layoutId={`offer-${offer.id}`}
                    key={offer.id}
                    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 ${offer.status === 'inactive' ? 'opacity-60 saturate-50' : ''}`}
                  >
                    <div className="h-48 bg-white/5 flex items-center justify-center relative border-b border-white/10 overflow-hidden">
                       {offer.banner_image ? (
                          <img 
                            src={`${API_BASE}/uploads/${offer.banner_image}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            alt={offer.title} 
                          />
                       ) : (
                          <ImageIcon size={48} className={`transition-transform duration-700 ${offer.status === 'inactive' ? 'text-white/5' : 'text-white/10 group-hover:scale-120'}`} />
                       )}
                       
                       {/* Status Badge */}
                       <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border transition-colors shadow-lg ${
                            offer.status === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-md' 
                            : 'bg-white/10 text-white/40 border-white/20 backdrop-blur-md'
                          }`}>
                            {offer.status}
                          </span>
                       </div>
                    </div>

                    <div className="p-6 space-y-4">
                       <div>
                         <div className="flex justify-between items-start">
                            <h4 className="text-lg font-bold text-white uppercase tracking-tight truncate flex-1">{offer.title}</h4>
                            <div className="flex items-center gap-1.5 ml-2">
                               {offer.targets?.length > 0 && (
                                 <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-black text-white/50 uppercase tracking-tighter">
                                   {offer.targets.length} Links
                                 </span>
                               )}
                            </div>
                         </div>
                         <p className="text-white/40 text-sm line-clamp-2 leading-relaxed font-medium mt-1">{offer.description || "No description provided."}</p>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          {/* Active/Deactive Toggle */}
                          <div className="flex items-center gap-3">
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={offer.status === 'active'} 
                                  onChange={() => handleToggle(offer)}
                                  className="sr-only peer" 
                                />
                                <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-emerald-500/50 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                             </label>
                             <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                {offer.status === 'active' ? 'Visible' : 'Hidden'}
                             </span>
                          </div>

                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => handleEdit(offer)}
                               className="h-9 w-9 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 flex items-center justify-center group/btn active:scale-90"
                             >
                                <Edit size={14} className="group-hover/btn:scale-110 transition-transform" />
                             </button>
                             <button 
                               onClick={() => handleDelete(offer.id)}
                               className="h-9 w-9 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/30 flex items-center justify-center group/del active:scale-90"
                             >
                                <Trash2 size={14} className="group-del:scale-110 transition-transform" />
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}

                
                {/* Empty State / Add New */}
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center gap-4 group hover:bg-white/5 hover:border-emerald-500/30 transition-all duration-500"
                >
                   <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                      <Plus className="text-white/20 group-hover:text-emerald-400 transition-colors" size={32} />
                   </div>
                   <span className="text-white/30 font-black uppercase tracking-widest text-[10px]">Launch Promotion</span>
                </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* CREATE OFFER MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-[#1A1A1A] border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-10 py-8 bg-white/5 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 shadow-lg">
                      <Megaphone className="text-emerald-400" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">New Marketing Offer</h2>
                      <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-0.5">Mobile Application Banner Campaign</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white transition-all shadow-lg active:scale-90"
                  >
                    <X size={24} />
                  </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                
                {/* Banner Upload Section */}
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-2">
                      <ImageIcon size={14} /> Campaign Visual (Mobile Banner)
                   </h5>
                   <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        id="offer-banner" 
                        onChange={handleBannerChange}
                      />
                      <label 
                        htmlFor="offer-banner"
                        className={`
                          cursor-pointer flex flex-col items-center justify-center min-h-[220px] rounded-[2rem] border-2 border-dashed 
                          transition-all duration-500 relative overflow-hidden
                          ${form.bannerPreview 
                            ? 'border-emerald-500/50 bg-[#000]' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30'}
                        `}
                      >
                         {form.bannerPreview ? (
                           <>
                             <img src={form.bannerPreview} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Banner Preview" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/30">
                                   <Upload className="text-white" size={24} />
                                </div>
                                <span className="text-white text-xs font-black uppercase tracking-widest mt-3">Replace Banner</span>
                             </div>
                           </>
                         ) : (
                           <>
                             <div className="p-5 bg-white/5 rounded-2xl shadow-inner mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="text-white/20 group-hover:text-emerald-400 transition-colors" size={32} />
                             </div>
                             <p className="text-white/60 font-bold text-sm tracking-tight text-center px-10">
                               Drag & drop or <span className="text-emerald-400">browse</span> highly visual banners
                               <span className="block text-[10px] text-white/30 mt-1 uppercase tracking-widest">Recommended: 1200 x 600px (Wide)</span>
                             </p>
                           </>
                         )}
                      </label>
                   </div>
                </div>

                {/* Campaign Text Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-2">
                        <Megaphone size={14} /> Offer Heading
                      </h5>
                      <input 
                        type="text" 
                        placeholder="e.g. SUMMER SEASON SPECIAL"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
                        value={form.title}
                        onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                      />
                   </div>
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-2">
                        <Info size={14} /> Description / Terms
                      </h5>
                      <input 
                        type="text" 
                        placeholder="Short description for the customer"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
                        value={form.description}
                        onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                      />
                   </div>
                </div>

                {/* Linking Selection */}
                <div className="space-y-6">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-2">
                          <Layers size={14} /> Link Offer to Products/Categories
                        </h5>
                        <button 
                          onClick={handleSelectAll}
                          className="px-3 py-1 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-emerald-400 transition-all"
                        >
                          {((selectionTab === "categories" ? categories : products).length === (selectionTab === "categories" ? form.target_categories : form.target_products).length && (selectionTab === "categories" ? categories : products).length > 0) ? "Deselect All" : "Select All"}
                        </button>
                      </div>

                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
                         <button 
                           onClick={() => setSelectionTab("categories")}
                           className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectionTab === 'categories' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                         >
                            Categories
                         </button>
                         <button 
                           onClick={() => setSelectionTab("products")}
                           className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectionTab === 'products' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                         >
                            Products
                         </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-white/[0.03] rounded-[2rem] border border-white/10 shadow-inner">
                      {selectionTab === 'categories' ? (
                        categories.map(cat => (
                          <div 
                            key={cat.id}
                            onClick={() => toggleTarget("target_categories", cat.id)}
                            className={`
                              cursor-pointer p-4 rounded-2xl border transition-all flex items-center gap-3 group
                              ${form.target_categories.includes(cat.id) 
                                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg' 
                                : 'bg-white/5 border-white/10 hover:border-emerald-500/30'}
                            `}
                          >
                             <div className={`p-2 rounded-lg transition-colors ${form.target_categories.includes(cat.id) ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/30 group-hover:text-emerald-400'}`}>
                                <Layers size={14} />
                             </div>
                             <span className={`text-[11px] font-bold uppercase tracking-tight truncate ${form.target_categories.includes(cat.id) ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                               {cat.name}
                             </span>
                          </div>
                        ))
                      ) : (
                        products.map(prod => (
                          <div 
                            key={prod.id}
                            onClick={() => toggleTarget("target_products", prod.id)}
                            className={`
                              cursor-pointer p-4 rounded-2xl border transition-all flex items-center gap-3 group
                              ${form.target_products.includes(prod.id) 
                                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg' 
                                : 'bg-white/5 border-white/10 hover:border-emerald-500/30'}
                            `}
                          >
                             <div className={`p-2 rounded-lg transition-colors ${form.target_products.includes(prod.id) ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/30 group-hover:text-emerald-400'}`}>
                                <ShoppingBag size={14} />
                             </div>
                             <span className={`text-[11px] font-bold uppercase tracking-tight truncate ${form.target_products.includes(prod.id) ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                               {prod.name}
                             </span>
                          </div>
                        ))
                      )}

                      {(selectionTab === 'categories' ? categories : products).length === 0 && (
                        <div className="col-span-full py-10 text-center text-white/20 text-[10px] uppercase font-black tracking-widest">
                           Loading data architecture...
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-10 py-8 bg-white/5 border-t border-white/10 flex justify-end items-center gap-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-8 py-4 rounded-2xl border border-white/10 text-white/60 font-black uppercase tracking-widest text-[11px] hover:bg-white/5 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save size={18} />
                    )}
                    {loading ? "Launching..." : "Launch Campaign"}
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
