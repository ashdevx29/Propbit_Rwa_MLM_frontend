import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import AdminLoader from "../Admin/Components/AdminLoader";

// ✅ Lazy Layout
const AdminLayout = lazy(() => import("../Admin/Layout/AdminLayout"));

// ✅ Auth Pages
const Login = lazy(() => import("../Admin/Auth/Login"));
const SignUp = lazy(() => import("../Admin/Auth/SignUp"));
const ForgetPassword = lazy(() => import("../Admin/Auth/ForgetPassword"));
const ResetPassword = lazy(() => import("../Admin/Auth/ResetPassword"));
const VarifyEmail = lazy(() => import("../Admin/Auth/VarifyEmail"));

// ✅ Admin Pages (ALL lazy)
const Dashboard = lazy(() => import("../Admin/Pages/Dashboard"));
// const TradeManagement = lazy(() => import("../Admin/Pages/TradeManagement"));
const UserManagment = lazy(() => import("../Admin/Pages/UserManagement"));
const AdminUserRoles = lazy(() => import("../Admin/Pages/AdminUserRoles"));
// const SetTokenPrice = lazy(() => import("../Admin/Pages/SetTokenPrice"));

const Deposit = lazy(() => import("../Admin/Pages/UsersDeposit/Deposit"));
const DepositReport = lazy(() => import("../Admin/Pages/UsersDeposit/DepositReport"));

// const UserWalletUpdate = lazy(() => import("../Admin/Pages/UsersWalletUpdate/WalletUpdate"));
// const UserWalletUpdateReport = lazy(() => import("../Admin/Pages/UsersWalletUpdate/WalletUpdateReport"));

const InvestmentsPlan = lazy(() => import("../Admin/Pages/PropertyManagement/AddPropertyPlan"));
const AddProperty = lazy(() => import("../Admin/Pages/PropertyManagement/Properties/AddProperty"));
const EditProperty = lazy(() => import("../Admin/Pages/PropertyManagement/Properties/EditProperty"));
const PropertyLogs = lazy(() => import("../Admin/Pages/PropertyManagement/PropertyLogs"));

// const LavelPlan = lazy(() => import("../Admin/Pages/PropertyManagement/LavelPlan"));
// const BonanzaPlan = lazy(() => import("../Admin/Pages/PropertyManagement/BonanzaPlan"));
// const InvestmentsReports = lazy(() => import("../Admin/Pages/PropertyManagement/Reports"));

const UserPropertyPlansReport = lazy(() => import("../Admin/Pages/PropertyReport/UserPropertyPlansReport"));
const ContactPropertyReportQuery = lazy(() => import("../Admin/Pages/PropertyReport/ContactPropertyReportQuery"));

const Withdrawals = lazy(() => import("../Admin/Pages/PayoutManagement/Withdrawals"));
const WithdrawalReport = lazy(() => import("../Admin/Pages/PayoutManagement/WithdrawalReports"));

// const DailyRoiIncome = lazy(() => import("../Admin/Pages/IncomeManagement/DailyRoiIncome"));
// const ReferralIncome = lazy(() => import("../Admin/Pages/IncomeManagement/ReferralIncome"));
// const BinaryIncomeReport = lazy(() => import("../Admin/Pages/IncomeManagement/BinaryIncomeRewards"));
// const LevelIncomeRewards = lazy(() => import("../Admin/Pages/IncomeManagement/LevelIncomeRewards"));

// const LeadershipShareDistribution = lazy(() => import("../Admin/Pages/IncomeManagement/LeadershipShareDistribution"));
// const LeadershipIncomeReport = lazy(() => import("../Admin/Pages/IncomeManagement/LeadershipIncomeRewards"));

const RankAchivementReport = lazy(() => import("../Admin/Pages/Report/RankAchivementReport"));
// const SwapManagementReport = lazy(() => import("../Admin/Pages/SwapManagement/SwapManagementReport"));

const SetReferralIncome = lazy(() => import("../Admin/Pages/Settings/SetReferralIncome"));
const KycReport = lazy(() => import("../Admin/Pages/KYC/KycReport"));

const SessionLog = lazy(() => import("../Admin/Pages/SessionLog"));
const Logout = lazy(() => import("../Admin/Pages/Logout"));

