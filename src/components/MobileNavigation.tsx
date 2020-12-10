import React, { useEffect } from "react";
import { BarChart2, Home, CreditCard, Users, User, Settings, CheckCircle, ShoppingBag, Activity } from "@styled-icons/feather";
import $ from "jquery";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "./../services/Authentication.Service";

const MobileNavigation = () => {
    useEffect(() => {
        $("#mobile-menu-toggler").on("click", function () {
            if ($(".mobile-menu").find("ul").first().is(":visible")) {
                $(".mobile-menu").find("ul").first().slideUp();
            } else {
                $(".mobile-menu").find("ul").first().slideDown();
            }
        });

        $(".mobile-menu")
            .find(".menu")
            .on("click", function () {
                if ($(".mobile-menu").find("ul").first().is(":visible")) {
                    $(".mobile-menu").find("ul").first().slideUp();
                } else {
                    $(".mobile-menu").find("ul").first().slideDown();
                }
            });
    }, []);

    const { t } = useTranslation();

    const { admin } = authService.GetUser();
    return (
        <div className="mobile-menu md:hidden">
            <div className="mobile-menu-bar">
                <a href="/in" className="flex mr-auto">
                    <img alt="investment bot" className="w-6" src="/dist/images/logo.svg" />
                </a>
                <a href="javascript:;" id="mobile-menu-toggler">
                    <BarChart2 className="w-8 h-8 text-white transform -rotate-90" size={18} />
                </a>
            </div>
            <ul className="border-t border-theme-24 py-5 hidden">
                <li>
                    <NavLink exact to="/app" className="menu">
                        <div className="menu__icon">
                            <Home size={18} />
                        </div>
                        <div className="menu__title"> {t("home.caption")} </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/app/user-investment" className="menu">
                        <div className="menu__icon">
                            <CreditCard size={18} />
                        </div>
                        <div className="menu__title"> {t("investment")} </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/app/referral" className="menu">
                        <div className="menu__icon">
                            <Users size={18} />
                        </div>
                        <div className="menu__title"> {t("referrer")} </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/app/profile" className="menu">
                        <div className="menu__icon">
                            <User size={18} />
                        </div>
                        <div className="menu__title"> {t("profile")} </div>
                    </NavLink>
                </li>
                {admin && (
                    <>
                        <li className="menu__devider my-6"></li>
                        <li>
                            <NavLink exact to="/app/investment-approval" className="menu">
                                <div className="menu__icon">
                                    <CheckCircle size={18} />
                                </div>
                                <div className="menu__title"> Investment Approval </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/app/active-investment" className="menu">
                                <div className="menu__icon">
                                    <ShoppingBag size={18} />
                                </div>
                                <div className="menu__title"> Active Investment </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/app/ref-bonus" className="menu">
                                <div className="menu__icon">
                                    <CreditCard size={18} />
                                </div>
                                <div className="menu__title"> Referral Bonus</div>
                            </NavLink>
                        </li>
                        <li className="menu__devider my-6"></li>
                        <li>
                            <NavLink to="/app/plan" className="menu">
                                <div className="menu__icon">
                                    <Activity size={18} />
                                </div>
                                <div className="menu__title">Plan Management </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/app/load-investment" className="menu">
                                <div className="menu__icon">
                                    <CreditCard size={18} />
                                </div>
                                <div className="menu__title">Load Investment </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/app/users" className="menu">
                                <div className="menu__icon">
                                    <Users size={18} />
                                </div>
                                <div className="menu__title">User Management</div>
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default MobileNavigation;
