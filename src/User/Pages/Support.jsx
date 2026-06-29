import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTag,
  FaCommentDots,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { appConfig } from "../../config/appConfig";
import Footer from "../Components/Comman/Footer";
import ReCAPTCHA from "react-google-recaptcha";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorObj = {};

    if (!formData.name.trim()) errorObj.name = "Name is required";
    if (!formData.email.trim()) errorObj.email = "Email is required";
    if (!formData.phone.trim()) errorObj.phone = "Phone number is required";
    if (!formData.subject.trim()) errorObj.subject = "Subject is required";
    if (!formData.message.trim()) errorObj.message = "Message is required";

    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      Object.values(errorObj).forEach((msg) => toast.error(msg));
      return;
    }

    try {
      setLoading(true);
      const token =
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      await axios.post(
        `${appConfig.baseURL}/user/sendsupportemail`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Support request sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        notRobot: false,
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send support request.");
      console.error("Error sending support:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>


      <div className="flex justify-center ">
        <form onSubmit={handleSubmit} className=" w-[30rem] theme-card-style border-gradient p-5  gap-8">
          <h2 className="text-xl droxen-font text-[#1E293B] mb-4">Support Form</h2>
          <div className="     space-y-6">
            {/* Name */}
            <div>
              <label className="text-sm mb-1 text-[#0F172A] gued-font flex items-center gap-2">
              
              
                <FaUser className="text-[#0082ED]" /> Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full bg-transparent  mt-2 border-b ${errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none text-gray-800`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm  text-[#0F172A] mb-1 gued-font flex items-center gap-2">
                <FaEnvelope className="text-[#0082ED]" /> Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-transparent  mt-2 border-b ${errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none text-gray-800`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm mb-1 text-[#0F172A] gued-font flex items-center gap-2">
                <FaPhone className="text-[#0082ED]" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full bg-transparent  mt-2 border-b ${errors.phone ? "border-red-500" : "border-gray-300"
                  } focus:outline-none text-gray-800`}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className="text-sm mb-1 text-[#0F172A] gued-font flex items-center gap-2">
                <FaTag className="text-[#0082ED]" /> Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject of your query"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full bg-transparent  mt-2 border-b ${errors.subject ? "border-red-500" : "border-gray-300"
                  } focus:outline-none text-gray-800`}
              />
              {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-[#0F172A] mb-1 gued-font flex items-center gap-2">
                <FaCommentDots className="text-[#0082ED]" /> Message
              </label>
              <textarea
                name="message"
                rows="4"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleInputChange}
                className={`w-full mt-2 bg-transparent border-b ${errors.message ? "border-red-500" : "border-gray-300"
                  } focus:outline-none text-gray-800`}
              />
              {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="px-6 py-2 w-full droxen-font bg-[linear-gradient(135deg,#0082ED_0%,#00E8A6_100%)] hover:opacity-90  text-white text-xl rounded mt-4"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>

        </form>
      </div>
      <Footer />
    </>
  );
};

export default Support;