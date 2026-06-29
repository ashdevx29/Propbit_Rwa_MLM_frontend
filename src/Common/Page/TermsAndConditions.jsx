
import Header from "../Directives/Header.jsx"
import Footer from "../Directives/Footer.jsx"
import TopStats from "../Components/TopStats.jsx"

export default function TermsAndConditions() {
  return (
    <>
      <div className="bg-white  ">
        <TopStats />
        <Header />
        <section className="w-full bg-white py-20 px-4 font-['DM_Sans']">
          <div className="max-w-4xl mx-auto">

            {/* Title */}
            <h1 className="text-center text-[44px] md:text-[36px] sm:text-[28px] font-semibold text-black mb-12">
              Terms & Conditions
            </h1>

            {/* Content */}
            <div className="space-y-10">
          
              <p className="text-[16px] leading-[1.7] text-[#414141] space-y-3">
                By accessing and using this platform, you agree to comply with the following terms and conditions.
                <br /><br />
                This platform provides fractional investment opportunities in real estate assets. Users must be at least 18 years old and complete the required KYC verification before participating in any investment activities.
                <br /><br />
                All investments made through the platform are subject to market risks. While we aim to provide accurate property details, projected returns, and performance insights, we do not guarantee any fixed or assured returns.
                <br /><br />
                Users are responsible for conducting their own due diligence before making investment decisions. Investment opportunities, pricing, availability of fractions, and ROI projections may change without prior notice.
                <br /><br />
                The platform acts as a facilitator connecting investors with structured real estate opportunities and does not function as a traditional financial advisor or broker.
                <br /><br />
                Users agree not to misuse the platform, engage in fraudulent activities, or attempt unauthorized access to system data. Any violation may result in account suspension or legal action.
                <br /><br />
                All content, branding, and technology on the platform are protected by intellectual property laws and cannot be copied or reproduced without permission.
                <br /><br />
                We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.
              </p>


            </div>
          </div>
        </section>
        <Footer />
      </div>

    </>

  );
}
