import React from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../context/App";
import { useTranslation } from "react-i18next";
import MobileNavigation from "../../components/MobileNavigation";
import TopNavigation from "../../components/TopNavigation";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import YourInvestment from "./YourInvestment";
import YourReferral from "./Referrals/index";
import Profile from "./Profile/index";
import InvestmentHistory from "./YourInvestment/History";
import Plan from "./Management/Plan";
import UserManagement from "./User/index";
import UserProfile from "./User/Profile";
import LoadInvestment from "./Management/LoadInvestment/index";
import AdminRoute from "../../components/AdminRoute";
import Payout from "./AdminCorner/Payout/index";
import InvestmentApproval from "./AdminCorner/InvestmentApproval/index";
import ReferralBonus from "./AdminCorner/ref-bonus";
import ActiveInvestment from "./AdminCorner/ActiveInvestment";
import AppMenu from "../../components/Menu";
import CategoryApp from "./AdminCorner/Category";
import ContactPerson from "./AdminCorner/ContactPerson";
import SingleInvestment from "./YourInvestment/investment";
import TopUpRequest from "./AdminCorner/top-up-request";
import CurrencyApp from "./AdminCorner/Currency";
import { UserReferral } from "./AdminCorner/referral";
import sendMail from "./User/send-mail";

const AppAccount = () => {
    // Update css class name
    document.body.className = "app";
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>
                    {t("Dashboard")} | {AppName}
                </title>
            </Helmet>
            <MobileNavigation />

            <div className="flex">
                <AppMenu />
                <div className="content">
                    <TopNavigation />
                    {/* ALERT */}
                    <div className="bg-red-200 rounded-lg py-4 px-3 shadow-lg cursor-pointer select-none">
                        <p className="text-lg font-bold text-red-600">Alert!!</p>
                        <p className="text-red-500">
                            DDear esteem investor kindly reset your password for security reason. TSPI is still under maintenance to secure
                            your investment
                            <br /> All pending deposits and new investments will be added to our system database upon resumption.
                            <br /> <br /> Best Regard timo team.
                        </p>
                    </div>

                    <Switch>
                        <Route exact path="/app" component={Dashboard} />
                        <Route exact path="/app/user-investment" component={YourInvestment} />
                        <Route exact path="/app/user-investment/:id" component={SingleInvestment} />
                        <Route exact path="/app/referral" component={YourReferral} />
                        <Route path="/app/profile" component={Profile} />
                        <Route path="/app/investment-history/:id" component={InvestmentHistory} />
                        <AdminRoute path="/app/plan" component={Plan} />
                        <AdminRoute path="/app/users" exact component={UserManagement} />
                        <AdminRoute path="/app/users/send-mail" component={sendMail} />
                        <Route path="/app/user/:id" component={UserProfile} />
                        <AdminRoute path="/app/load-investment" component={LoadInvestment} />
                        <AdminRoute path="/app/payout" component={Payout} />
                        <AdminRoute path="/app/investment-approval" component={InvestmentApproval} />
                        <AdminRoute path="/app/ref-bonus" component={ReferralBonus} />
                        <AdminRoute path="/app/active-investment" component={ActiveInvestment} />
                        <AdminRoute path="/app/category" component={CategoryApp} />
                        <AdminRoute path="/app/contact-person" component={ContactPerson} />
                        <AdminRoute path="/app/top-up" component={TopUpRequest} />
                        <AdminRoute path="/app/currency" component={CurrencyApp} />
                        <AdminRoute path="/app/user-referral" component={UserReferral} />
                    </Switch>
                </div>
            </div>
        </>
    );
};

export default AppAccount;
