import { Routes, Route } from "react-router-dom";
import HomePage from "../Common/Page/Homepage";
import AboutPage from "../Common/Page/AboutPage"
import PrivacyPolicy from "../Common/Page/PrivacyPolicy";
import TermsAndConditions from "../Common/Page/TermsAndConditions";
import Contactus from "../Common/Page/ContactUs"
import Blog from "../Common/Page/Blog"
import BlogDetails from "../Common/Page/BlogDetails"
import Login from "../User/Auth/LoginPage";
import SignUp from "../User/Auth/SignUpPage";
import PosterGallery from "../Common/Page/PosterGallery";
import Disclaimer from "../Common/Page/Disclaimer";


const CommanRoutes = () => {
  return (
    <Routes>
     
       
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} /> */}
        <Route path="/gallery" element={<PosterGallery/>}/>
        <Route path="/about-us" element={<AboutPage />} />
      <Route path="/contact" element={<Contactus />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetails />} />

      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      <Route path="/disclaimer" element={<Disclaimer />} />
       
    </Routes>
  );
};

export default CommanRoutes;


