import React, { FC } from "react";
import { Info } from "@styled-icons/feather";
import { toCurrency, CleanDate } from "./../../../../context/App";
import { Card } from "@styled-icons/ionicons-outline";

interface iProp {
    items: Array<any>;
    onPay: any;
}
const PayoutList: FC<iProp> = ({ items, onPay }) => {
    if (items.length)
        return (
            <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                <table className="table table-report -mt-2">
                    <thead className="uppercase font-bold">
                        <tr>
                            <th className="text-center whitespace-no-wrap">#</th>
                            <th className="whitespace-no-wrap">Investor</th>
                            <th className="text-center whitespace-no-wrap">investment made</th>
                            <th className="text-left whitespace-no-wrap">Plan</th>
                            <th className="text-left whitespace-no-wrap">Last Payment</th>
                            <th className="whitespace-no-wrap">Payout</th>
                            <th className="whitespace-no-wrap"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr className="intro-x" key={idx}>
                                <td className="text-center">
                                    <strong>{idx + 1}</strong>
                                </td>

                                <td className="w-40">
                                    <div className="flex flex-col lg:flex-row items-center py-5">
                                        <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                            <img alt={item.user.firstname} className="rounded-full" src={item.user.image || "/dist/images/profile-5.jpg"} />
                                        </div>
                                        <div className="lg:ml-4 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                            <div className="font-medium">
                                                {item.user.firstname} {item.user.lastname}
                                            </div>
                                            <div className="text-gray-600 text-xs">{item.user.email}</div>
                                            <div className="text-gray-600 text-xs">
                                                {item.user.gender} | {item.user.nationality}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="font-medium">${toCurrency(item.investment_made)}</div>
                                </td>
                                <td className="text-left">{item.plan.title}</td>
                                <td className="text-left">
                                    <div className="">
                                        {item.last_fund_date ? (
                                            <span className="font-medium text-theme-9">{CleanDate(item.last_fund_date)}</span>
                                        ) : (
                                            <span className="font-medium text-theme-1">First Payout</span>
                                        )}
                                    </div>
                                </td>
                                <td className="text-left">
                                    {item.compounded?.status ? (
                                        <>
                                            <p>
                                                <b className="text-theme-9">Due Payout:</b>
                                                <span className="text-theme-9">${toCurrency(item.compounded.payout)}</span>
                                            </p>
                                            <p>
                                                Payout Date:{" "}
                                                {Intl.DateTimeFormat("en-US", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }).format(new Date(item.compounded.payoutDate || new Date()))}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                <b className="text-theme-9">Due Payout:</b> <span className="text-theme-9">${toCurrency(item.payout_sum)}</span>
                                            </p>
                                            <p>
                                                <b>Weekly Payout: </b>${toCurrency(item.payout_weekly)}
                                            </p>
                                        </>
                                    )}
                                </td>
                                <td className="w-16">
                                    <button onClick={() => onPay(item)} className="button flex items-center justify-center bg-theme-9 text-white">
                                        <Card className="w-4 h-4 mr-2" /> Pay
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return (
        <div className="flex flex-col">
            <Info className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 mx-auto mt-5">No Investment is due for payout!</p>
        </div>
    );
};

export default PayoutList;
