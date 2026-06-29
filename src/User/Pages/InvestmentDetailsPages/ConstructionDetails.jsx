import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

import UnderConstructionLeft from "./components/UnderConstructionLeft";
import UnderConstructionSidebar from "./components/UnderConstructionSidebar";
import { getConstructionDetails } from "../../Service/investmentApi";

export default function UnderConstructionDetails() {  
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATE (controls form vs details)
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setShowForm(false);

    const loadProperty = async () => {
      try {
        const found = await getConstructionDetails(id);
        if (mounted) {
          setProperty(found || null);
        }
      } catch (err) {
        console.error("Error loading property:", err);
        if (mounted) {
          setProperty(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProperty();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading project details...</div>;
  }

  if (!property) {
    return <div className="p-10 text-center">Project not found</div>;
  }

  return (
    <div className="dmfont space-y-6 sm:space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[#E5E7EB] text-[#4A5565] hover:text-[#101828]"
            aria-label="Back"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#101828] break-words">
            {property?.title}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#4A5565]">
          Explore investment opportunities in real estate
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_275px] gap-4 sm:gap-6 items-stretch">
        
        <div className="min-w-0 h-full">
          <UnderConstructionLeft 
            property={property} 
            showForm={showForm}        // ✅ PASS STATE
            setShowForm={setShowForm}  // (for back button later)
          />
        </div>

        <div className="min-w-0 h-full lg:w-[275px]">
          <UnderConstructionSidebar 
            property={property} 
            setShowForm={setShowForm}  // ✅ PASS TRIGGER
          />
        </div>

      </div>
    </div>
  );
}
