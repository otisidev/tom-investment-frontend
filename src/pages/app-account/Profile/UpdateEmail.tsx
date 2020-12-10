import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Settings } from "@styled-icons/feather";
import { LoadingIcon } from "../../../components/Button";
import { Helmet } from "react-helmet";
import { AppName } from "../../../context/App";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { authService } from "../../../services/Authentication.Service";
import { UPDATE_EMAIL, REQUEST_EMAIL } from "../../../queries/user.query";

const UpdateEmail = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState("");
    const [code, setCode] = useState("");
    const [showCode, setShowCode] = useState(false);

    const [SendRequestFunc, { loading: rLoading }] = useMutation(REQUEST_EMAIL, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.SendEmailModificationRequest) {
                toast.success(data.SendEmailModificationRequest);
                setShowCode(true);
            }
        },
    });

    const [updateEmailFunc, { loading }] = useMutation(UPDATE_EMAIL, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.UpdateEmailAddress) {
                authService.Logout();
                toast.success(t("email.updated"));
                setTimeout(() => {
                    document.location.href = "/";
                }, 300);
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>
                    {t("change_email")} | {AppName}
                </title>
            </Helmet>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    if (model && code) {
                        await updateEmailFunc({ variables: { email: model, code } });
                    } else {
                        toast.warn("Please enter a valid email and the code sent to your new email address.");
                    }
                }}
            >
                <div className="intro-y box lg:mt-5" style={{ minHeight: "65vh" }}>
                    <div className="flex items-center p-5 border-b border-gray-200">
                        <h2 className="font-medium text-base mr-auto">
                            <Settings className="w-4 h-4 mr-2 text-theme-1" /> {t("change_email")}
                        </h2>
                    </div>
                    <p className="p-5">
                        <LoadingIcon loading={rLoading || loading} />
                        <div>
                            <label>{t("email.label")}</label>
                            <input
                                required
                                defaultValue={model}
                                onChange={({ currentTarget: { value } }) => setModel(value)}
                                type="email"
                                className="input w-full border mt-2"
                                placeholder={t("email.label")}
                            />
                        </div>
                        {showCode && (
                            <div className="intro-y mt-3">
                                <label>{t("reset-code")}</label>
                                <input
                                    required
                                    defaultValue={code}
                                    onChange={({ currentTarget: { validity, value } }) => validity.valid && setCode(value)}
                                    type="text"
                                    className="input w-full border mt-2"
                                    placeholder={t("reset-code")}
                                />
                            </div>
                        )}
                        {!showCode && (
                            <button
                                type="button"
                                onClick={async () => {
                                    if (model) {
                                        await SendRequestFunc({ variables: { email: model } });
                                    } else {
                                        toast.warn("Please enter a valid email address!");
                                    }
                                }}
                                disabled={rLoading}
                                className="button bg-theme-1 text-white mt-4"
                            >
                                {t("submit.text")}
                            </button>
                        )}
                        {showCode && (
                            <button type="submit" disabled={loading} className="button bg-theme-1 text-white mt-4">
                                {t("submit.text")}
                            </button>
                        )}
                    </p>
                </div>
            </form>
        </>
    );
};

export default UpdateEmail;
