import { useLazyQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { LoadingIcon } from "../components/Button";
import { AppName, CleanDate, CleanMessage, GetValueFromURL, toCurrency } from "../context/App";
import { GET_INVESTMENT_STATUS } from "../queries/investment.query";

const InvestmentStatus = (props: any) => {
    const id = GetValueFromURL("id");
    const [items, setItems] = useState<Array<any>>([]);

    const [getInfoFunc, { loading }] = useLazyQuery(GET_INVESTMENT_STATUS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setItems(d.GetInvestmentInformation.docs);
        }
    });

    useEffect(() => {
        if (id) getInfoFunc({ variables: { email: id } });
    }, [id, getInfoFunc]);

    return (
        <>
            <Helmet>
                <title> Investment Status | {AppName}</title>
            </Helmet>

            <div className="container sm:px-10 h-screen">
                <div className="my-8 text-center">
                    <a href="/" className="-intro-x flex-col flex justify-center items-center pt-5">
                        <img alt="Investment bot" className="w-16" src="/dist/images/icon.png" />
                        <span className="text-theme-1">
                            Timo Stephan<span className="font-medium">Investment</span>
                        </span>
                    </a>
                    <h2 className="font-bold text-xl mt-6">Investment Status</h2>
                </div>
                <LoadingIcon loading={loading} />
                {!loading && items.length > 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 mt-6">
                        {items.map((item, idx) => (
                            <div className="w-full md:w-1/2 intro-y" key={idx}>
                                <div className="box grid grid-cols-2 gap-4 p-4">
                                    <div className="my-3 col-span-2">
                                        <h1 className="font-semibold text-lg">Investment Information</h1>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Amount Invested</p>
                                        <h2 className="font-medium text-3xl">€{toCurrency(item.investment_made)}</h2>
                                    </div>

                                    <div>
                                        <p>Current Balance</p>
                                        <h2 className="font-medium text-3xl">€{toCurrency(item.balance)}</h2>
                                    </div>
                                    <div className="col-span-2">
                                        <h2 className="font-medium text-base">Investment History</h2>
                                        <div className="w-4 h-1 bg-theme-9"></div>
                                        <table className="table table-report mt-4">
                                            <thead className="uppercase">
                                                <tr>
                                                    <th>Amount</th>
                                                    <th>Reason</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.logs.map((_log: any, _l_idx: number) => (
                                                    <tr key={_l_idx}>
                                                        <td>€{toCurrency(_log.amount)}</td>
                                                        <td>{_log.reason}</td>
                                                        <td>{CleanDate(_log.date)}</td>
                                                    </tr>
                                                ))}
                                                {item.logs.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3}>
                                                            <p className="my-4 text-center">No Record</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <hr className="col-span-2" />
                                    <div className="col-span-2">
                                        <h2 className="font-medium text-base">TopUp History</h2>
                                        <div className="w-4 h-1 bg-theme-9"></div>
                                        <table className="table table-report mt-4">
                                            <thead className="uppercase">
                                                <tr>
                                                    <th>Amount</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.topups.map((_top: any, _t_idx: number) => (
                                                    <tr key={_t_idx}>
                                                        <td>€{toCurrency(_top.amount)}</td>
                                                        <td>{CleanDate(_top.created_at)}</td>
                                                    </tr>
                                                ))}
                                                {item.logs.length === 0 && (
                                                    <tr>
                                                        <td colSpan={2}>
                                                            <p className="my-4 text-center">No Record</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default InvestmentStatus;
