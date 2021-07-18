import React from "react";
import { Home, CreditCard, Users, User, Settings, Activity, CheckCircle, ShoppingBag, Paperclip, Columns } from "@styled-icons/feather";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "./../services/Authentication.Service";
import { Cash, Wallet } from "@styled-icons/ionicons-outline";

const AppMenu = () => {
    const { t } = useTranslation();
    const user = authService.GetUser();
    return (
        <nav className="side-nav">
            <a href="/" className="intro-x flex items-center pl-5 p2-4">
                <img alt="Timo Stephan Investment" className="w-10" src="/dist/images/icon.png" />
                <span className="text-theme-1 text-lg ml-3">
                    Timo <span className="font-bold">Stephan</span>
                </span>
            </a>
            <ul className="my-6">
                <li>
                    <NavLink exact to="/app" className="side-menu" activeClassName="side-menu--active">
                        <div className="side-menu__icon">
                            <Home size={18} />
                        </div>
                        <div className="side-menu__title"> {t("home.caption")} </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/app/user-investment" className="side-menu" activeClassName="side-menu--active">
                        <div className="side-menu__icon">
                            <CreditCard size={18} />
                        </div>
                        <div className="side-menu__title"> {t("investment")} </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/app/referral" className="side-menu" activeClassName="side-menu--active">
                        <div className="side-menu__icon">
                            <Users size={18} />
                        </div>
                        <div className="side-menu__title"> {t("referrer")} </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/app/profile" className="side-menu" activeClassName="side-menu--active">
                        <div className="side-menu__icon">
                            <User size={18} />
                        </div>
                        <div className="side-menu__title"> {t("profile")} </div>
                    </NavLink>
                </li>
                {user.admin && (
                    <>
                        <div className="side-nav__devider my-6"></div>

                        <li>
                            <NavLink to="/app/category" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <Settings size={18} />
                                </div>
                                <div className="side-menu__title">Category Management </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/app/plan" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <Activity size={18} />
                                </div>
                                <div className="side-menu__title">Plan Management </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/app/load-investment" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <CreditCard size={18} />
                                </div>
                                <div className="side-menu__title">Load Investment </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/app/users" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <Users size={18} />
                                </div>
                                <div className="side-menu__title">User Management</div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/app/contact-person" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <Paperclip size={18} />
                                </div>
                                <div className="side-menu__title">Contact Person</div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/app/currency" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <Cash size={18} />
                                </div>
                                <div className="side-menu__title">Currency Settings</div>
                            </NavLink>
                        </li>
                        <div className="side-nav__devider my-6"></div>
                        <li>
                            <NavLink exact to="/app/payout" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <ShoppingBag size={18} />
                                </div>
                                <div className="side-menu__title">Payout </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/app/investment-approval" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <CheckCircle size={18} />
                                </div>
                                <div className="side-menu__title"> Investment Approval </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/app/active-investment" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <Columns size={18} />
                                </div>
                                <div className="side-menu__title"> Active Investment </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/app/ref-bonus" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <Users size={18} />
                                </div>
                                <div className="side-menu__title">Referral Bonus</div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/app/top-up" className="side-menu" activeClassName="side-menu--active">
                                <div className="side-menu__icon">
                                    <Wallet size={18} />
                                </div>
                                <div className="side-menu__title">Top-up Request</div>
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default AppMenu;
