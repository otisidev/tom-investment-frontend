import React, { useState, FC } from "react";
import { Helmet } from "react-helmet";
import { AppName, CleanDate, CleanMessage } from "../../../context/App";
import { useTranslation } from "react-i18next";
import { toCurrency } from "./../../../context/App";
import { useQuery } from "@apollo/react-hooks";
import { GET_HISTORY } from "../../../queries/investment.query";
import { LoadingIcon } from "../../../components/Button";
import { toast } from "react-toastify";
import { Info } from "@styled-icons/feather";

interface iProp {
    match: any;
}

const InvestmentHistory: FC<iProp> = ({ match }) => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const { id } = match.params;

    const { loading, data } = useQuery(GET_HISTORY, {
        variables: { id, page, limit },
        onError: (er) => toast.error(CleanMessage(er.message)),
    });

    return (
        <>
            <Helmet>
                <title>
                    {t("investment.history")} | {AppName}
                </title>
            </Helmet>

            <h2 className="intro-y text-lg font-medium mt-10">{t("investment.history")}</h2>
            <LoadingIcon loading={loading} />
            <div className="grid grid-cols-12 gap-6 mt-5">
                {data && !loading && (
                    <>
                        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                            <table className="table table-report -mt-2">
                                <thead>
                                    <tr>
                                        <th className="whitespace-no-wrap uppercase">#</th>
                                        <th className="whitespace-no-wrap uppercase">{t("user.account.amount")}</th>
                                        <th className="whitespace-no-wrap uppercase">{t("history.reason")}</th>
                                        <th className="whitespace-no-wrap uppercase">{t("history.date")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.GetInvestmentHistory.docs.map((item: any, idx: number) => (
                                        <tr key={idx} className="intro-x">
                                            <td className="w-10">
                                                <strong>{idx + 1}</strong>
                                            </td>
                                            <td className="w-20">{toCurrency(item.amount)}</td>
                                            <td className="w-50">{item.reason}</td>
                                            <td className="w-40">{CleanDate(item.date, true, false)}</td>
                                        </tr>
                                    ))}
                                    {data.GetInvestmentHistory.docs.length === 0 && (
                                        <tr className="intro-x">
                                            <td colSpan={4} className="text-center">
                                                <div className="py-16">
                                                    <Info size={64} className="mt-5 text-theme-1" />
                                                    <h3 className="text-theme-15 text-lg ">{t("history.not-found")}</h3>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default InvestmentHistory;
