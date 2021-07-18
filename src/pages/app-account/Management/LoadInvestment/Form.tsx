import React, { useState, FC } from "react";
import { toast } from "react-toastify";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { CleanMessage } from "../../../../context/App";
import { GET_PLANS } from "../../../../queries/plan.query";
import { useTranslation } from "react-i18next";
import { Save } from "@styled-icons/ionicons-outline";
import { LoadingIcon } from "../../../../components/Button";
import { GET_CATEGORIES } from "../../../../queries/category.query";
import { Category } from "../../../../model/category.model";
import { toCurrency } from "./../../../../context/App";

interface iProp {
    onSubmit: any;
}

const InvestmentForm: FC<iProp> = ({ onSubmit }) => {
    const [plan, setPlan] = useState<any>(undefined);
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState<string>();
    const [paid, setPaid] = useState<boolean>(true);
    const [approve, setApprove] = useState<boolean>(true);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [nextFund, setNextFund] = useState<string>();
    const [payout, setPayout] = useState(1);

    const [getPlansFunc, { loading: planLoading, data: planDoc }] = useLazyQuery(GET_PLANS, {
        onError: (er) => toast.error(CleanMessage(er.message))
    });

    const { loading: getting } = useQuery(GET_CATEGORIES, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setCategories(d.GetCategories.docs);
        }
    });
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="intro-y col-span-12 flex flex-col flex-1 sm:px-10 pb-10 lg:pb-0">
                <div className="intro-y flex-1 lg:ml-5 mb-5 lg:mb-0">
                    <h4 className="text-2xl font-medium">New Investment Form</h4>
                    <LoadingIcon loading={planLoading || getting} />
                    <div>
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                if (plan) {
                                    onSubmit({
                                        plan: plan.id,
                                        investmentMade: amount,
                                        date,
                                        paid,
                                        approved: approve,
                                        nextFund,
                                        weeklyPayoutInterval: payout,
                                        daysToPayout: payout * 7
                                    });
                                } else {
                                    toast.warn("Plan must be selected");
                                }
                            }}
                        >
                            <div className="grid grid-cols-12 gap-5">
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label htmlFor="cate">Select Category</label>

                                        <select
                                            onChange={async ({ currentTarget: { value } }) => {
                                                if (value) await getPlansFunc({ variables: { category: value } });
                                            }}
                                            required
                                            className="w-full bg-gray-200 border border-theme-1 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="cate"
                                        >
                                            <option value="">{t("investment.new.category")}</option>
                                            {categories.map((c, idx) => (
                                                <option key={idx} value={c.id}>
                                                    {c.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label htmlFor="plan">Select Plan</label>

                                        <select
                                            onChange={({ currentTarget: { value } }) => {
                                                if (parseInt(value) !== -1) {
                                                    const _item = planDoc.GetPlans.docs[value];
                                                    if (_item) {
                                                        setPlan(_item);
                                                        setAmount(_item.amount);
                                                    }
                                                }
                                            }}
                                            required
                                            className="w-full bg-gray-200 border border-theme-1 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                        >
                                            <option value="-1">{t("investment.new.plan")}</option>
                                            {planDoc &&
                                                planDoc.GetPlans.docs.map((plan: any, idx: number) => (
                                                    <option key={idx} value={idx}>
                                                        {plan.title}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label
                                            className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                            htmlFor="grid-amount"
                                        >
                                            {t("investment.new.amount")}
                                        </label>
                                        <input
                                            defaultValue={amount}
                                            required
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-theme-1 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            id="grid-amount"
                                            type="number"
                                            min={plan?.amount}
                                            onChange={({ currentTarget: { value, validity } }) =>
                                                validity.valid && setAmount(parseInt(value))
                                            }
                                        />
                                        <p className="text-gray-600 text-xs italic">
                                            {t("min-amount")} £{toCurrency(plan?.amount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label
                                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                            htmlFor="grid-payout"
                                        >
                                            {t("investment.new.payout")}
                                        </label>
                                        <input
                                            defaultValue={payout}
                                            required
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-theme-1 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            id="grid-payout"
                                            type="number"
                                            min={1}
                                            onChange={({ currentTarget: { value, validity } }) =>
                                                validity.valid && setPayout(parseInt(value))
                                            }
                                        />
                                        <p className="text-gray-600 text-xs italic">{t("payout-info")}</p>
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-date">
                                            Investment Date
                                        </label>
                                        <input
                                            defaultValue={date}
                                            required
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-theme-1 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            id="grid-date"
                                            type="date"
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setDate(value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label
                                            className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                            htmlFor="grid-next-date"
                                        >
                                            Next Payout Date
                                        </label>
                                        <input
                                            defaultValue={nextFund}
                                            required
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            id="grid-next-date"
                                            type="date"
                                            onChange={({ currentTarget: { value, validity } }) => validity.valid && setNextFund(value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label className="mr-3">Paid for this investment?</label>
                                        <input
                                            defaultChecked={paid}
                                            onChange={({ currentTarget: { checked } }) => setPaid(checked)}
                                            type="checkbox"
                                            className="input input--switch border"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label className="mr-3">Approve investment?</label>
                                        <input
                                            defaultChecked={approve}
                                            onChange={({ currentTarget: { checked } }) => setApprove(checked)}
                                            type="checkbox"
                                            className="input input--switch border"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button type="submit" className="button  mr-2 mb-2 flex items-center justify-center bg-theme-1 text-white">
                                    <Save className="w-4 h-4 mr-2" />
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default InvestmentForm;
