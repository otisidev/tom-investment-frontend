import React, { useState } from "react";
import { toast } from "react-toastify";
import { Info } from "@styled-icons/feather";
import { CleanDate, CleanMessage, toCurrency } from "../../../../context/App";
import { GET_TOP_LIST } from "./../../../../queries/investment.query";
import { useQuery } from "@apollo/react-hooks";
import { LoadingIcon } from "../../../../components/Button";

type Props = {
    investment: string;
};

const InvestmentTopUpList = ({ investment }: Props) => {
    const [items, setItems] = useState<Array<any>>([]);

    const { loading } = useQuery(GET_TOP_LIST, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setItems(d.GetInvestmentTopUp.docs);
        },
        variables: { investment }
    });

    if (items.length && investment)
        return (
            <div>
                <LoadingIcon loading={loading} />
                <h2 className="block uppercase font-bold text-base">top-up history</h2>
                <div className="w-6 h-1 bg-theme-1"></div>
                <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
                    <table className="table table-report sm:mt-2">
                        <thead className="hidden md:table-header-group">
                            <tr className="uppercase">
                                <th className="text-center whitespace-nowrap">#</th>
                                <th className="whitespace-nowrap">Date</th>
                                <th className="whitespace-nowrap">Status</th>
                                <th className="whitespace-nowrap">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr className="intro-y" key={idx}>
                                    <td className="w-8">
                                        <span className="font-bold text-center whitespace-nowrap">{idx + 1}</span>
                                    </td>
                                    <td>
                                        <span className="hidden md:inline font-medium whitespace-nowrap">
                                            {CleanDate(item.created_at, true)}
                                        </span>
                                        <div className="md:hidden py-4 px-3">
                                            <div className="grid gap-4">
                                                <div>
                                                    <p className="text-gray-500">Top-up Date</p>
                                                    <p className="font-semibold text-base">{CleanDate(item.created_at, true)}</p>
                                                </div>
                                                <hr />
                                                <div>
                                                    <p className="text-gray-500">Amount</p>
                                                    <p className="font-semibold text-base">
                                                        {item.investment.localCurrency || "£"}
                                                        {toCurrency(item.amount)}
                                                    </p>
                                                </div>
                                                <hr />
                                                <div>
                                                    <p className="text-gray-500">Status</p>
                                                    <p className="font-semibold text-base">
                                                        {item.approved ? (
                                                            <span className="text-green-500">Confirmed</span>
                                                        ) : (
                                                            <span className="text-theme-1">Awaiting Confirmation</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="hidden md:table-cell">
                                        {item.approved ? (
                                            <span className="text-green-500">Confirmed</span>
                                        ) : (
                                            <span className="text-theme-1">Awaiting Confirmation</span>
                                        )}
                                    </td>

                                    <td className="hidden md:table-cell font-semibold text-base text-green-500">
                                        + {item.investment.localCurrency || "£"}
                                        {toCurrency(item.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    return (
        <div className="intro-x flex items-center flex-col justify-center w-full" style={{ minHeight: "40vh" }}>
            <Info className="w-16 h-16 mb-4 text-theme-1" />
            <h4 className="font-semibold text-gray-600 text-xl">No Record Found!</h4>
            <p className="text-gray-500">Click on Top-up investment button to create a new record.</p>
        </div>
    );
};

export default InvestmentTopUpList;
