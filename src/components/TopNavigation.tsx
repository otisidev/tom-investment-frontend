import React from "react";
import { ChevronRight, Home, CreditCard, Users, User, Settings, ChevronDown, Activity, CheckCircle, ShoppingBag, ToggleRight, Database, Columns, Edit3, Shield } from "@styled-icons/feather";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "./../services/Authentication.Service";
import LanguageChanger from "./LanguageChanger";
import { Box } from "@styled-icons/feather/Box";
import { PersonAdd } from "@styled-icons/ionicons-outline";

const TopNavigation = () => {
    const { t } = useTranslation();
    const user = authService.GetUser();
    return (
        <>
            <div className="border-b border-theme-24 -mt-10 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 pt-3 md:pt-0 mb-10">
                <div className="top-bar-boxed flex items-center">
                    <a href="/" className="-intro-x hidden md:flex">
                        <img alt="Investment Bot" className="w-6" src="/dist/images/logo.svg" />
                        <span className="text-white text-lg ml-3">
                            Investment<span className="font-medium">Bot</span>
                        </span>
                    </a>

                    <div className="-intro-x breadcrumb breadcrumb--light mr-auto">
                        <NavLink to="/app" className="">
                            {t("home.caption")}
                        </NavLink>
                        <ChevronRight size={18} />
                        <NavLink to={{ pathname: `/app/profile` }} className="breadcrumb--active">
                            {user.firstname} {user.lastname}
                        </NavLink>
                    </div>
                    <div className="intro-x relative mr-3 sm:mr-6">
                        <LanguageChanger />
                    </div>
                    <div className="intro-x dropdown w-8 h-8 relative">
                        <div className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110">
                            <img alt={user.firstname} src={user.image || "/dist/images/profile.png"} />
                        </div>
                        <div className="dropdown-box mt-10 absolute w-56 top-0 right-0 z-20">
                            <div className="dropdown-box__content box bg-theme-38 text-white">
                                <div className="p-4 border-b border-theme-40">
                                    <div className="font-medium">
                                        {user.firstname} {user.lastname}
                                    </div>
                                    <div className="text-xs text-theme-41">Investor</div>
                                </div>
                                <div className="p-2">
                                    <NavLink to="/app/profile" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                        <User className="w-4 h-4 mr-2" size={18} /> {t("side.profile")}
                                    </NavLink>

                                    <NavLink to="/app/profile/change-password" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                        <Shield className="w-4 h-4 mr-2" size={18} /> {t("change_password")}
                                    </NavLink>
                                    <NavLink to="/app/profile/update" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                        <Edit3 className="w-4 h-4 mr-2" size={18} /> {t("account_setting")}
                                    </NavLink>
                                    <NavLink to="/app/profile/next-of-kin" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md">
                                        <PersonAdd className="w-4 h-4 mr-2" size={18} /> {t("next_heading")}
                                    </NavLink>
                                </div>
                                <div className="p-2 border-t border-theme-40">
                                    <NavLink
                                        to="#"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            authService.Logout();
                                            document.location.href = "/";
                                        }}
                                        className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
                                    >
                                        <ToggleRight className="w-4 h-4 mr-2" size={18} /> Logout
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="top-nav">
                <ul>
                    <li>
                        <NavLink exact to="/app" className="top-menu" activeClassName="top-menu--active">
                            <div className="top-menu__icon">
                                <Home size={18} />
                            </div>
                            <div className="top-menu__title"> {t("home.caption")} </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/app/user-investment" className="top-menu" activeClassName="top-menu--active">
                            <div className="top-menu__icon">
                                <CreditCard size={18} />
                            </div>
                            <div className="top-menu__title"> {t("investment")} </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/app/referral" className="top-menu" activeClassName="top-menu--active">
                            <div className="top-menu__icon">
                                <Users size={18} />
                            </div>
                            <div className="top-menu__title"> {t("referrer")} </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/app/profile" className="top-menu" activeClassName="top-menu--active">
                            <div className="top-menu__icon">
                                <User size={18} />
                            </div>
                            <div className="top-menu__title"> {t("profile")} </div>
                        </NavLink>
                    </li>
                    {user.admin && (
                        <>
                            <li>
                                <a href="javascript:;" className="top-menu">
                                    <div className="top-menu__icon">
                                        <Database size={18} />
                                    </div>
                                    <div className="top-menu__title">
                                        Management <ChevronDown size={18} />
                                    </div>
                                </a>
                                <ul className="">
                                    <li>
                                        <NavLink to="/app/plan" className="top-menu">
                                            <div className="top-menu__icon">
                                                <Activity size={18} />
                                            </div>
                                            <div className="top-menu__title">Plan Management </div>
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink to="/app/load-investment" className="top-menu">
                                            <div className="top-menu__icon">
                                                <CreditCard size={18} />
                                            </div>
                                            <div className="top-menu__title">Load Investment </div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/app/users" className="top-menu">
                                            <div className="top-menu__icon">
                                                <Users size={18} />
                                            </div>
                                            <div className="top-menu__title">User Management</div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="javascript:;" className="top-menu">
                                    <div className="top-menu__icon">
                                        <Box size={18} />
                                    </div>
                                    <div className="top-menu__title">
                                        Admin Corner <ChevronDown size={18} />
                                    </div>
                                </a>
                                <ul className="">
                                    <li>
                                        <NavLink exact to="/app/payout" className="top-menu">
                                            <div className="top-menu__icon">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div className="top-menu__title">Payout </div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink exact to="/app/investment-approval" className="top-menu">
                                            <div className="top-menu__icon">
                                                <CheckCircle size={18} />
                                            </div>
                                            <div className="top-menu__title"> Investment Approval </div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink exact to="/app/active-investment" className="top-menu">
                                            <div className="top-menu__icon">
                                                <Columns size={18} />
                                            </div>
                                            <div className="top-menu__title"> Active Investment </div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink exact to="/app/ref-bonus" className="top-menu">
                                            <div className="top-menu__icon">
                                                <Users size={18} />
                                            </div>
                                            <div className="top-menu__title">Referral Bonus</div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
};
export default TopNavigation;
