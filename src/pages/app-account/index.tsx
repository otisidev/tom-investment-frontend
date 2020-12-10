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
            <TopNavigation />
            <div className="content">
                <Switch>
                    <Route exact path="/app" component={Dashboard} />
                    <Route exact path="/app/user-investment" component={YourInvestment} />
                    <Route exact path="/app/referral" component={YourReferral} />
                    <Route path="/app/profile" component={Profile} />
                    <Route path="/app/investment-history/:id" component={InvestmentHistory} />
                    <AdminRoute path="/app/plan" component={Plan} />
                    <AdminRoute path="/app/users" component={UserManagement} />
                    <Route path="/app/user/:id" component={UserProfile} />
                    <AdminRoute path="/app/load-investment" component={LoadInvestment} />
                    <AdminRoute path="/app/payout" component={Payout} />
                    <AdminRoute path="/app/investment-approval" component={InvestmentApproval} />
                    <AdminRoute path="/app/ref-bonus" component={ReferralBonus} />
                    <AdminRoute path="/app/active-investment" component={ActiveInvestment} />
                </Switch>
            </div>
        </>
    );
};

export default AppAccount;
