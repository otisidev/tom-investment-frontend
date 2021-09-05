import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppName, CleanDate, CleanMessage, getNextPayment, getTotalAmount, toCurrency } from "../../../context/App";
import { Helmet } from "react-helmet";
import { AlertCircle, Calendar, CheckCircle, GitCommit, Plus } from "@styled-icons/feather";
import { Investment } from "../../../model/investment.model";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { COMPOUND_INVESTMENT, GET_INVESTMENT, NEW_TOP_UP, REINVESTMENT } from "../../../queries/investment.query";
import { LoadingIcon } from "../../../components/Button";
import { NavLink } from "react-router-dom";
import { ContactPersonModel } from "../../../model/contact-person.model";
import { GET_CONTACT_PERSONS } from "../../../queries/contact-person.query";
import { ArrowBack, ArrowForward, CloseCircle, Save } from "@styled-icons/ionicons-outline";
import PersonList from "./../AdminCorner/ContactPerson/PersonList";
import InvestmentTopUpList from "./partial/top-list";

type Props = {
    match: any;
    history: any;
};

const SingleInvestment = ({ match, history }: Props) => {
    const { t } = useTranslation();
    const [newItem, setNewItem] = useState<boolean>(false);
    const { id } = match.params;
    const [item, setItem] = useState<Investment>();
    const [persons, setPersons] = useState<Array<ContactPersonModel>>([]);
    const [cWeek, setCWeek] = useState(4);
    const [active, setActive] = useState<any>(undefined);
    const [amount, setAmount] = useState("");

    const { loading } = useQuery(GET_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        variables: { id },
        onCompleted: (d) => {
            setItem(d.GetInvestment.doc);
        }
    });

    const [getContactPersons, { loading: getting }] = useLazyQuery(GET_CONTACT_PERSONS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            setPersons(data.GetContactPersons.docs);
        }
    });

    const [ReinvestFunc, { loading: rLoading }] = useMutation(REINVESTMENT, {
        onCompleted: (data) => {
            if (data.Reinvestment) {
                document.location.reload();
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message))
    });

    const [compoundFunc, { loading: comLoading }] = useMutation(COMPOUND_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            document.location.reload(true);
        }
    });

    const [topUpFunc, { loading: upLoading }] = useMutation(NEW_TOP_UP, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            document.location.reload(true);
        }
    });

    return (
        <>
            <Helmet>
                <title>
                    {t("investment.detail")} | {AppName}
                </title>
            </Helmet>
            <div className="flex items-center mt-4">
                <div className="intro-y flex items-center mr-auto">
                    <span>
                        <ArrowBack
                            onClick={() => {
                                history.goBack();
                            }}
                            className="w-10 p-2 mr-3 cursor-pointer"
                        />
                    </span>
                    <h2 className="text-lg font-medium mr-auto">{t("investment.detail")}</h2>
                </div>
                {/* {item && !item.expired && (
                    <button
                        onClick={() => setNewItem(!newItem)}
                        className="button mr-2 mb-2 flex items-center border justify-center shadow-lg bg-yellow-200 text-theme-1"
                    >
                        {t("top.new")}
                        <Plus className="w-4 h-4 ml-2" />
                    </button>
                )} */}
            </div>

            <LoadingIcon loading={loading || rLoading || upLoading} />

            {item && (
                <div className="my-8 intro-y">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-2">
                            {newItem && (
                                <div className="intro-y">
                                    <div className="box p-6 my-6">
                                        <h3 className="font-semibold text-xl mb-2">New Investment Top-up</h3>
                                        <form
                                            onSubmit={async (event) => {
                                                event.preventDefault();
                                                await topUpFunc({ variables: { investment: id, amount: parseInt(amount) } });
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    defaultValue={amount}
                                                    required
                                                    className="appearance-none w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white mr-4 focus:border-2"
                                                    id="grid-amount"
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    onChange={({ currentTarget: { value } }) => setAmount(value)}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="button mr-3 flex items-center justify-center bg-theme-1 text-white"
                                                >
                                                    {t("submit.text")} <Save className="w-4 h-4 ml-2" />
                                                </button>
                                            </div>
                                        </form>
                                        {amount && (
                                            <p className="font-bold text-xs text-theme-1 -intro-x">
                                                Preview: {item.localCurrency || "£"}
                                                {toCurrency(amount)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            <InvestmentTopUpList investment={id} />
                        </div>
                        <div className="col-span-1">
                            <div className="box py-8">
                                {item.expired ? (
                                    <div className="rounded-md flex items-center px-5 py-4 mb-2 bg-theme-6 text-white">
                                        <CloseCircle className="w-6 h-6 mr-2" />
                                        Investment Expired
                                    </div>
                                ) : (
                                    <>
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
                                    </>
                                )}
                                <div className="text-center font-bold text-gray-600 mt-6">{item.plan.category.title}</div>
                                <div className="text-xl font-medium text-center">{item.plan.title}</div>
                                <div className="flex justify-center">
                                    <div className="relative text-5xl font-semibold mt-4 mx-auto">
                                        {toCurrency(item.investment_made)}{" "}
                                        <span className="absolute text-2xl top-0 right-0 text-gray-500 -mr-4 mt-1">
                                            {item.localCurrency || "£"}
                                        </span>
                                    </div>
                                </div>
                                {item.compounded?.status && (
                                    <div className="text-gray-800 text-center mt-5">
                                        <strong>
                                            {item.localCurrency || "£"}
                                            {toCurrency(item.compounded.payout)}
                                        </strong>{" "}
                                        {t("i.amount.text")} <span className="mx-1 text-theme-1">•</span>{" "}
                                        <strong className="text-theme-1">Compounding</strong>
                                    </div>
                                )}
                                {!item.compounded?.status && (
                                    <>
                                        <div className="text-gray-700 text-center mt-5">
                                            <span>{t("balance")}</span>
                                            <p className="font-semibold text-xl">
                                                {item.localCurrency || "£"}
                                                {toCurrency(item.balance)}{" "}
                                            </p>
                                        </div>
                                        <div className="text-gray-700 text-center mt-5">
                                            <span>Expected Amount</span>
                                            <p className="font-semibold text-xl">
                                                {item.localCurrency || "£"}
                                                {toCurrency(getTotalAmount(item))}
                                            </p>
                                        </div>
                                    </>
                                )}
                                {item.approved && (
                                    <>
                                        <div className="text-gray-800 px-10 text-center mx-auto mt-2">
                                            <b>{t("next.fund")}</b> <Calendar className="text-theme-1 h-4 mr-1" />{" "}
                                            <span>{CleanDate(getNextPayment(), true, true)}</span>
                                        </div>
                                        <div className="text-gray-800 px-10 text-center mx-auto mt-2">
                                            <b>Duration</b> <span className="text-teal-600">{item.duration} Months</span>
                                        </div>
                                        <div className="px-10 text-center mx-auto mt-2">
                                            <b>Start Date</b> <Calendar className="text-theme-1 h-4 mr-1" />{" "}
                                            <span>{CleanDate(item.date, true, true)}</span>
                                        </div>
                                        {item.expiration && (
                                            <div className="text-yellow-600 px-10 text-center mx-auto mt-2">
                                                <b>Expiration Date</b> <br />
                                                <span>{CleanDate(item.expiration, true, true)}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                                {item.approved && item.paid && (
                                    <div className="p-2 mt-2 flex justify-center">
                                        <a
                                            onClick={async () =>
                                                await getContactPersons({ variables: { category: item.plan.category.id } })
                                            }
                                            data-toggle="modal"
                                            href="javascript:;"
                                            data-target="#reinvestment-box"
                                            title="Contact persons"
                                            className="button p-3 rounded-lg mr-1 bg-theme-14 text-theme-10"
                                        >
                                            {t("investment.contact-person")}
                                        </a>

                                        <NavLink
                                            to={{ pathname: `/app/investment-history/${item.id}` }}
                                            title="Investment history"
                                            className="button p-3 rounded-lg mr-1 border border-purple-400 text-gray-700"
                                        >
                                            {t("reinvestment.history")}
                                        </NavLink>

                                        {item.balance > 0 && (
                                            <button
                                                className="button p-3 rounded-lg border-2"
                                                onClick={async () => {
                                                    setActive(item);
                                                    if (window.confirm("Are you are you want to proceed?")) {
                                                        await ReinvestFunc({ variables: { id: item.id } });
                                                    }
                                                }}
                                            >
                                                ReInvestment
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* REINVESTMENT */}
            <div className="modal" id="reinvestment-box">
                <div className="modal__content">
                    <div className="flex items-center px-5 py-5 sm:py-3 border-b border-gray-200">
                        <h2 className="font-medium text-base mr-auto">{t("investment.contact-person")}</h2>
                    </div>

                    <div className="col-span-12 sm:col-span-12">
                        <LoadingIcon loading={getting} />
                    </div>
                    <div className="p-5">
                        <PersonList items={persons} />
                    </div>
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
                                <h4>
                                    {active?.localCurrency || "£"}
                                    {toCurrency(active?.investment_made || 0)}
                                </h4>
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
                                                weekday: "short"
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
};
export default SingleInvestment;
