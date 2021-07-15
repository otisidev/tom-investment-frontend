import React, { FC, useState } from "react";
import { Albums, CloseCircle } from "@styled-icons/ionicons-outline";
import { CleanDate } from "../../../../context/App";
import { NavLink } from "react-router-dom";
import { toCurrency } from "./../../../../context/App";

interface iProps {
    items: Array<any>;
    onClose: any;
    onCredit: any;
    onTopUp: any;
}

const ActiveInvestmentItems: FC<iProps> = ({ items, onClose, onCredit, onTopUp }) => {
    const [active, setActive] = useState<any>();
    const [model, setModel] = useState<any>();
    const [credit, setCredit] = useState<any>(true);

    if (items.length)
        return (
            <>
                <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                    <table className="table table-report -mt-2">
                        <thead className="uppercase font-bold">
                            <tr>
                                <th className="text-center whitespace-no-wrap">#</th>
                                <th className="whitespace-no-wrap">Investor</th>
                                <th className="text-left whitespace-no-wrap">Investment Date</th>
                                <th className="text-left whitespace-no-wrap">investment made</th>
                                <th className="text-left whitespace-no-wrap">Balance</th>
                                <th className="whitespace-no-wrap text-center">actions</th>
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
                                                <img
                                                    alt={item.user.firstname}
                                                    className="rounded-full"
                                                    src={item.user.image || "/dist/images/profile.jpg"}
                                                />
                                            </div>
                                            <div className="lg:ml-4 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                                <NavLink
                                                    to={{ pathname: `/app/user/${item.user.id}` }}
                                                    className="text-theme-1 font-medium"
                                                >
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
                                        <p> {item.plan.title}</p>
                                        <div className="font-medium text-theme-9">{CleanDate(item.created_at, true)}</div>
                                    </td>
                                    <td className="text-left">
                                        {item.compounded?.status ? (
                                            <>
                                                <span className="font-bold text-theme-1">Compounding</span>
                                                <h4 className="text-theme-9 text-lg">£{toCurrency(item.investment_made)}</h4>
                                                <b>Expected Payout: </b> £{toCurrency(item.compounded.payout || 0)} <br />
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="text-theme-9 text-lg">£{toCurrency(item.investment_made)}</h4>
                                                <b>Total Payout: </b> £{toCurrency(item.payout_sum)} <br />
                                                <b>Weekly Payout: </b> £{toCurrency(item.payout_weekly)}
                                            </>
                                        )}
                                    </td>
                                    <td className="text-left">
                                        <h4 className="text-theme-9 text-lg">£{toCurrency(item.balance)}</h4>
                                    </td>
                                    <td className="table-report__action">
                                        <div className="flex justify-center items-center">
                                            <a
                                                href="javascript:;"
                                                onClick={() => setActive(item)}
                                                data-toggle="modal"
                                                data-target="#credit-modal"
                                                className="button p-2 border bg-teal-500 text-white shadow mr-2"
                                            >
                                                Credit
                                            </a>
                                            <a
                                                href="javascript:;"
                                                onClick={() => setActive(item)}
                                                data-toggle="modal"
                                                data-target="#top-up-modal"
                                                className="button p-2 border shadow mr-2"
                                            >
                                                Top-up
                                            </a>
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
                <div className="modal" id="credit-modal">
                    <div className="modal__content">
                        <div className="p-5">
                            <div className="grid gap-4">
                                <div className="my-6">
                                    <div className="font-bold uppercase">{credit ? "Credit investment" : "Debit Investment"}</div>
                                    <div className="w-6 h-1 bg-theme-1"></div>
                                </div>
                                <div>
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-amount"
                                    >
                                        Amount
                                    </label>
                                    <input
                                        required
                                        className="appearance-none block hover:border-theme-1 border w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                        id="grid-amount"
                                        placeholder="Enter amount"
                                        type="number"
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, amount: value })}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-Reason"
                                    >
                                        Reason
                                    </label>
                                    <input
                                        required
                                        className="appearance-none block hover:border-theme-1 border w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                        id="grid-Reason"
                                        type="text"
                                        placeholder="Enter reason"
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, reason: value })}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-currency"
                                    >
                                        Currency
                                    </label>
                                    <select
                                        id="grid-currency"
                                        required
                                        onChange={({ currentTarget: { value } }) => {
                                            setModel({ ...model, currency: value });
                                        }}
                                        className="w-full login__input input rounded-lg input--lg border-2 border-gray-300 block hover:border-theme-1 resize-none font-semibold"
                                    >
                                        <option value="">Select Currency</option>
                                        {["$", "€", "£"].map((item, idx) => (
                                            <option key={idx} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center p-2 border rounded-lg">
                                    <label className="mr-auto font-medium" htmlFor="show">
                                        {credit ? "Credit investment" : "Debit Investment"}
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onChange={({ currentTarget: { checked } }) => {
                                                setCredit(checked);
                                            }}
                                            checked={credit}
                                            type="checkbox"
                                            id="show"
                                            className="input input--switch border"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            {/* <LoadingIcon loading={closeLoading} /> */}
                            <button
                                type="button"
                                id="cancel__credit"
                                data-dismiss="modal"
                                className="button w-24 border text-gray-700 mr-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (model && model.amount && model.reason) {
                                        onCredit({
                                            ...model,
                                            investment: active?.id,
                                            amount: parseInt(model.amount),
                                            currency: model.currency,
                                            credit
                                        });
                                        document.getElementById("cancel__credit")?.click();
                                    } else {
                                        window.alert("Amount and reason are required!");
                                    }
                                }}
                                className="button w-24 bg-theme-1 text-white"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
                <div className="modal" id="top-up-modal">
                    <div className="modal__content">
                        <div className="p-5">
                            <div className="grid gap-4">
                                <div className="my-6">
                                    <div className="font-bold uppercase">Investment Top-up</div>
                                    <div className="w-6 h-1 bg-theme-1"></div>
                                </div>
                                <div>
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="g-amount"
                                    >
                                        Amount
                                    </label>
                                    <input
                                        required
                                        className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                        id="g-amount"
                                        placeholder="Enter amount"
                                        type="number"
                                        onChange={({ currentTarget: { value } }) => setModel({ ...model, amount: value })}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="g-currency"
                                    >
                                        Currency
                                    </label>
                                    <select
                                        id="g-currency"
                                        required
                                        onChange={({ currentTarget: { value } }) => {
                                            setModel({ ...model, currency: value });
                                        }}
                                        className="w-full login__input input rounded-lg input--lg border-2 border-gray-300 block hover:border-theme-1 resize-none font-semibold"
                                    >
                                        <option value="">Select Currency</option>
                                        {["$", "€", "£"].map((item, idx) => (
                                            <option key={idx} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            {/* <LoadingIcon loading={closeLoading} /> */}
                            <button type="button" id="top_cancel" data-dismiss="modal" className="button w-24 border text-gray-700 mr-1">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (model && model.amount && model.currency) {
                                        onTopUp({ id: active.id, amount: parseInt(model.amount), currency: model.currency });
                                        document.getElementById("top_cancel")?.click();
                                    } else {
                                        window.alert("Amount and reason are required!");
                                    }
                                }}
                                className="button w-24 bg-theme-1 text-white"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );

    return (
        <div className="flex flex-col">
            <Albums className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 mx-auto mt-5">No Active Investment found!</p>
        </div>
    );
};

export default ActiveInvestmentItems;
