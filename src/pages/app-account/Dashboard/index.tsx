import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../../services/Authentication.Service";
import { useQuery } from "@apollo/react-hooks";
import { GET_COUNTS } from "../../../queries/statistics.query";
import { toast } from "react-toastify";
import { CleanMessage, toCurrency } from "./../../../context/App";
import { LoadingIcon } from "../../../components/Button";
import { RefreshCcw, Eye, PieChart, Users, GitCommit } from "@styled-icons/feather";
import { Albums, CheckmarkDone, People, PeopleCircle, Cash, Wallet, StatsChart, Layers, RadioButtonOn, ShieldCheckmark } from "@styled-icons/ionicons-outline";
import UpdateImage from "../Profile/UpdateImage";
import UpdatePassword from "../Profile/ChangePassword";
import UpdateEmail from "../Profile/UpdateEmail";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
    const { t } = useTranslation();
    const { admin } = authService.GetUser();
    const { loading, data, refetch } = useQuery(GET_COUNTS, { onError: (er) => toast.error(CleanMessage(er.message)), notifyOnNetworkStatusChange: true });

    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">
                    <PieChart className="w-8 h-8 mr-3 text-theme-1" />
                    {t("account.statistic")}
                </h2>
                <a href="#" onClick={async () => await refetch()} className="ml-auto flex text-theme-1">
                    <RefreshCcw className="w-4 h-4 mr-3" />
                    Reload Data
                </a>
            </div>
            <LoadingIcon loading={loading} />
            {data && (
                <>
                    <div className="grid grid-cols-12 gap-6 mt-8">
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                            <NavLink to="/app/user-investment">
                                <div className="report-box zoom-in">
                                    <div className="box p-5">
                                        <div className="flex">
                                            <Albums className="report-box__icon text-theme-10" />
                                            <div className="ml-auto">
                                                <div className="report-box__indicator bg-theme-1 tooltip cursor-pointer" title="33% Higher than last month">
                                                    <Eye className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold leading-8 mt-6">{toCurrency(data.CountInvestment)}</div>
                                        <div className="text-base text-gray-600 mt-1">{t("investment")}</div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                            <NavLink to="/app/user-investment">
                                <div className="report-box zoom-in">
                                    <div className="box p-5">
                                        <div className="flex">
                                            <Albums className="report-box__icon text-theme-10" />
                                            <div className="ml-auto">
                                                <div className="report-box__indicator bg-theme-9 tooltip cursor-pointer" title="33% Higher than last month">
                                                    <CheckmarkDone className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold leading-8 mt-6">{toCurrency(data.CountApprovedInvestment)}</div>
                                        <div className="text-base text-gray-600 mt-1">{t("investment.approved")}</div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                            <NavLink to="/app/referral">
                                <div className="report-box zoom-in">
                                    <div className="box p-5">
                                        <div className="flex">
                                            <People className="report-box__icon text-theme-11" />
                                            <div className="ml-auto">
                                                <div className="report-box__indicator bg-theme-11 tooltip cursor-pointer" title="33% Higher than last month">
                                                    <PeopleCircle className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold leading-8 mt-6">{toCurrency(data.CountReferral)}</div>
                                        <div className="text-base text-gray-600 mt-1">{t("home.referral")}</div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                            <div className="report-box zoom-in">
                                <div className="box p-5">
                                    <div className="flex">
                                        <Wallet className="report-box__icon text-theme-9" />
                                        <div className="ml-auto">
                                            <div className="report-box__indicator bg-theme-9 tooltip cursor-pointer" title="33% Higher than last month">
                                                <Cash className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold leading-8 mt-6">${toCurrency(data.SumInvestmentMade)}</div>
                                    <div className="text-base text-gray-600 mt-1">{t("investment.made")}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-">
                            <UpdateImage />
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-6 intro-">
                            <UpdatePassword />
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-">
                            <UpdateEmail />
                        </div>
                    </div>
                    {admin && (
                        <>
                            <div className="intro-y flex items-center mt-12">
                                <h2 className="text-lg font-medium mr-auto">
                                    <StatsChart className="h-8 w-8 text-theme-1" /> Statistics
                                </h2>
                            </div>
                            <div className="grid grid-cols-12 gap-6 mt-8">
                                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                    <NavLink to="/app/users">
                                        <div className="report-box zoom-in">
                                            <div className="box p-5">
                                                <div className="flex">
                                                    <Users className="report-box__icon text-theme-1" />
                                                    <div className="ml-auto">
                                                        <div className="report-box__indicator bg-theme-1 tooltip cursor-pointer">
                                                            <People className="w-4 h-4 mr-1" /> All
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-bold leading-8 mt-6">{toCurrency(data.CountUsers)}</div>
                                                <div className="text-base text-gray-600 mt-1">Total Users</div>
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                    <NavLink to="/app/investment-approval">
                                        <div className="report-box zoom-in">
                                            <div className="box p-5">
                                                <div className="flex">
                                                    <RadioButtonOn className="report-box__icon text-theme-11" />
                                                    <div className="ml-auto">
                                                        <div className="report-box__indicator bg-theme-11 tooltip cursor-pointer">
                                                            <GitCommit className="w-4 h-4 mr-1" /> 0-0
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-bold leading-8 mt-6">{toCurrency(data.CountPendingInvestment)}</div>
                                                <div className="text-base text-gray-600 mt-1">Pending Investment</div>
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                    <NavLink to="/app/active-investment">
                                        <div className="report-box zoom-in">
                                            <div className="box p-5">
                                                <div className="flex">
                                                    <ShieldCheckmark className="report-box__icon text-theme-9" />
                                                    <div className="ml-auto">
                                                        <div className="report-box__indicator bg-theme-9 tooltip cursor-pointer">
                                                            <Layers className="w-4 h-4 mr-1" /> 1-1
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-bold leading-8 mt-6">{toCurrency(data.CountActiveInvestment)}</div>
                                                <div className="text-base text-gray-600 mt-1">Active Investment</div>
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Dashboard;
