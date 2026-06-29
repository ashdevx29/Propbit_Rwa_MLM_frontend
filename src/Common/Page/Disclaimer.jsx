

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
                            DISCLAIMER
                        </h1>

                        {/* Block */}
                        <div className="space-y-10">
                            <p className="text-[16px] leading-[1.7] text-[#414141]">
                                The information provided on this platform is for informational and investment facilitation purposes only and should not be considered financial, legal, or investment advice.
                                <br /><br />
                                All real estate investments carry inherent risks, including market fluctuations, liquidity constraints, regulatory changes, and potential loss of capital. Past performance and projected returns do not guarantee future results.
                                <br /><br />
                                ROI figures, rental yields, and appreciation estimates displayed on the platform are based on market analysis and assumptions and may vary depending on economic conditions and property performance.
                                <br /><br />
                                The platform does not guarantee fixed returns, capital protection, or investment outcomes. Investors are advised to carefully evaluate all risks and consult with professional advisors before making any investment decisions.
                                <br /><br />
                                While we strive to ensure that all property listings and legal documentation are verified, we do not assume liability for unforeseen disputes, regulatory changes, or third-party actions.
                                <br /><br />
                                The platform operates within applicable legal frameworks; however, users are responsible for complying with their local laws and regulations regarding investments.
                                <br /><br />
                                By using this platform, you acknowledge and accept all associated risks and agree that the platform is not liable for any financial losses, damages, or investment decisions made based on the information provided.
                            </p>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>

    );
}
