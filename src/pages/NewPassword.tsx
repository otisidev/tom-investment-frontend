import React, { FC, useState } from "react";
import { Helmet } from "react-helmet";
import { AppName, GetValueFromURL } from "../context/App";
import PrimaryButton, { ButtonType } from "../components/Button";
import { ArrowRight } from "@styled-icons/feather";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { authService } from "../services/Authentication.Service";
import { toast } from "react-toastify";
import { CleanMessage } from "./../context/App";
import { NEW_PASSWORD } from "./../queries/user.query";

interface iProp {
    history?: any;
    location?: any;
}

const NewPassword: FC<iProp> = ({ location }) => {
    document.body.className = "login";
    const { t } = useTranslation();
    //
    const id = GetValueFromURL("ref");
    const email = GetValueFromURL("email");

    const [model, setModel] = useState({ password: "", confirm: "" });

    const [CreateFunc, { loading }] = useMutation(NEW_PASSWORD, {
        onError: (error) => {
            toast.error(CleanMessage(error.message));
        },
        onCompleted: (data) => {
            const { token, doc, message } = data.NewPassword;
            toast.success(message);
            authService.Login(doc, token);
            const { from } = location.state || {
                from: { pathname: "/app" },
            };
            document.location.href = from.pathname;
        },
    });

    if (authService.IsAuthenticated()) return <Redirect to="/app" />;
    if (!id || !email) return <Redirect to="/resource/404" />;
    return (
        <>
            <Helmet>
                <title>New Password | {AppName}</title>
            </Helmet>

            <div className="container sm:px-10">
                <div className="block xl:grid grid-cols-2 gap-4">
                    <div className="hidden xl:flex flex-col min-h-screen">
                        <a href="/" className="-intro-x flex items-center pt-5">
                            <img alt="Investment bot" className="w-6" src="../../dist/images/logo.svg" />
                            <span className="text-white text-lg ml-3">
                                Investment<span className="font-medium">Bot</span>
                            </span>
                        </a>
                        <div className="my-auto">
                            <img alt="investment bot" className="-intro-x w-1/2 -mt-16" src="../../dist/images/Site-constructor.svg" />
                            <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                                {t("login_title")}
                                <br />
                                {t("login_title_2")}
                            </div>
                            <div className="-intro-x mt-5 text-lg text-white">{t("login_title_desc")}</div>
                        </div>
                    </div>

                    <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                        <div className="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">New Password</h2>
                            <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">New Password after reset.</div>
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    if (model.password === model.confirm) {
                                        await CreateFunc({
                                            variables: {
                                                email,
                                                password: model.password,
                                            },
                                        });
                                    } else toast.warning("Passwords do not match!");
                                }}
                            >
                                <div className="intro-x mt-8">
                                    <input
                                        defaultValue={model.password}
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, password: value })}
                                        type="password"
                                        required
                                        className="intro-x login__input input input--lg border border-gray-300 block"
                                        placeholder="Enter new password"
                                    />
                                    <input
                                        defaultValue={model.confirm}
                                        type="password"
                                        required
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, confirm: value })}
                                        className="intro-x login__input input input--lg border border-gray-300 block mt-4"
                                        placeholder="Confirm password"
                                    />
                                </div>

                                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                    <PrimaryButton type={ButtonType.submit} loading={loading} disabled={loading} className="button button--lg w-full xl:w-42 text-white bg-theme-1 xl:mr-3">
                                        Update Password <ArrowRight size={18} />
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewPassword;
