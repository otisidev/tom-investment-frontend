import React, { useState, FC } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CleanMessage, toCurrency } from "../../../context/App";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { GET_PLANS } from "../../../queries/plan.query";
import { NEW_INVESTMENT } from "../../../queries/investment.query";
import { Cash, Close, Person, Save } from "@styled-icons/ionicons-outline";
import { LoadingIcon } from "../../../components/Button";
import { Category } from "./../../../model/category.model";
import { GET_CATEGORIES } from "./../../../queries/category.query";
import { ContactPersonModel } from "./../../../model/contact-person.model";
import PersonList from "../AdminCorner/ContactPerson/PersonList";
import { GET_CONTACT_PERSONS } from "./../../../queries/contact-person.query";
import { Currency } from "../../../model/currency.model";
import { GET_CURRENCIES } from "../../../queries/currency.query";

interface iProp {
    onCancel: any;
}

const NewInvestment: FC<iProp> = ({ onCancel }) => {
    const [plan, setPlan] = useState<any>(undefined);
    const [amount, setAmount] = useState(0);
    const [payout, setPayout] = useState(1);
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [contactPersons, setContactPerson] = useState<Array<ContactPersonModel>>([]);
    const [currencies, setCurrencies] = useState<Array<Currency>>([]);
    const [currency, setCurrency] = useState("");

    const [getPlanFunc, { loading: planLoading, data: planDoc }] = useLazyQuery(GET_PLANS, {
        onError: (er) => toast.error(CleanMessage(er.message))
    });
    const { loading: g } = useQuery(GET_CURRENCIES, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setCurrencies(d.GetCurrencies.docs);
        }
    });
    const { loading: fetching } = useQuery(GET_CATEGORIES, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setCategories(d.GetCategories.docs);
            if (d.GetCategories.docs.length === 1) {
                getPlanFunc({ variables: { category: d.GetCategories.docs[0].id } });
            }
        }
    });

    const [getContactPersonFunc, { loading: _loading }] = useLazyQuery(GET_CONTACT_PERSONS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setContactPerson(d.GetContactPersons.docs);
        }
    });

    // New investment
    const [createFunc, { loading }] = useMutation(NEW_INVESTMENT, {
        onCompleted: (data) => {
            if (data.NewInvestment) {
                window.document.location.reload(true);
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message))
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
                                        weeklyPayoutInterval: payout,
                                        daysToPayout: payout * 7,
                                        currency
                                    }
                                }
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
                            <LoadingIcon loading={planLoading || loading || fetching || _loading || g} />
                            {categories.length > 1 && (
                                <>
                                    <label
                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        htmlFor="grid-cate"
                                    >
                                        {t("investment.new.category")}
                                    </label>
                                    <div className="relative mb-4">
                                        <select
                                            onChange={async ({ currentTarget: { value } }) => {
                                                if (value) {
                                                    await getPlanFunc({ variables: { category: value } });
                                                    await getContactPersonFunc({ variables: { category: value } });
                                                }
                                            }}
                                            required
                                            className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-cate"
                                        >
                                            <option value="">{t("investment.new.category")}</option>
                                            {categories.map((item, idx) => (
                                                <option key={idx} value={item.id}>
                                                    {item.title}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            )}
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
                                    className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                                            <span className="mx-1 text-theme-1">•</span>
                                            Minimum Investment - <strong> £{toCurrency(plan.amount)}</strong>{" "}
                                            <span className="mx-1 text-theme-1">•</span>
                                            Maximum Investment - <strong> £{toCurrency(plan.max_amount)}</strong>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 my-6">
                                        <div className="w-full px-3">
                                            <label
                                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                                htmlFor="grid-amount"
                                            >
                                                {t("investment.new.amount")}
                                            </label>
                                            <input
                                                defaultValue={amount}
                                                required
                                                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                                id="grid-amount"
                                                type="number"
                                                min={plan.amount}
                                                onChange={({ currentTarget: { value, validity } }) =>
                                                    validity.valid && setAmount(parseInt(value))
                                                }
                                            />
                                            <p className="text-gray-600 text-xs italic">
                                                {t("min-amount")} £{toCurrency(plan.amount)}
                                            </p>
                                        </div>
                                        <div className="w-full px-3 mt-4">
                                            <label
                                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                                htmlFor="grid-payout"
                                            >
                                                {t("investment.new.payout")}
                                            </label>
                                            <input
                                                defaultValue={payout}
                                                required
                                                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
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
                                </>
                            )}
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="grid-currency">
                                {t("currency.new.plan")}
                            </label>
                            <div className="relative">
                                <select
                                    onChange={({ currentTarget: { value } }) => setCurrency(value)}
                                    required
                                    className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-currency"
                                >
                                    <option value="-1">{t("currency.new.plan")}</option>
                                    {currencies.map((item, idx) => (
                                        <option key={idx} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex justify-center sm:justify-start mt-5">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="button mr-3 flex items-center justify-center bg-theme-1 text-white"
                                >
                                    {t("submit.text")} <Save className="w-4 h-4 ml-2" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onCancel(false)}
                                    disabled={loading}
                                    className="button mr-3 flex items-center justify-center bg-theme-31 text-theme-6"
                                >
                                    {t("btn.cancel")} <Close className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="col-span-12 lg:col-span-4 xxl:col-span-3 flex lg:block flex-col-reverse">
                <div className="intro-y lg:mt-5" style={{ minHeight: "60vh" }}>
                    <h2 className="font-medium text-base mr-auto mb-4">
                        <Person className="w-4 h-4 mr-2 text-theme-1" /> {t("investment.contact-person")}
                    </h2>
                    <PersonList items={contactPersons} />
                </div>
            </div>
        </div>
    );
};

export default NewInvestment;
