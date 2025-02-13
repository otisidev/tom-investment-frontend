import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "./../../../services/Authentication.Service";
import { Save, Edit3 } from "@styled-icons/feather";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { UPDATE_ACCOUNT, UPDATE_2FA } from "../../../queries/user.query";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import PrimaryButton, { ButtonType, LoadingIcon } from "./../../../components/Button/index";
import { Cash, Shield } from "@styled-icons/ionicons-outline";
import WalletNames from "../../../data/wallet-name.json";
import local from "../../../data/currency.json";
import { GET_CURRENCY, UPDATE_CURRENCY } from "../../../queries/user-currency.query";

const UpdateInformation = () => {
    const user = authService.GetUser();
    const { t } = useTranslation();
    const [model, setModel] = useState(user);
    const [localCurrency, setLocalCurrency] = useState("");

    const { loading: __loadC } = useQuery(GET_CURRENCY, {
        onCompleted: (data) => {
            setLocalCurrency(data.GetUserCurrency.doc.currency);
        },
        onError: (er) => toast.error(CleanMessage(er.message))
    });

    const [updateFunc, { loading }] = useMutation(UPDATE_ACCOUNT, {
        onCompleted: (data) => {
            if (data.UpdateAccount) {
                toast.success(data.UpdateAccount.message);
                const token = authService.GetToken();
                authService.Login(data.UpdateAccount.doc, token);
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message))
    });

    const [update2FAFunc, { loading: _loading }] = useMutation(UPDATE_2FA, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.Update2FA) {
                toast.success(data.Update2FA.message);
                const token = authService.GetToken();
                authService.Login(data.Update2FA.doc, token);
            }
        }
    });

    const [setCurrencyFunc, { loading: func_load }] = useMutation(UPDATE_CURRENCY, {
        onCompleted: (data) => {
            toast.success(data.SetUserCurrency.message);
            setLocalCurrency(data.SetUserCurrency.doc.currency);
        },
        onError: (er) => toast.error(CleanMessage(er.message))
    });
    return (
        <>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    await updateFunc({
                        variables: {
                            id: user.id,
                            update: {
                                firstname: model.firstname,
                                lastname: model.lastname,
                                address: model.address,
                                walletAddress: model.wallet_address,
                                phone: model.phone,
                                gender: model.gender,
                                walletName: model.walletName
                            }
                        }
                    });
                }}
            >
                <div className="intro-y box lg:mt-5" style={{ minHeight: "66vh" }}>
                    <div className="flex items-center p-5 border-b border-gray-200">
                        <h2 className="font-medium text-base mr-auto">
                            <Edit3 className="w-4 h-4 mr-2 text-theme-1" /> {t("account_setting")}
                        </h2>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12 xl:col-span-6">
                                <div>
                                    <label>{t("name.first.label")}</label>
                                    <input
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, firstname: value })}
                                        type="text"
                                        className="input w-full border mt-2"
                                        placeholder={t("name.first.label")}
                                        defaultValue={model.firstname}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label>{t("email.label")}</label>
                                    <input
                                        type="text"
                                        defaultValue={model.email}
                                        className="input w-full border bg-gray-100 cursor-not-allowed mt-2"
                                        placeholder={t("email.placeholder")}
                                        disabled={true}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label>{t("gender.label")}</label>
                                    <select
                                        defaultValue={model.gender}
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, gender: value })}
                                        className="input w-full border mt-2"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Others</option>
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label>{t("referral_code")}</label>
                                    <input
                                        type="text"
                                        className="input w-full border bg-gray-100 cursor-not-allowed mt-2"
                                        placeholder="Input text"
                                        defaultValue={model.referralCode}
                                    />
                                </div>
                            </div>
                            <div className="col-span-12 xl:col-span-6">
                                <div>
                                    <label>{t("name.last.label")}</label>
                                    <input
                                        type="text"
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, lastname: value })}
                                        defaultValue={model.lastname}
                                        className="input w-full border mt-2"
                                        placeholder={t("name.last.label")}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label>{t("phone.label")}</label>
                                    <input
                                        type="text"
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, phone: value })}
                                        defaultValue={model.phone}
                                        className="input w-full border mt-2"
                                        placeholder={t("phone.placeholder")}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label>Wallet</label>
                                    <select
                                        defaultValue={model.walletName}
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, walletName: value })}
                                        className="input w-full border mt-2"
                                    >
                                        <option value="">Select Wallet</option>
                                        {WalletNames.map((item, idx) => (
                                            <option key={idx} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label>{t("wallet.label")}</label>
                                    <input
                                        type="text"
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, wallet_address: value })}
                                        className="input w-full border mt-2"
                                        defaultValue={model.wallet_address}
                                        placeholder={t("wallet.placeholder")}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label>{t("address.label")}</label>
                                    <textarea
                                        defaultValue={model.address}
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, address: value })}
                                        className="input w-full border mt-2"
                                        placeholder={t("address.placeholder")}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                disabled={loading}
                                type="submit"
                                className="button  mr-2 mb-2 flex items-center justify-center bg-theme-1 text-white"
                            >
                                <Save className="w-4 h-4 mr-2" /> {t("save_changes")}
                            </button>
                        </div>
                        <LoadingIcon loading={loading || _loading} />
                    </div>
                </div>
            </form>
            <div className="intro-y box lg:mt-5">
                <div className="flex items-center p-5 border-b border-gray-200">
                    <h2 className="font-medium text-base mr-auto">
                        <Cash className="w-4 h-4 mr-2 text-theme-1" /> Set Default Currency
                    </h2>
                </div>
                <div className="w-full mb-4 p-6">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="grid-local">
                        Local Currency
                    </label>
                    <div className="relative">
                        <select
                            onChange={({ currentTarget: { value } }) => setLocalCurrency(value)}
                            required
                            value={localCurrency}
                            className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-local"
                        >
                            <option value="">Local Currency</option>
                            {local.map((item: string, idx: number) => (
                                <option key={idx} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <PrimaryButton
                            onClick={async () => {
                                if (localCurrency) {
                                    await setCurrencyFunc({ variables: { currency: localCurrency } });
                                } else toast.info("Please select currency!");
                            }}
                            className="rounded-lg bg-teal-600 text-teal-100 shadow p-4"
                            type={ButtonType.button}
                            loading={__loadC || func_load}
                        >
                            Update Currency
                        </PrimaryButton>
                    </div>
                </div>
            </div>
            <div className="intro-y box ">
                <div className="flex items-center p-5 border-b border-gray-200">
                    <h2 className="font-medium text-base mr-auto">
                        <Shield className="w-4 h-4 mr-2 text-theme-1" /> {t("2fa")}
                    </h2>
                </div>
                <div className="flex items-center w-full mb-24 p-6">
                    <label htmlFor="toggleA" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input
                                onChange={async ({ currentTarget: { checked } }) => {
                                    await update2FAFunc({ variables: { status: checked } });
                                }}
                                id="toggleA"
                                type="checkbox"
                                className="hidden"
                            />
                            <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                            <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
                        </div>

                        <div className="ml-3 text-gray-700 font-medium">
                            {user.useTwoF ? <span>{t("2fa-off")}</span> : <span>{t("2fa-on")}</span>}
                        </div>
                    </label>
                </div>
            </div>
        </>
    );
};

export default UpdateInformation;
