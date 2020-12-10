import React, { FC, useState } from "react";
import { Info, Calendar, AlertCircle, CheckCircle } from "@styled-icons/feather";
import { useTranslation } from "react-i18next";
import { Investment } from "../../../model/investment.model";
import { toCurrency, CleanDate, CleanMessage, CopyToClipboard } from "./../../../context/App";
import { Wallet, Trash, ArrowForward, GitCommit, CloseCircle } from "@styled-icons/ionicons-outline";
import { useMutation } from "@apollo/react-hooks";
import { MAKE_PAYMENT, CLOSE_INVESTMENT, REINVESTMENT, COMPOUND_INVESTMENT } from "../../../queries/investment.query";
import { toast } from "react-toastify";
import { LoadingIcon } from "../../../components/Button";
import { NavLink } from "react-router-dom";
import app from "../../../data/app.json";

interface iProp {
    items: Array<Investment>;
}

const Investments: FC<iProp> = ({ items }) => {
    const { t } = useTranslation();
    const [active, setActive] = useState<any>(undefined);
    const [wallet, setWallet] = useState("");
    const [week, setWeek] = useState(1);
    const [cWeek, setCWeek] = useState(4);
    const [showAddress, setShowAddress] = useState(false);
    const [loading, setLoading] = useState(false);

    const [MakePaymentFunc, { loading: mLoading }] = useMutation(MAKE_PAYMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.PaidForInvestment) {
                document.location.reload(true);
            }
        },
    });

    const [closeFunc, { loading: closeLoading }] = useMutation(CLOSE_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            document.location.reload(true);
        },
    });

    const [ReinvestFunc, { loading: rLoading }] = useMutation(REINVESTMENT, {
        onCompleted: (data) => {
            if (data.Reinvestment) {
                document.location.reload(true);
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message)),
    });
    const [compoundFunc, { loading: comLoading }] = useMutation(COMPOUND_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            document.location.reload(true);
        },
    });

    if (items.length)
        return (
            <>
                <div className="grid grid-cols-12 gap-6 mt-5">
                    {items.map((item, idx) => (
                        <div key={idx} className="intro-y box col-span-12 py-8 md:col-span-3">
                            {!item.paid && !item.approved && !item.closed && (
                                <div className="rounded-md flex items-center px-5 py-4 mb-2 bg-theme-14 text-theme-10">
                                    <AlertCircle className="w-6 h-6 mr-2" />
                                    {t("payment.not-done")}
                                </div>
                            )}
                            {item.paid && item.approved && !item.closed && (
                                <div className="rounded-md flex items-center px-5 py-4 mb-2 bg-theme-9 text-white">
                                    <CheckCircle className="w-6 h-6 mr-2" />
                                    {t("approval.done")}
                                </div>
                            )}
                            {item.paid && !item.approved && !item.closed && item.declined && (
                                <div className="rounded-md flex items-center px-5 py-4 mb-2 bg-theme-6 text-white">
                                    <CloseCircle className="w-6 h-6 mr-2" />
                                    Investment Declined
                                </div>
                            )}
                            {item.paid && !item.approved && !item.closed && !item.declined && (
                                <div className="rounded-md flex items-center px-5 py-4 mb-2 bg-theme-1 text-white">
                                    <GitCommit className="w-6 h-6 mr-2" />
                                    {t("approval.status")}
                                </div>
                            )}
                            <div className="text-xl font-medium text-center mt-10">{item.plan.title}</div>
                            {item.compounded?.status && (
                                <div className="text-gray-800 text-center mt-5">
                                    <strong> ${toCurrency(item.compounded.payout)}</strong> {t("i.amount.text")} <span className="mx-1 text-theme-1">•</span>{" "}
                                    <strong className="text-theme-1">Compounding</strong>
                                </div>
                            )}
                            {!item.compounded?.status && (
                                <div className="text-gray-700 text-center mt-5">
                                    ${toCurrency(item.payout_weekly)} {t("weekly.pay")} <span className="mx-1 text-theme-1">•</span> ${toCurrency(item.payout_sum)}
                                </div>
                            )}
                            {item.approved && (
                                <div className="text-gray-800 px-10 text-center mx-auto mt-2">
                                    <b>{t("next.fund")}</b> <Calendar className="text-theme-1 h-4 mr-1" /> <span>{CleanDate(item.next_fund_date, true, true)}</span>
                                </div>
                            )}
                            <div className="flex justify-center">
                                <div className="relative text-5xl font-semibold mt-8 mx-auto">
                                    {toCurrency(item.investment_made)} <span className="absolute text-2xl top-0 right-0 text-gray-500 -mr-4 mt-1">$</span>
                                </div>
                            </div>
                            {item.approved && item.paid && (
                                <div className="p-5 flex justify-center">
                                    {!item.compounded?.status && (
                                        <a
                                            onClick={() => setActive(item)}
                                            data-toggle="modal"
                                            href="javascript:;"
                                            data-target="#reinvestment-box"
                                            title="Reinvest"
                                            className="button w-24 rounded-full mr-1 mb-2 bg-theme-14 text-theme-10"
                                        >
                                            {t("reinvestment")}
                                        </a>
                                    )}
                                    <NavLink to={{ pathname: `/app/investment-history/${item.id}` }} title="Investment history" className="button w-24 rounded-full mr-1 mb-2 border text-gray-700">
                                        {t("reinvestment.history")}
                                    </NavLink>
                                    {!item.compounded?.status && (
                                        <a
                                            onClick={() => setActive(item)}
                                            data-toggle="modal"
                                            href="javascript:;"
                                            data-target="#compound-box"
                                            title="compound"
                                            className="button w-24 rounded-full mr-1 mb-2 bg-theme-18 text-theme-9"
                                        >
                                            {t("i.compound.text")}
                                        </a>
                                    )}
                                </div>
                            )}
                            {!item.paid && !item.approved && (
                                <div className="p-5 flex justify-center">
                                    <a
                                        onClick={() => setActive(item)}
                                        data-toggle="modal"
                                        href="javascript:;"
                                        data-target="#payment-box"
                                        title="Pay"
                                        className="button  mr-2 mb-2 flex items-center justify-center bg-theme-1 text-white"
                                    >
                                        {t("pay.text")} <Wallet className="w-4 h-4 ml-2" />
                                    </a>
                                    <a
                                        href="javascript:;"
                                        onClick={() => setActive(item)}
                                        data-toggle="modal"
                                        data-target="#delete-modal"
                                        title="close"
                                        className="button  mr-2 mb-2 flex items-center justify-center bg-theme-6 text-white"
                                    >
                                        {t("dialog.close")} <Trash className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* INVESTMENT PAYMENT */}
                <div className="modal" id="payment-box">
                    <div className="modal__content">
                        <div className="flex items-center px-5 py-5 sm:py-3 border-b border-gray-200">
                            <h2 className="font-medium text-base mr-auto">{t("investment.payment")}</h2>
                        </div>
                        <div className="p-5 grid grid-cols-12 gap-4 row-gap-3">
                            <div className="col-span-12 sm:col-span-12">
                                <LoadingIcon loading={mLoading} />
                                <p>{t("investment.instruction")}</p>
                            </div>
                            <div className="col-span-12 sm:col-span-12">
                                <b>{t("investment.made")}</b>
                                <h6>${toCurrency(active?.investment_made || 0)}</h6>
                            </div>
                            <div className="col-span-12 sm:col-span-12">
                                <b>{t("plan.title")}</b>
                                <h6>{active?.plan.title}</h6>
                            </div>
                            {showAddress && (
                                <>
                                    <div className="col-span-12 sm:col-span-12">
                                        <b>Receiver Wallet Address</b>
                                        <div className="flex" id="parent-copy">
                                            <input
                                                value={app.wallet}
                                                className="rounded-l-lg p-4 w-full border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-gray-200"
                                                disabled
                                                placeholder="click to copy"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => CopyToClipboard("parent-copy", app.wallet)}
                                                className="px-8 rounded-r-lg bg-green-500  text-white font-bold p-4 uppercase border-green-500 border-t border-b border-r"
                                            >
                                                copy
                                            </button>
                                        </div>
                                    </div>
                                    <hr className="bg-theme-1 mt-3" />
                                    <div className="col-span-12 sm:col-span-12">
                                        <label>Payment wallet Address</label>
                                        <input
                                            defaultValue={wallet}
                                            onChange={({ currentTarget: { value } }) => setWallet(value)}
                                            type="text"
                                            className="input w-full border mt-2 flex-1"
                                            required
                                            placeholder="Enter the wallet address of the sender"
                                        />
                                    </div>
                                </>
                            )}
                            {!showAddress && (
                                <>
                                    <div className="col-span-12 sm:col-span-12">
                                        <LoadingIcon loading={loading} />
                                    </div>
                                    <div className="col-span-12 sm:col-span-12">
                                        <button
                                            onClick={() => {
                                                setLoading(true);
                                                setTimeout(() => {
                                                    setLoading(false);
                                                    setShowAddress(true);
                                                }, 1500);
                                            }}
                                            type="button"
                                            className="button w-full bg-theme-1 text-white"
                                        >
                                            Get Payment Wallet Address
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {showAddress && (
                            <div className="px-5 py-3 text-right border-t border-gray-200">
                                <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 mr-1">
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        if (wallet) {
                                            await MakePaymentFunc({
                                                variables: { id: active?.id, wallet },
                                            });
                                        } else {
                                            toast.info("Enter the wallet address used for the transaction.");
                                        }
                                    }}
                                    type="button"
                                    className="button w-35 bg-theme-1 text-white"
                                >
                                    {t("pay.done")} <ArrowForward className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* CLOSE INVESTMENT */}
                <div className="modal" id="delete-modal">
                    <div className="modal__content">
                        <div className="p-5 text-center">
                            <CloseCircle className="w-16 h-16 text-theme-6 mx-auto mt-3" />
                            <div className="text-3xl mt-5">{t("reinvestment.confirm")}</div>
                            <div className="text-gray-600 mt-2">{t("confirm.text")}</div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            <LoadingIcon loading={closeLoading} />
                            <button type="button" data-dismiss="modal" className="button w-24 border text-gray-700 mr-1">
                                {t("btn.cancel")}
                            </button>
                            <button type="button" onClick={async () => await closeFunc({ variables: { id: active?.id } })} className="button w-24 bg-theme-6 text-white">
                                {t("pay.done")}
                            </button>
                        </div>
                    </div>
                </div>
                {/* REINVESTMENT */}
                <div className="modal" id="reinvestment-box">
                    <div className="modal__content">
                        <div className="flex items-center px-5 py-5 sm:py-3 border-b border-gray-200">
                            <h2 className="font-medium text-base mr-auto">{t("reinvestment.title")}</h2>
                        </div>
                        <form
                            onSubmit={async (ev) => {
                                ev.preventDefault();
                                if (window.confirm(t("reinvestment.confirm"))) {
                                    if (active)
                                        await ReinvestFunc({
                                            variables: {
                                                id: active.id,
                                                payout: week * active.payout_sum,
                                                weeks: week,
                                            },
                                        });
                                }
                            }}
                        >
                            <div className="p-5 grid grid-cols-12 gap-4 row-gap-3">
                                <div className="col-span-12 sm:col-span-6">
                                    <b>{t("investment.made")}</b>
                                    <h4>${toCurrency(active?.investment_made || 0)}</h4>
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <b>{t("plan.title")}</b>
                                    <h4>{active?.plan.title}</h4>
                                </div>
                            </div>
                            <div className="p-5 grid grid-cols-12 gap-4 row-gap-3">
                                {week > 0 && (
                                    <>
                                        <div className="col-span-12 sm:col-span-6">
                                            <b>{t("reinvestment.expected")}</b>
                                            <h4>{toCurrency(week * active?.payout_sum)}</h4>
                                        </div>
                                        <div className="col-span-12 sm:col-span-6">
                                            <b>{t("reinvestment.month")}</b>
                                            <h4>
                                                {Intl.DateTimeFormat("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                    day: "numeric",
                                                    weekday: "short",
                                                }).format(new Date(active?.next_fund_date || new Date()).setHours(week * 7 * 24))}
                                            </h4>
                                        </div>
                                    </>
                                )}
                                <hr className="bg-theme-1" />
                                <div className="col-span-12 sm:col-span-12">
                                    <label>{t("wallet.label")}</label>
                                    <input
                                        onChange={({ currentTarget: { value, validity } }) => validity.valid && setWeek(parseInt(value))}
                                        type="number"
                                        min={active?.plan.weekly_payout_interval}
                                        step={active?.plan.weekly_payout_interval}
                                        name={active?.id}
                                        className="input w-full border mt-2 flex-1"
                                        required
                                        defaultValue={week}
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-12">
                                    <LoadingIcon loading={rLoading} />
                                </div>
                            </div>

                            <div className="px-5 py-3 text-right border-t border-gray-200">
                                <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 mr-1">
                                    Cancel
                                </button>
                                <button type="submit" className="button w-35 bg-theme-1 text-white">
                                    {t("submit.text")} <ArrowForward className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* COMPOUNDING */}

                <div className="modal" id="compound-box">
                    <div className="modal__content">
                        <div className="flex items-center px-5 py-5 sm:py-3 border-b border-gray-200">
                            <h2 className="font-medium text-base mr-auto">{t("i.compound.title")}</h2>
                        </div>
                        <form
                            onSubmit={async (ev) => {
                                ev.preventDefault();
                                if (window.confirm(t("reinvestment.confirm"))) {
                                    const payout = cWeek * active?.payout_sum + (cWeek * active?.payout_sum + active.investment_made) * 0.03;
                                    const date = new Date(active?.next_fund_date || new Date()).setHours(cWeek * 7 * 24);
                                    await compoundFunc({ variables: { id: active.id, payout: payout + "", nextDate: new Date(date) } });
                                }
                            }}
                        >
                            <div className="p-5 grid grid-cols-12 gap-4 row-gap-3">
                                <div className="col-span-12 sm:col-span-12">
                                    <b>{t("investment.made")}</b>
                                    <h4>${toCurrency(active?.investment_made || 0)}</h4>
                                </div>
                            </div>
                            <div className="p-5 grid grid-cols-12 gap-4 row-gap-3">
                                {cWeek > 0 && (
                                    <>
                                        <div className="col-span-12 sm:col-span-6">
                                            <b>{t("reinvestment.expected")}</b>
                                            <h4>{toCurrency(cWeek * active?.payout_sum)}</h4>
                                        </div>
                                        <div className="col-span-12 sm:col-span-6">
                                            <b>{t("reinvestment.month")}</b>
                                            <h4>
                                                {Intl.DateTimeFormat("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                    day: "numeric",
                                                    weekday: "short",
                                                }).format(new Date(active?.next_fund_date || new Date()).setHours(cWeek * 7 * 24))}
                                            </h4>
                                        </div>
                                    </>
                                )}
                                <hr className="bg-theme-1" />
                                <div className="col-span-12 sm:col-span-12">
                                    <label htmlFor={active?.id}>{t("i.compound.week")}</label>
                                    <input
                                        onChange={({ currentTarget: { value, validity } }) => validity.valid && setCWeek(parseInt(value))}
                                        type="number"
                                        min={4}
                                        step={1}
                                        name={active?.id}
                                        className="input w-full border mt-2 flex-1"
                                        required
                                        defaultValue={cWeek}
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-12">
                                    <LoadingIcon loading={comLoading} />
                                </div>
                            </div>

                            <div className="px-5 py-3 text-right border-t border-gray-200">
                                <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 mr-1">
                                    Cancel
                                </button>
                                <button type="submit" className="button w-35 bg-theme-1 text-white">
                                    {t("submit.text")} <ArrowForward className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );

    return (
        <div className="flex flex-col items-center" style={{ minHeight: "60vh" }}>
            <Info className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 mx-auto mt-5">{t("no.investment")}</p>
        </div>
    );
};

export default Investments;
