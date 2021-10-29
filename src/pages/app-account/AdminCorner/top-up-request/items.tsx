import React from "react";
import { Check, Info } from "@styled-icons/feather";
import { CleanDate, DefaultImageFromURL, toCurrency } from "../../../../context/App";

type Props = {
    items: Array<any>;
    onApprove: any;
    onCancel: any;
};

const PendingInvestmentList = ({ items, onCancel, onApprove }: Props) => {
    if (items.length)
        return (
            <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
                <table className="table table-report sm:mt-2">
                    <thead>
                        <tr className="uppercase">
                            <th className="text-center whitespace-nowrap">#</th>
                            <th className="whitespace-nowrap">investor</th>
                            <th className="whitespace-nowrap">Amount</th>
                            <th className="whitespace-nowrap">Current</th>
                            <th className="whitespace-nowrap text-right">Creation</th>
                            <th className="text-center whitespace-nowrap">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr className="zoom-in" key={idx}>
                                <td className="w-8">
                                    <span className="font-bold text-center whitespace-nowrap">{idx + 1}</span>
                                </td>
                                <td>
                                    <div className="w-full px-4 py-1 flex items-center gap-4">
                                        <div className="relative w-12 h-12">
                                            <img
                                                className="shadow border-2 rounded-full border-white w-12 h-12"
                                                src={item.investment.user.image || DefaultImageFromURL(item.investment.user.name)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-base font-semibold tracking-wide capitalize">{item.investment.user.name}</p>
                                            <p className="text-xs font-medium tracking-wider text-gray-500">{item.investment.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-base text-green-500 font-semibold">
                                        <span>+£</span> <span className="text-lg">{toCurrency(item.amount)}</span>
                                    </span>
                                </td>
                                <td>
                                    <span className="text-base text-theme-1 font-semibold">
                                        <span>£</span> <span className="text-lg">{toCurrency(item.investment.investment_made)}</span>
                                    </span>
                                </td>

                                <td className="text-right font-medium">
                                    <span className="font-semibold">{CleanDate(item.created_at || "", true)}</span>
                                </td>

                                <td className="table-report__action w-60">
                                    <div className="flex justify-around items-center my-4">
                                        <button
                                            onClick={() => onCancel(idx)}
                                            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => onApprove(idx)}
                                            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Approve
                                            <Check className="w-6 ml-2" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    return (
        <div className="intro-x flex items-center flex-col justify-center w-full" style={{ minHeight: "40vh" }}>
            <Info className="w-16 h-16 mb-4 text-theme-1" />
            <h4 className="font-semibold text-gray-600 text-xl">No Record Found!</h4>
            <p className="text-gray-500">No pending investment found!</p>
        </div>
    );
};

export default PendingInvestmentList;
