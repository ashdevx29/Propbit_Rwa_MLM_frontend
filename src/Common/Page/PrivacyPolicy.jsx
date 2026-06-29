

import Header from "../Directives/Header.jsx"
import Footer from "../Directives/Footer.jsx"
import TopStats from "../Components/TopStats.jsx"

export default function PrivacyPolicy() {
  return (
    <>
      <div className="bg-white  ">
        <TopStats />
        <Header />
        <section className="w-full bg-white py-20 px-4 font-['DM_Sans']">
          <div className="max-w-4xl mx-auto">

            {/* Title */}
            <h1 className="text-center text-[44px] md:text-[36px] sm:text-[28px] font-semibold text-black mb-12">
              Privacy Policy
            </h1>

            {/* Block */}
            <div className="space-y-10">
              <p className="text-[16px] leading-[1.7] text-[#414141]">
                We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you access our platform.
                <br /><br />
                We collect personal information such as your name, email address, phone number, government-issued identification, and financial details during account registration and KYC verification. Additionally, we may collect technical data such as IP address, browser type, device information, and usage behavior to improve platform performance and security.
                <br /><br />
                Your information is used to provide and enhance our services, process investments, verify identity, comply with legal obligations, and communicate important updates. We may also use your data for analytics, risk assessment, and fraud prevention.
                <br /><br />
                We do not sell or rent your personal data to third parties. However, we may share information with trusted partners such as legal advisors, compliance providers, payment processors, and regulatory authorities when required.
                <br /><br />
                All data is protected using advanced encryption, secure servers, and strict access controls. Despite our efforts, no system is completely secure, and users are encouraged to maintain strong passwords and protect their login credentials.
                <br /><br />
                You have the right to access, update, or request deletion of your personal data, subject to legal and regulatory requirements.
                <br /><br />
                By using our platform, you consent to the collection and use of your information as described in this policy.
              </p>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>

  );
}
