import React from "react";
import Header from "../Directives/Header.jsx";
import Footer from "../Directives/Footer.jsx";
import TopStats from "../Components/TopStats.jsx";

import bgVideo from "../assets/contactpage/contactbg.mp4";

import { FaLocationDot } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { publicApi } from "../../Admin/Service/publicApi.js";

// ===== Custom Green Dot =====
const customIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:16px;
      height:16px;
      background:#4BDD96;
      border:2px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
    "></div>
  `,
});

// ===== Locations =====
const locations = [
  {
    name: "GGL Unitra Headquarters",
    city: "Lucknow",
    position: [26.8467, 80.9462],
    main: true, // main card
  },
  {
    name: "Mumbai Hub",
    city: "Mumbai",
    position: [19.076, 72.8777],
  },
  {
    name: "Bangalore",
    city: "Bangalore",
    position: [12.9716, 77.5946],
  },
];

const ContactPage = () => {
  const FlyToLocation = ({ position }) => {
    const map = useMap();

    React.useEffect(() => {
      if (position) {
        map.flyTo(position, 8, {
          duration: 1.5,
        });
      }
    }, [position]);

    return null;
  };

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("FORM DATA =>", formData);

  if (!formData.fullName || !formData.email || !formData.message) {
    alert("Please fill all required fields");
    return;
  }

  try {
    setLoading(true);

    const res = await publicApi.sendContactMessage(formData);

   if (res.status === "success") {
  alert(res.message);

  setFormData({
    fullName: "",
    email: "",
    mobileNumber: "",
    subject: "",
    message: "",
  });
} else {
      alert(res.data?.message || "Something went wrong");
    }
    

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Server error. Please try again later."
    );
  } finally {
    setLoading(false);
  }
  console.log("FORM DATA =>", formData);
};
  const [activeLocation, setActiveLocation] = React.useState(null);

  return (
    <div className="w-full">
      <TopStats />
      <Header />

      {/* ================= HERO SECTION ================= */}

      <section className="w-full py-8 md:py-10">
        <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20">
          {/* Container */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[250px] md:h-[350px] object-cover"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>

            {/* White Fade Overlay (LEFT → RIGHT) */}
            <div
              className="absolute inset-0 
          bg-[linear-gradient(90deg,#F8F6F6_0%,rgba(248,246,246,0.9)_35.58%,rgba(248,246,246,0)_100%)]"
            ></div>

            {/* TOP CENTER BADGE */}
            <span
              className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 
          bg-[#C7FFDA] backdrop-blur-sm text-[#1A3C34] 
          px-5 py-1.5 rounded-full text-[10px] xs:text-xs sm:text-sm font-400 z-10"
            >
              HOME / CONTACT
            </span>

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-center">
              <div className="px-4 md:px-12 mt-4 max-w-[690px]">
                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl lg:text-6xl font-[500] text-[#0F172A] mb-4">
                  Contact <span className="text-[#0082ED]">Us</span>
                </h2>

                {/* Description */}
                <p className=" text-xs sm:text-sm font-[Poppins] font-[400] md:text-base lg:text-lg text-[#475569] leading-relaxed">
                  Ready to elevate your investment portfolio? Our specialist
                  team is standing by to provide bespoke guidance on luxury real
                  estate opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-8 md:py-12">
        <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20 grid lg:grid-cols-2 gap-10 items-start">
          {/* ================= LEFT ================= */}
          <div>
            <h3 className="text-2xl md:text-3xl font-medium text-[#0F172A] mb-6">
              Reach Out Directly
            </h3>

            <div className="space-y-6 text-[#0F172A] font-[500] text-base md:text-lg max-w-[450px]">
              {/* Address 1 */}
              <div className="flex gap-4  sm:gap-6">
                <FaLocationDot className="text-[#4BDD96] mt-1" />
                <p>
                  Address R38, Nehru Enclave, Gomti Nagar, Lucknow, Uttar
                  Pradesh
                </p>
              </div>

              {/* Address 2 */}
              <div className="flex gap-4  sm:gap-6">
                <FaLocationDot className="text-[#4BDD96] mt-1" />
                <p>
                  corporate office: B-1, PBM Building, H-169, H Block, Sector
                  63, Noida-201301
                </p>
              </div>

              {/* Address 3 */}
              <div className="flex gap-4  sm:gap-6 items-center">
                <FaLocationDot className="text-[#4BDD96]" />
                <p>
                  Address R38, Nehru Enclave, Gomti Nagar, Udaipur, Rajasthan
                </p>

                <span className="ml-2 text-xs font-[Poppins] bg-[#DCFCE7] text-[#1A3C34] px-3 py-1 rounded-full">
                  UPCOMING
                </span>
              </div>

              {/* Email */}
              <div className="flex gap-4  sm:gap-6">
                <IoMail className="text-[#4BDD96] mt-1" />
                <p>info@gglunitra.com</p>
              </div>

              {/* Phone */}
              {/* <div className="flex gap-4  sm:gap-6">
                <FaPhone className="text-[#4BDD96]  mt-1" />
                <p>+91 8953840000, +91 8953840000</p>
              </div> */}
            </div>
          </div>

          {/* ================= RIGHT (FORM) ================= */}
          <div
            className="bg-white rounded-3xl p-6 md:p-8 border border-[#F1F5F9] 
        shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-normal font-[Poppins] text-[#0F172A] mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full h-[45px] px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-normal font-[Poppins] text-[#0F172A] mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-[45px] px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-normal font-[Poppins] text-[#0F172A] mb-2 block">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full h-[45px] px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] outline-none"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-normal font-[Poppins] text-[#0F172A] mb-2 block">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full h-[45px] px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] outline-none"
                >
                <option value="">Select Subject</option>
  <option value="Investment">Investment</option>
  <option value="Project Enquiry">Project Enquiry</option>
  <option value="Fractional Plan">Fractional Plan</option>
  <option value="Complaint & Legal">Complaint & Legal</option>
  <option value="Support">Support</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-normal font-[Poppins] text-[#0F172A] mb-2 block">
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] outline-none"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-[Droxen] rounded-xl text-sm sm:text-lg text-white font-medium 
  bg-[linear-gradient(180deg,#287751_0%,#4ADD97_186.67%)]
  hover:opacity-90 transition"
              >
                {loading ? "Sending..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-20">
          {/* Heading */}
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-[400] text-[#042F2E]">
              Our Pan-India Presence
            </h2>
            <p className="text-[#475569] max-w-[672px] mx-auto text-sm sm:text-base font-[400] font-[Poppins] mt-3">
              Strategic hubs across major metropolitan areas ensuring we capture
              high-growth opportunities for our investors.
            </p>
          </div>

          {/* MAP */}
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <MapContainer
              center={[22.9734, 78.6569]}
              zoom={5}
              zoomControl={false}
              className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
              scrollWheelZoom={true}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Fly Animation */}
              <FlyToLocation position={activeLocation} />

              {locations.map((loc, index) => (
                <Marker
                  key={index}
                  position={loc.position}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setActiveLocation(loc.position),
                  }}
                >
                  {/* BIG CARD */}
                  {loc.main ? (
                    <Tooltip
                      permanent
                      direction="top"
                      offset={[0, -20]}
                      opacity={1}
                      className="!bg-white !border-none shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-xl "
                    >
                      <div
                        onClick={() => setActiveLocation(loc.position)}
                        className="bg-white rounded-xl  px-4 py-3 flex items-center gap-3 min-w-[220px] cursor-pointer"
                      >
                        <div className="w-9 h-9 bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] rounded-full flex items-center justify-center text-white">
                          <LuMapPin size={20} />
                        </div>

                        <div>
                          <p className=" text-sm sm:text-base font-[Public Sans] font-bold text-[#0F172A]">
                            {loc.name}
                          </p>
                          <p className="text-xs sm:text-sm font-[Public Sans] text-[#64748B] uppercase">
                            {loc.city}
                          </p>
                        </div>
                      </div>
                    </Tooltip>
                  ) : (
                    /* SMALL LABEL */
                    <Tooltip
                      permanent
                      direction="top"
                      offset={[0, -10]}
                      opacity={1}
                      className="!bg-white !text-[10px] !px-2 !py-1 !rounded-full !shadow !border-none cursor-pointer"
                    >
                      <span onClick={() => setActiveLocation(loc.position)}>
                        {loc.name.toUpperCase()}
                      </span>
                    </Tooltip>
                  )}
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
