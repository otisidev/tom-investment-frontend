import React, { FC, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AppName, GetValueFromURL } from "../context/App";
import { useTranslation } from "react-i18next";
import { ACCOUNT_VERIFY } from "../queries/user.query";
import { useMutation } from "@apollo/react-hooks";
import { authService } from "../services/Authentication.Service";
import { toast } from "react-toastify";
import { CleanMessage } from "./../context/App";
import { LoadingIcon } from "./../components/Button/index";

interface iProp {
    history?: any;
    location?: any;
}

const Verify: FC<iProp> = ({ location }) => {
    document.body.className = "login";
    const { t } = useTranslation();
    const email = GetValueFromURL("email");
    const id = GetValueFromURL("ref");
    //
    const [model] = useState({ email, id });

    const [verifyFunc, { loading }] = useMutation(ACCOUNT_VERIFY, {
        onError: (error) => {
            toast.error(CleanMessage(error.message));
        },
        onCompleted: (data) => {
            if (data.VerifyAccount) {
                const { token, doc, message } = data.VerifyAccount;

                toast.success(message);
                authService.Login(doc, token);
                const { from } = location.state || {
                    from: { pathname: "/app" },
                };
                document.location.href = from.pathname;
            }
        },
    });

    if (authService.IsAuthenticated()) {
        authService.Logout();
    }
    useEffect(() => {
        if (model.id) verifyFunc({ variables: { id: model.id } });
    }, [model, verifyFunc]);

    return (
        <>
            <Helmet>
                <title> Account verification | {AppName}</title>
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
                            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">Account Verification</h2>
                            <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">Verification should happen automatically.</div>

                            <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                <LoadingIcon loading={loading} />
                                {loading && <span className="text-lg text-center py-5">Please wait...</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Verify;
