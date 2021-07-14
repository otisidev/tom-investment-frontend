import React from "react";
import { ChevronRight, User, ToggleRight, Edit3, Shield } from "@styled-icons/feather";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "./../services/Authentication.Service";
import LanguageChanger from "./LanguageChanger";
import { PersonAdd } from "@styled-icons/ionicons-outline";

const TopNavigation = () => {
    const { t } = useTranslation();
    const user = authService.GetUser();
    return (
        <div className="top-bar">
            <div className="-intro-x breadcrumb mr-auto hidden sm:flex">
                <NavLink to="/app">{t("home.caption")}</NavLink>
                <ChevronRight size={18} />
                <NavLink to={{ pathname: `/app/profile` }} className="breadcrumb--active text-purple-500">
                    {user.firstname} {user.lastname}
                </NavLink>
            </div>

            <div className="intro-x relative mr-3 sm:mr-6">
                <LanguageChanger />
            </div>
            <div className="intro-x dropdown w-8 h-8 relative">
                <div className="dropdown-toggle w-8 h-8 border-gray-600 border-2 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110">
                    <img alt={user.firstname} src={user.image || "/dist/images/profile.jpg"} />
                </div>
                <div className="dropdown-box mt-10 absolute w-56 top-0 right-0 z-20">
                    <div className="dropdown-box__content box bg-gray-800 text-white">
                        <div className="p-4 border-b border-theme-40">
                            <div className="font-medium">
                                {user.firstname} {user.lastname}
                            </div>
                            <div className="text-xs text-theme-41">Investor</div>
                        </div>
                        <div className="p-2">
                            <NavLink
                                to="/app/profile"
                                className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-600 rounded-md"
                            >
                                <User className="w-4 h-4 mr-2" size={18} /> {t("side.profile")}
                            </NavLink>

                            <NavLink
                                to="/app/profile/change-password"
                                className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-600 rounded-md"
                            >
                                <Shield className="w-4 h-4 mr-2" size={18} /> {t("change_password")}
                            </NavLink>
                            <NavLink
                                to="/app/profile/update"
                                className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-600 rounded-md"
                            >
                                <Edit3 className="w-4 h-4 mr-2" size={18} /> {t("account_setting")}
                            </NavLink>
                            <NavLink
                                to="/app/profile/next-of-kin"
                                className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-600 rounded-md"
                            >
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
                                className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-600 rounded-md"
                            >
                                <ToggleRight className="w-4 h-4 mr-2" size={18} /> Logout
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TopNavigation;
