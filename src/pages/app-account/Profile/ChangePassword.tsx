import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { AppName } from "../../../context/App";
import { Lock } from "@styled-icons/feather";
import { LoadingIcon } from "../../../components/Button";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { authService } from "../../../services/Authentication.Service";
import { UPDATE_PASSWORD } from "../../../queries/user.query";

const UpdatePassword = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState({ password: "", confirm: "" });
    const [currentPassword, setCurrentPassword] = useState<string>("");

    const [updatePassFunc, { loading }] = useMutation(UPDATE_PASSWORD, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.UpdatePassword) {
                authService.Logout();
                toast.success(t("password.updated"));
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
                    {t("change_password")} | {AppName}
                </title>
            </Helmet>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    if (model.password === model.confirm)
                        await updatePassFunc({
                            variables: {
                                current: currentPassword,
                                new: model.password,
                            },
                        });
                    else toast.warn(t("password_mismatch"));
                }}
            >
                <div className="intro-y box lg:mt-5" style={{ minHeight: "66vh" }}>
                    <div className="flex items-center p-5 border-b border-gray-200">
                        <h2 className="font-medium text-base mr-auto">
                            <Lock className="w-4 h-4 mr-2 text-theme-1" />
                            {t("change_password")}
                        </h2>
                    </div>
                    <div className="p-5">
                        <LoadingIcon loading={loading} />
                        <div>
                            <label>{t("password.current")}</label>
                            <input
                                defaultValue={currentPassword}
                                onChange={({ currentTarget: { value } }) => setCurrentPassword(value)}
                                type="password"
                                className="input w-full border mt-2"
                                placeholder={t("password.current")}
                            />
                        </div>
                        <div className="mt-3">
                            <label>{t("password.new")}</label>
                            <input
                                defaultValue={model.password}
                                onChange={({ currentTarget: { value } }) => setModel({ ...model, password: value })}
                                type="password"
                                className="input w-full border mt-2"
                                placeholder={t("password.new")}
                            />
                        </div>
                        <div className="mt-3">
                            <label>{t("password.confirm.text")}</label>
                            <input
                                defaultValue={model.confirm}
                                onChange={({ currentTarget: { value } }) => setModel({ ...model, confirm: value })}
                                type="password"
                                className="input w-full border mt-2"
                                placeholder={t("password.confirm.text")}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="button bg-theme-1 text-white mt-4">
                            {t("change_password")}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default UpdatePassword;
