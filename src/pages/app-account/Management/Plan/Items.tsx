import React, { FC, useState } from "react";
import { InformationCircle, CloseCircle, ArrowForward } from "@styled-icons/ionicons-outline";
import { toCurrency, CleanMessage } from "./../../../../context/App";
import { CheckCircle, Edit3, Trash } from "@styled-icons/feather";
import { LoadingIcon } from "../../../../components/Button";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { UPDATE_PLAN, DELETE_PLAN } from "../../../../queries/plan.query";

interface iProps {
    items: Array<any>;
}

const PlanItems: FC<iProps> = ({ items }) => {
    const [active, setActive] = useState<any>(undefined);

    // Update Plan function
    const [updateFunc, { loading: uploading }] = useMutation(UPDATE_PLAN, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            window.document.location.reload(true);
        },
    });

    // delete plan function
    const [deleteFunc, { loading: deleteLoading }] = useMutation(DELETE_PLAN, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            window.document.location.reload(true);
        },
    });

    if (items.length)
        return (
            <>
                <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                    <table className="table table-report -mt-2">
                        <thead className="uppercase font-bold">
                            <tr>
                                <th className="text-center whitespace-no-wrap">#</th>
                                <th className="whitespace-no-wrap">Title</th>
                                <th className="text-center whitespace-no-wrap">Amount</th>
                                <th className="text-center whitespace-no-wrap">Percent</th>
                                <th className="text-center whitespace-no-wrap">Can Reinvest</th>
                                <th className="text-center whitespace-no-wrap">actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr className="intro-x">
                                    <td className="text-center">
                                        <strong>{idx + 1}</strong>
                                    </td>
                                    <td>{item.title}</td>
                                    <td className="text-center font-bold">
                                        ${toCurrency(item.amount)} - ${toCurrency(item.max_amount)}
                                    </td>
                                    <td className="text-center font-bold">{item.percent}%</td>
                                    <td className="text-center">{item.can_reinvestment ? <CheckCircle className="h-8 text-theme-9" /> : <CloseCircle className="h-8 text-theme-6" />}</td>
                                    <td className="table-report__action w-56">
                                        <div className="flex justify-center items-center">
                                            <a
                                                href="javascript:;"
                                                onClick={() => setActive(item)}
                                                data-toggle="modal"
                                                data-target="#edit-box"
                                                className="flex items-center mr-3 text-theme-9 zoom-in shadow-md p-2"
                                            >
                                                <Edit3 className="w-4 h-4 mr-1" /> Edit
                                            </a>
                                            <a
                                                href="javascript:;"
                                                onClick={() => setActive(item)}
                                                data-toggle="modal"
                                                data-target="#delete-box"
                                                className="flex items-center mr-3 text-theme-6 zoom-in shadow-md p-2"
                                            >
                                                <Trash className="w-4 h-4 mr-1" /> Delete
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="modal" id="edit-box">
                    <div className="modal__content">
                        <div className="flex items-center px-5 py-5 sm:py-3 border-b border-gray-200">
                            <h2 className="font-medium text-base mr-auto">Update Plan</h2>
                        </div>
                        <form
                            onSubmit={async (ev) => {
                                ev.preventDefault();
                                if (!active.amount || !active.percent || !active.days_to_payout || !active.weekly_payout_interval) {
                                    toast.info("All fields are required & should not be equal or less than 0");
                                } else {
                                    await updateFunc({
                                        variables: {
                                            id: active.id,
                                            update: {
                                                amount: active.amount + "",
                                                percent: active.percent,
                                                daysToPayout: active.days_to_payout,
                                                title: active.title,
                                                weeklyPayoutInterval: active.weekly_payout_interval,
                                                canReinvestment: active.can_reinvestment,
                                                maxAmount: active.max_amount + "",
                                            },
                                        },
                                    });
                                }
                            }}
                        >
                            <div className="p-5 grid grid-cols-12 gap-4 row-gap-3">
                                <div className="col-span-12 sm:col-span-12">
                                    <div className="col-span-12 sm:col-span-12">
                                        <label htmlFor="title">Title</label>
                                        <input
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setActive({ ...active, title: value })}
                                            type="text"
                                            name="title"
                                            className="input w-full border mt-2 flex-1"
                                            required
                                            defaultValue={active?.title}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-6 mt-3">
                                        <label htmlFor="amount">Minimum Amount</label>
                                        <input
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setActive({ ...active, amount: parseInt(value) })}
                                            type="number"
                                            name="amount"
                                            className="input w-full border mt-2 flex-1"
                                            required
                                            id="amount"
                                            defaultValue={active?.amount}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-6 mt-3">
                                        <label htmlFor="amount">Maximum Amount</label>
                                        <input
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setActive({ ...active, max_amount: parseInt(value) })}
                                            type="number"
                                            name="amount"
                                            className="input w-full border mt-2 flex-1"
                                            required
                                            id="amount"
                                            defaultValue={active?.max_amount}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-6 mt-3">
                                        <label htmlFor="percent">Percentage %</label>
                                        <input
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setActive({ ...active, percent: parseInt(value) })}
                                            type="number"
                                            name="percent"
                                            className="input w-full border mt-2 flex-1"
                                            required
                                            id="percent"
                                            defaultValue={active?.percent}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-12 sm:col-span-12 mt-3">
                                    <label>Days to Payout</label>
                                    <input
                                        id="daysToPayout"
                                        name="daysToPayout"
                                        required
                                        defaultValue={active?.days_to_payout}
                                        onChange={({ currentTarget: { value } }) => setActive({ ...active, days_to_payout: parseInt(value) })}
                                        className="input w-full border mt-2"
                                        type="number"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-12 mt-3">
                                    <label>Weekly Payout Interval</label>
                                    <input
                                        id="weekly_payout_interval"
                                        name="weekly_payout_interval"
                                        required
                                        defaultValue={active?.weekly_payout_interval}
                                        onChange={({ currentTarget: { value } }) => setActive({ ...active, weekly_payout_interval: parseInt(value) })}
                                        className="input w-full border mt-2"
                                        type="number"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-12 mt-3">
                                    <div className="mr-3">Can Reinvest?</div>
                                    <input
                                        defaultChecked={active?.can_reinvestment}
                                        onChange={({ currentTarget: { checked } }) => setActive({ ...active, can_reinvestment: checked })}
                                        type="checkbox"
                                        className="input input--switch border"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-12 mt-3">
                                    <LoadingIcon loading={uploading} />
                                </div>
                            </div>

                            <div className="px-5 py-3 text-right border-t border-gray-200">
                                <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 mr-1">
                                    Cancel
                                </button>
                                <button type="submit" className="button w-35 bg-theme-1 text-white">
                                    Submit
                                    <ArrowForward className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="modal" id="delete-box">
                    <div className="modal__content">
                        <div className="p-5 text-center">
                            <CloseCircle className="w-16 h-16 text-theme-6 mx-auto mt-3" />
                            <div className="text-3xl mt-5">Delete Plan</div>
                            <div className="text-gray-600 mt-2">Are you sure you want to delete this plan?</div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            <LoadingIcon loading={deleteLoading} />
                            <button type="button" data-dismiss="modal" className="button w-24 border text-gray-700 mr-1">
                                Cancel
                            </button>
                            <button type="button" onClick={async () => await deleteFunc({ variables: { id: active?.id } })} className="button w-24 bg-theme-6 text-white">
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    return (
        <div className="flex flex-col items-center py-16" style={{ minHeight: "60vh", alignItems: "center" }}>
            <InformationCircle className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 mx-auto mt-5">No Plan is added yet!</p>
        </div>
    );
};
export default PlanItems;
