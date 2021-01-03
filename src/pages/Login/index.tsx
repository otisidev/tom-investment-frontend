import React, { FC, useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../context/App";
import PrimaryButton, { ButtonType } from "../../components/Button";
import { ArrowRight, UserPlus } from "@styled-icons/feather";
import { useTranslation } from "react-i18next";
import { NavLink, Redirect } from "react-router-dom";
import { LOGIN } from "../../queries/user.query";
import { useMutation } from "@apollo/react-hooks";
import { authService } from "../../services/Authentication.Service";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../context/App";

interface iProp {
    history?: any;
    location?: any;
}

const Login: FC<iProp> = ({ history, location }) => {
    document.body.className = "login";
    const { t } = useTranslation();
    //
    const [model, setModel] = useState({ email: "", password: "" });
    const [attempt] = useState(0);
    const [showToken, setShowToken] = useState(false);
    const [token, setToken] = useState("");

    const [loginFunc, { loading }] = useMutation(LOGIN, {
        onError: (error) => {
            if (error.message.includes("Invalid verification code")) {
                toast.warning(error.message);
                setShowToken(true);
            } else toast.error(CleanMessage(error.message));
        },
        onCompleted: (data) => {
            if (data.Login) {
                const { token: t, doc, message } = data.Login;
                if (t) {
                    authService.Login(doc, t);
                    const { from } = location.state || {
                        from: { pathname: "/app" },
                    };
                    document.location.href = from.pathname;
                } else {
                    toast.success(message);
                    setShowToken(true);
                }
            }
        },
    });

    if (authService.IsAuthenticated()) return <Redirect to="/app" />;

    return (
        <>
            <Helmet>
                <title>
                    {t("login")} | {AppName}
                </title>
            </Helmet>

            <div className="container sm:px-10">
                <div className="block xl:grid grid-cols-2 gap-4">
                    <div className="hidden xl:flex flex-col min-h-screen">
                        <a href="/" className="-intro-x flex items-center pt-5">
                            <img alt="Investment bot" className="w-6" src="dist/images/icon.svg" />
                            <span className="text-theme-1 text-lg ml-3">
                                Tom<span className="font-medium">Investment</span>
                            </span>
                        </a>
                        <div className="my-auto">
                            <img alt="investment bot" className="-intro-x w-3/4 -mt-16" src="dist/images/login-bg.png" />
                            <div className="-intro-x text-theme-1 font-medium text-4xl leading-tight mt-10">
                                {t("login_title")}
                                <br />
                                {t("login_title_2")}
                            </div>
                            <div className="-intro-x mt-5 text-lg text-theme-1">{t("login_title_desc")}</div>
                        </div>
                    </div>

                    <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                        <div className="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-3/4 xl:w-3/4">
                            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">{t("login.caption")}</h2>
                            <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">{t("login_desc")}</div>
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    await loginFunc({
                                        variables: {
                                            email: model.email,
                                            password: model.password,
                                            option: {
                                                attempt,
                                                userAgent: navigator.userAgent,
                                                token
                                            }
                                        }
                                    });
                                }}
                            >
                                <div className="intro-x mt-8">
                                    <input
                                        defaultValue={model.email}
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, email: value })}
                                        type="email"
                                        required
                                        className="intro-x login__input input w-full input--lg border border-gray-300 block"
                                        placeholder={t("email.placeholder")}
                                    />
                                    <input
                                        defaultValue={model.password}
                                        type="password"
                                        required
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, password: value })}
                                        className="intro-x login__input input w-full input--lg border border-gray-300 block mt-4"
                                        placeholder={t("password.placeholder")}
                                    />
                                    {showToken && (
                                        <input
                                            type="text"
                                            required
                                            defaultValue={token}
                                            onChange={({ currentTarget: { value } }) => setToken(value)}
                                            className="intro-x login__input input w-full input--lg border border-gray-300 block mt-4"
                                            placeholder={t("token-input")}
                                        />
                                    )}
                                </div>
                                <div className="intro-x flex text-gray-700 text-xs sm:text-sm mt-4">
                                    <div className="flex items-center mr-auto">
                                        <input type="checkbox" className="input border mr-2" id="remember-me" />
                                        <label className="cursor-pointer select-none" htmlFor="remember-me">
                                            {t("remember.text")}
                                        </label>
                                    </div>
                                    <NavLink to="/forgot-password">{t("forget.password")}</NavLink>
                                </div>
                                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                    <PrimaryButton
                                        type={ButtonType.submit}
                                        loading={loading}
                                        disabled={loading}
                                        className="button button--lg w-full xl:w-32 text-white bg-theme-1 xl:mr-3"
                                    >
                                        {t("login")} <ArrowRight size={18} />
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        onClick={() => history.push("/create-account")}
                                        className="button button--lg w-full xl:w-32 text-gray-700 border border-gray-300 mt-3 xl:mt-0"
                                    >
                                        {t("sign_up")} <UserPlus size={18} className="text-theme-1" />
                                    </button>
                                </div>
                            </form>
                            <div className="intro-x mt-10 xl:mt-24 text-gray-700 text-center xl:text-left">
                                {t("terms_intro")}
                                <br />
                                <a className="text-theme-1" href="/">
                                    {t("terms")}{" "}
                                </a>
                                &{" "}
                                <a className="text-theme-1" href="/">
                                    {t("policy")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
