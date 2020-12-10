import React, { FC } from "react";
import { Albums, CloseCircle } from "@styled-icons/ionicons-outline";
import { CleanDate } from "../../../../context/App";
import { NavLink } from "react-router-dom";
import { toCurrency } from "./../../../../context/App";

interface iProps {
    items: Array<any>;
    onClose: any;
}

const ActiveInvestmentItems: FC<iProps> = ({ items, onClose }) => {
    if (items.length)
        return (
            <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                <table className="table table-report -mt-2">
                    <thead className="uppercase font-bold">
                        <tr>
                            <th className="text-center whitespace-no-wrap">#</th>
                            <th className="whitespace-no-wrap">Investor</th>
                            <th className="text-left whitespace-no-wrap">Investment Date</th>
                            <th className="text-left whitespace-no-wrap">Plan</th>
                            <th className="text-left whitespace-no-wrap">investment made</th>
                            <th className="whitespace-no-wrap"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr className="intro-x" key={idx}>
                                <td className="text-center">
                                    <strong>{idx + 1}</strong>
                                </td>

                                <td className="w-50">
                                    <div className="flex flex-col lg:flex-row items-center py-5">
                                        <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                            <img alt={item.user.firstname} className="rounded-full" src={item.user.image || "/dist/images/profile-5.jpg"} />
                                        </div>
                                        <div className="lg:ml-4 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                            <NavLink to={{ pathname: `/app/user/${item.user.id}` }} className="text-theme-1 font-medium">
                                                {item.user.firstname} {item.user.lastname}
                                            </NavLink>
                                            <div className="text-gray-600 text-xs">{item.user.email}</div>
                                            <div className="text-gray-600 text-xs">
                                                {item.user.gender} | <span className="text-theme-1">{item.user.nationality}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="text-left">
                                    <div className="font-medium text-theme-9">{CleanDate(item.created_at)}</div>
                                </td>
                                <td className="text-left">{item.plan.title}</td>
                                <td className="text-left">
                                    {item.compounded?.status ? (
                                        <>
                                            <span className="font-bold text-theme-1">Compounding</span>
                                            <h4 className="text-theme-9 text-lg">${toCurrency(item.investment_made)}</h4>
                                            <b>Expected Payout: </b> ${toCurrency(item.compounded.payout || 0)} <br />
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="text-theme-9 text-lg">${toCurrency(item.investment_made)}</h4>
                                            <b>Total Payout: </b> ${toCurrency(item.payout_sum)} <br />
                                            <b>Weekly Payout: </b> ${toCurrency(item.payout_weekly)}
                                        </>
                                    )}
                                </td>
                                <td className="table-report__action w-56">
                                    <div className="flex justify-center items-center">
                                        <a
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to close this investment?")) {
                                                    onClose(item);
                                                }
                                            }}
                                            className="flex items-center mr-3 text-theme-6"
                                            href="javascript:;"
                                        >
                                            <CloseCircle className="w-4 h-4 mr-1" />
                                            Close
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return (
        <div className="flex flex-col">
            <Albums className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 mx-auto mt-5">No Active Investment found!</p>
        </div>
    );
};

export default ActiveInvestmentItems;
