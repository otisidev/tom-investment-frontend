import React, { FC, useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../context/App";
import PrimaryButton, { ButtonType } from "../components/Button";
import { ArrowRight, ArrowLeft } from "@styled-icons/feather";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../context/App";
import { PASSWORD_RESET } from "../queries/user.query";

interface iProp {
    history?: any;
}

const ForgotPassword: FC<iProp> = ({ history }) => {
    document.body.className = "login";
    const { t } = useTranslation();
    const [email, setEmail] = useState("");

    const [resetFunc, { loading }] = useMutation(PASSWORD_RESET, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.ResetPassword) {
                toast.success(data.ResetPassword);
            }
        },
    });

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
                            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">{t("forgot.password.caption")}</h2>
                            <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">{t("login_desc")}</div>
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    await resetFunc({
                                        variables: {
                                            email,
                                        },
                                    });
                                }}
                            >
                                <div className="intro-x mt-8">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        {t("email.label")}
                                    </label>
                                    <input
                                        defaultValue={email}
                                        onChange={({ currentTarget: { value, validity } }) => validity.valid && setEmail(value)}
                                        type="email"
                                        id="email"
                                        className="intro-x login__input input w-full input--lg border border-gray-300 block"
                                        placeholder={t("email.placeholder")}
                                    />
                                </div>

                                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                    <PrimaryButton type={ButtonType.submit} loading={loading} className="button button--lg w-full xl:w-32 text-white bg-theme-1 xl:mr-3">
                                        {t("submit.text")} <ArrowRight size={18} />
                                    </PrimaryButton>

                                    <button type="button" onClick={() => history.push("/")} className="button button--lg w-full xl:w-32 text-gray-700 border border-gray-300 mt-3 xl:mt-0">
                                        <ArrowLeft size={18} className="text-theme-1" /> {t("login.caption")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