// ✅ Private Route
const PrivateRoute = () => {
  const isAuthenticated =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* ✅ Auth Routes */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminLoader />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/admin/sign-up"
        element={
          <Suspense fallback={<AdminLoader />}>
            <SignUp />
          </Suspense>
        }
      />
      <Route
        path="/admin/varify-email"
        element={
          <Suspense fallback={<AdminLoader />}>
            <VarifyEmail />
          </Suspense>
        }
      />
      <Route
        path="/admin/forget-password"
        element={
          <Suspense fallback={<AdminLoader />}>
            <ForgetPassword />
          </Suspense>
        }
      />
      <Route
        path="/admin/reset-password"
        element={
          <Suspense fallback={<AdminLoader />}>
            <ResetPassword />
          </Suspense>
        }
      />

      {/* ✅ Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminLayout />
            </Suspense>
          }
        >
          {/* 🔥 Single Suspense for ALL pages */}
          <Route
            element={
              <Suspense fallback={<AdminLoader />}>
                <Outlet />
              </Suspense>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* <Route path="trade-management" element={<TradeManagement />} /> */}
            <Route path="user-management" element={<UserManagment />} />
            <Route path="user-roles" element={<AdminUserRoles />} />
            {/* <Route path="set-token-price" element={<SetTokenPrice />} /> */}

            <Route path="user-deposit/deposit" element={<Deposit />} />
            <Route path="user-deposit/deposit-report" element={<DepositReport />} />

            {/* <Route path="user-wallet/update" element={<UserWalletUpdate />} />
            <Route path="user-wallet/update-report" element={<UserWalletUpdateReport />} /> */}

            <Route path="property-Report/user-property-plans-report" element={<UserPropertyPlansReport />} />
            <Route path="property-Report/contact-form" element={<ContactPropertyReportQuery />} />

            <Route path="property-management/add-property-plan" element={<InvestmentsPlan />} />
            <Route path="property-management/add-property-plan/add-property" element={<AddProperty />} />
            <Route path="property-management/add-property-plan/edit-property/:id" element={<EditProperty />} />
            <Route path="property-management/property-logs" element={<PropertyLogs />} />

            <Route path="/admin/sales/add-property-plan" element={<InvestmentsPlan />} />
            <Route path="/admin/sales/user-property-plans-report" element={<UserPropertyPlansReport />} />

            {/* <Route path="property-management/level-plan" element={<LavelPlan />} />
            <Route path="property-management/bonanza-plan" element={<BonanzaPlan />} />
            <Route path="property-management/report" element={<InvestmentsReports />} /> */}

            <Route path="reports/kyc-report" element={<KycReport />} />
            <Route path="reports/rank-achievement-report" element={<RankAchivementReport />} />

            <Route path="payout-management/withdrawals" element={<Withdrawals />} />
            <Route path="payout-management/withdrawal-report" element={<WithdrawalReport />} />

            {/* <Route path="income-management/daily-roi-income" element={<DailyRoiIncome />} />
            <Route path="income-management/binary-income-report" element={<BinaryIncomeReport />} />
            <Route path="income-management/leadership-share-report" element={<LeadershipShareDistribution />} />
            <Route path="income-management/leadership-income-report" element={<LeadershipIncomeReport />} />
            <Route path="income-management/referrel-income" element={<ReferralIncome />} />
            <Route path="income-management/level-income-rewards" element={<LevelIncomeRewards />} />

            <Route path="swap-management/report" element={<SwapManagementReport />} /> */}
            <Route path="settings/set-referral-income" element={<SetReferralIncome />} />

            <Route path="session-log" element={<SessionLog />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;










// import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import { Suspense, lazy } from 'react';
// import AdminLayout from '../Admin/Layout/AdminLayout';
// const TradeManagement = lazy(() => import('../Admin/Pages/TradeManagement'));
// import AdminLoader from '../Admin/Components/AdminLoader';
// import DailyRoiIncome from '../Admin/Pages/IncomeManagement/DailyRoiIncome';
// import LevelIncomeRewards from '../Admin/Pages/IncomeManagement/LevelIncomeRewards';
// import UserPropertyPlansReport from '../Admin/Pages/PropertyReport/UserPropertyPlansReport';
// //add akshay
// import ContactPropertyReportQuery from '../Admin/Pages/PropertyReport/ContactPropertyReportQuery'
// import EditProperty from '../Admin/Pages/PropertyManagement/Properties/EditProperty';
 

// // ✅ Lazy-loaded Auth Pages
// const Login = lazy(() => import('../Admin/Auth/Login'));
// const SignUp = lazy(() => import('../Admin/Auth/SignUp'));
// const ForgetPassword = lazy(() => import('../Admin/Auth/ForgetPassword'));
// const ResetPassword = lazy(() => import('../Admin/Auth/ResetPassword'));
// const VarifyEmail = lazy(() => import('../Admin/Auth/VarifyEmail'));

// // ✅ Lazy-loaded Admin Pages
// const Dashboard = lazy(() => import('../Admin/Pages/Dashboard'));
// const UserManagment = lazy(() => import('../Admin/Pages/UserManagement'));
// const SetTokenPrice = lazy(() => import('../Admin/Pages/SetTokenPrice'));
// const Deposit = lazy(() => import('../Admin/Pages/UsersDeposit/Deposit'));
// const DepositReport = lazy(() => import('../Admin/Pages/UsersDeposit/DepositReport'));
// const UserWalletUpdate = lazy(() => import('../Admin/Pages/UsersWalletUpdate/WalletUpdate'));
// const UserWalletUpdateReport = lazy(() => import('../Admin/Pages/UsersWalletUpdate/WalletUpdateReport'));
// const InvestmentsPlan = lazy(() => import('../Admin/Pages/PropertyManagement/AddPropertyPlan'));
// const AddProperty = lazy(() => import('../Admin/Pages/PropertyManagement/Properties/AddProperty'));
// const LavelPlan = lazy(() => import('../Admin/Pages/PropertyManagement/LavelPlan'));
// const BonanzaPlan = lazy(() => import('../Admin/Pages/PropertyManagement/BonanzaPlan'));
// const InvestmentsReports = lazy(() => import('../Admin/Pages/PropertyManagement/Reports'));
// const Withdrawals = lazy(() => import('../Admin/Pages/PayoutManagement/Withdrawals'));
// const WithdrawalReport = lazy(() => import('../Admin/Pages/PayoutManagement/WithdrawalReports'));
// const PerDayIncome = lazy(() => import('../Admin/Pages/IncomeManagement/DailyRoiIncome'));
// const ReferralIncome = lazy(() => import('../Admin/Pages/IncomeManagement/ReferralIncome'));
// const BinaryIncomeReport = lazy(() => import('../Admin/Pages/IncomeManagement/BinaryIncomeRewards'));
// const RankAchivementReport = lazy(() => import('../Admin/Pages/Report/RankAchivementReport'));
// const LeadershipShareDistribution = lazy(() => import('../Admin/Pages/IncomeManagement/LeadershipShareDistribution'));
// const LeadershipIncomeReport = lazy(() => import('../Admin/Pages/IncomeManagement/LeadershipIncomeRewards'));
// const BonanzaRewards = lazy(() => import('../Admin/Pages/IncomeManagement/BonanzaRewards'));
// const SwapManagementReport = lazy(() => import('../Admin/Pages/SwapManagement/SwapManagementReport'));
// const SetReferralIncome = lazy(() => import('../Admin/Pages/Settings/SetReferralIncome'));
// const KycReport = lazy(() => import('../Admin/Pages/KYC/KycReport'));
// // const SetLevelIncome = lazy(() => import('../Admin/Pages/Settings/SetLevelIncome'));
// const SessionLog = lazy(() => import('../Admin/Pages/SessionLog'));
// const Logout = lazy(() => import('../Admin/Pages/Logout'));


// // ✅ Private Route Component
// const PrivateRoute = () => {
//   const isAuthenticated = localStorage.getItem('token') || sessionStorage.getItem('token');
//   // const isAuthenticated = true;
//   if (isAuthenticated) {
//     return <Outlet />;
//   }
//   return <Navigate to="/admin/login" replace />;
// };

// const AdminRoutes = () => {
//   return (
//     <Routes>
//       {/* ✅ Public Auth Routes with Lazy + Loader */}
//       <Route
//         path="/admin/login"
//         element={
//           <Suspense fallback={<AdminLoader />}>
//             <Login />
//           </Suspense>
//         }
//       />
//       <Route
//         path="/admin/sign-up"
//         element={
//           <Suspense fallback={<AdminLoader />}>
//             <SignUp />
//           </Suspense>
//         }
//       />
//       <Route
//         path="/admin/varify-email"
//         element={
//           <Suspense fallback={<AdminLoader />}>
//             <VarifyEmail />
//           </Suspense>
//         }
//       />
//       <Route
//         path="/admin/forget-password"
//         element={
//           <Suspense fallback={<AdminLoader />}>
//             <ForgetPassword />
//           </Suspense>
//         }
//       />
//       <Route
//         path="/admin/reset-password"
//         element={
//           <Suspense fallback={<AdminLoader />}>
//             <ResetPassword />
//           </Suspense>
//         }
//       />

//       {/* ✅ Protected Admin Routes */}
//       <Route
        
//         element={
//           <PrivateRoute />
//         }
//       >
//         <Route
//           path="/admin"
//           element={
//             <AdminLayout />
//           }
//         >
//           <Route index element={<Navigate to="dashboard" />} />
//           <Route
//             path="dashboard"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <Dashboard />
//               </Suspense>
//             }
//           />
          
//             <Route
//               path="trade-management"
//               element={
//                 <Suspense fallback={<AdminLoader />}>
//                   <TradeManagement />
//                 </Suspense>
//               }
//             />
//           <Route
//             path="user-management"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <UserManagment />
//               </Suspense>
//             }
//           />
//           <Route
//             path="set-token-price"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <SetTokenPrice />
//               </Suspense>
//             }
//           />
//           <Route 
//             path="user-deposit/deposit"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <Deposit />
//               </Suspense>
//             }
//           />
//           <Route
//             path="user-deposit/deposit-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <DepositReport />
//               </Suspense>
//             }
//           />

//            <Route 
//             path="user-wallet/update"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <UserWalletUpdate />
//               </Suspense>
//             }
//           />
//           <Route
//             path="user-wallet/update-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <UserWalletUpdateReport />
//               </Suspense>
//             }
//           />
//           <Route
//             path="property-Report/user-property-plans-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <UserPropertyPlansReport />
//               </Suspense>
//             }
//           />
//           <Route
//             path="property-Report/contact-form"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <ContactPropertyReportQuery />
//               </Suspense>
//             }
//           />
//           <Route
//             path="property-management/add-property-plan"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <InvestmentsPlan />
//               </Suspense>
//             }
//           />
//           <Route
//             path="property-management/add-property-plan/add-property"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <AddProperty />
//               </Suspense>
//             }
//           />
//           <Route
//             path="property-management/add-property-plan/edit-property/:id"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <EditProperty />
//               </Suspense>
//             }
//           />

//           <Route
//             path="property-management/level-plan"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <LavelPlan />
//               </Suspense>
//             }
//           />
//           <Route
//             path="property-management/bonanza-plan"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <BonanzaPlan />
//               </Suspense>
//             }
//           />

//           <Route
//             path="reports/kyc-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <KycReport />
//               </Suspense>
//             }
//           />

//           <Route
//             path="property-management/report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <InvestmentsReports />
//               </Suspense>
//             }
//           />

//           <Route
//             path="reports/rank-achievement-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <RankAchivementReport />
//               </Suspense>
//             }
//           />
//           <Route
//             path="payout-management/withdrawals"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <Withdrawals />
//               </Suspense>
//             }
//           />
//           <Route
//             path="payout-management/withdrawal-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <WithdrawalReport />
//               </Suspense>
//             }
//           />
//           <Route
//             path="income-management/daily-roi-income"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <DailyRoiIncome />
//               </Suspense>
//             }
//           />
//            <Route
//             path="income-management/binary-income-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <BinaryIncomeReport />
//               </Suspense>
//             }
//           />
//           <Route
//             path="income-management/leadership-share-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <LeadershipShareDistribution />
//               </Suspense>
//             }
//           />
//           <Route
//             path="income-management/leadership-income-report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <LeadershipIncomeReport />
//               </Suspense>
//             }
//           />
//           <Route
//             path="income-management/referrel-income"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <ReferralIncome />
//               </Suspense>
//             }
//           />
//           <Route
//             path="income-management/level-income-rewards"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <LevelIncomeRewards />
//               </Suspense>
//             }
//           />
//           {/* <Route
//             path="income-management/bonanza-rewards"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <BonanzaRewards />
//               </Suspense>
//             }
//           /> */}
//           <Route
//             path="swap-management/report"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <SwapManagementReport />
//               </Suspense>
//             }
//           />

//           <Route
//             path="settings/set-referral-income"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <SetReferralIncome />
//               </Suspense>
//             }
//           />

//             {/* <Route
//             path="settings/set-level-income"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <SetLevelIncome />
//               </Suspense>
//             }
//           /> */}


//           <Route
//             path="session-log"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <SessionLog />
//               </Suspense>
//             }
//           />
//           <Route
//             path="logout"
//             element={
//               <Suspense fallback={<AdminLoader />}>
//                 <Logout />
//               </Suspense>
//             }
//           />
//         </Route>
//       </Route>
//     </Routes>
//   );
// };

// export default AdminRoutes;
