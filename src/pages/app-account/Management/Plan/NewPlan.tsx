import React, { useState } from "react";
import { Save } from "@styled-icons/ionicons-outline";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { LoadingIcon } from "../../../../components/Button";
import { CREATE_PLAN } from "../../../../queries/plan.query";

const NewPlan = () => {
    const [amount, setAmount] = useState<number>(0);
    const [maxAmount, setMaxAmount] = useState<string>("0");
    const [canReinvestment, setCan_reinvestment] = useState<boolean>(true);
    const [percent, setPercent] = useState<number>(0);
    const [daysToPayout, setDays_to_payout] = useState<number>(0);
    const [weeklyPayoutInterval, setWeekly_payout_interval] = useState<number>(0);
    const [title, setTitle] = useState<string>("");

    const [createFunc, { loading }] = useMutation(CREATE_PLAN, {
        onCompleted: (data) => {
            if (data.NewPlan) {
                window.document.location.reload(true);
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message)),
    });

    return (
        <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="intro-y col-span-12 flex flex-col flex-1 sm:px-10 lg:px-5 pb-10 lg:pb-0">
                <div className="intro-y flex-1 box p-16 lg:ml-5 mb-5 lg:mb-0">
                    <h4 className="text-2xl font-medium">New Plan</h4>
                    <div className="p-5">
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                if (!amount || !percent || !daysToPayout || !weeklyPayoutInterval) {
                                    toast.info("All fields are required & should not be equal or less than 0");
                                } else {
                                    await createFunc({
                                        variables: {
                                            model: {
                                                amount: amount + "",
                                                canReinvestment,
                                                percent,
                                                daysToPayout,
                                                title,
                                                weeklyPayoutInterval,
                                                maxAmount,
                                            },
                                        },
                                    });
                                }
                            }}
                        >
                            <div className="grid grid-cols-12 gap-5">
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label htmlFor="title">Title</label>
                                        <input
                                            onChange={({ currentTarget: { value } }) => setTitle(value)}
                                            type="text"
                                            id="title"
                                            required
                                            className="input w-full border mt-2"
                                            placeholder="Enter title"
                                            defaultValue={title}
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <label>Minimum Amount</label>
                                        <input
                                            type="number"
                                            required
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setAmount(parseInt(value))}
                                            defaultValue={amount}
                                            className="input w-full border mt-2"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <label>Maximum Amount</label>
                                        <input
                                            type="number"
                                            required
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setMaxAmount(value)}
                                            defaultValue={maxAmount}
                                            className="input w-full border mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div >
                                        <label>Percentage %</label>
                                        <input
                                            type="number"
                                            required
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setPercent(parseInt(value))}
                                            defaultValue={percent}
                                            className="input w-full border mt-2"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <label>Days to Payout</label>
                                        <input
                                            id="daysToPayout"
                                            name="daysToPayout"
                                            required
                                            defaultValue={daysToPayout}
                                            onChange={({ target }) => setDays_to_payout(parseInt(target.value))}
                                            className="input w-full border mt-2"
                                            type="number"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <label>Weekly Payout Interval</label>
                                        <input
                                            id="weekly_payout_interval"
                                            name="weekly_payout_interval"
                                            required
                                            defaultValue={weeklyPayoutInterval}
                                            onChange={({ target }) => setWeekly_payout_interval(parseInt(target.value))}
                                            className="input w-full border mt-2"
                                            type="number"
                                        />
                                    </div>

                                    <div className="mt-3">
                                        <div className="mr-3">Can Reinvest?</div>
                                        <input
                                            defaultChecked={canReinvestment}
                                            onChange={({ currentTarget: { checked } }) => setCan_reinvestment(checked)}
                                            type="checkbox"
                                            className="input input--switch border"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button disabled={false} type="submit" className="button  mr-2 mb-2 flex items-center justify-center bg-theme-1 text-white">
                                    <Save className="w-4 h-4 mr-2" />
                                    Submit
                                </button>
                            </div>
                        </form>
                        <LoadingIcon loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default NewPlan;
