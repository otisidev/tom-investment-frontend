import React, { useState, FC } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CleanMessage, toCurrency } from "../../../context/App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_PLANS } from "../../../queries/plan.query";
import { NEW_INVESTMENT } from "../../../queries/investment.query";
import { Cash, Close, Save } from "@styled-icons/ionicons-outline";
import { LoadingIcon } from "../../../components/Button";

interface iProp {
    onCancel: any;
}

const NewInvestment: FC<iProp> = ({ onCancel }) => {
    const [plan, setPlan] = useState<any>(undefined);
    const [amount, setAmount] = useState(0);
    const { t } = useTranslation();

    const { loading: planLoading, data: planDoc } = useQuery(GET_PLANS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
    });

    // New investment
    const [createFunc, { loading }] = useMutation(NEW_INVESTMENT, {
        onCompleted: (data) => {
            if (data.NewInvestment) {
                window.document.location.reload(true);
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message)),
    });
    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 xxl:col-span-9 flex lg:block flex-col-reverse">
                <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        if (plan && (amount < plan.amount || amount > plan.max_amount)) {
                            toast.error(t("message.amount.less"));
                        } else {
                            await createFunc({
                                variables: {
                                    model: {
                                        plan: plan?.id,
                                        investmentMade: amount,
                                    },
                                },
                            });
                        }
                    }}
                >
                    <div className="intro-y box lg:mt-5" style={{ minHeight: "60vh" }}>
                        <div className="flex items-center p-8 border-b border-gray-200">
                            <h2 className="font-medium text-base mr-auto">
                                <Cash className="w-8 h-8 mr-2 text-theme-1" /> {t("investment.new")}
                            </h2>
                        </div>
                        <div className="p-8">
                            <LoadingIcon loading={planLoading || loading} />
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                                {t("investment.new.plan")}
                            </label>
                            <div className="relative">
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
                                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                            {plan && (
                                <>
                                    <div className="intro-y">
                                        <div className="text-gray-800 text-center mt-5">
                                            <strong>{plan.percent}% percent ROI</strong>
                                            <span className="mx-1 text-theme-1">•</span>Payout Interval - <strong>Every {plan.weekly_payout_interval} </strong>{" "}
                                            {plan.weekly_payout_interval > 1 ? "weeks" : "week"} <span className="mx-1 text-theme-1">•</span>
                                            Minimum Investment - <strong> ${toCurrency(plan.amount)}</strong> <span className="mx-1 text-theme-1">•</span>
                                            Maximum Investment - <strong> ${toCurrency(plan.max_amount)}</strong>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-amount">
                                                {t("investment.new.amount")}
                                            </label>
                                            <input
                                                defaultValue={amount}
                                                required
                                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                id="grid-amount"
                                                type="number"
                                                min={plan.amount}
                                                onChange={({ currentTarget: { value, validity } }) => validity.valid && setAmount(parseInt(value))}
                                            />
                                            <p className="text-gray-600 text-xs italic">
                                                {t("min-amount")} ${toCurrency(plan.amount)}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-center sm:justify-start mt-5">
                                <button type="submit" disabled={loading} className="button mr-3 flex items-center justify-center bg-theme-1 text-white">
                                    {t("submit.text")} <Save className="w-4 h-4 ml-2" />
                                </button>
                                <button type="button" onClick={() => onCancel(false)} disabled={loading} className="button mr-3 flex items-center justify-center bg-theme-31 text-theme-6">
                                    {t("btn.cancel")} <Close className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewInvestment;
