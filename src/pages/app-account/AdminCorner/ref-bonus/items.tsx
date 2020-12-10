import React, { FC } from "react";
import { Albums, Cash } from "@styled-icons/ionicons-outline";
import { toCurrency, CleanDate, CleanMessage } from "../../../../context/App";
import { useMutation } from "@apollo/react-hooks";
import { PAY_REFERRAL } from "../../../../queries/referral.query";
import { toast } from "react-toastify";
import { LoadingIcon } from "../../../../components/Button";

interface iProp {
    items: Array<any>;
}
const ReferralItems: FC<iProp> = ({ items }) => {
    const [payFunc, { loading }] = useMutation(PAY_REFERRAL, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        update: () => {
            document.location.reload(true);
        },
    });

    if (items.length)
        return (
            <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                <table className="table table-report -mt-2">
                    <thead className="uppercase font-bold">
                        <tr>
                            <th className="text-center whitespace-no-wrap">#</th>
                            <th className="whitespace-no-wrap">Investor</th>
                            <th className="whitespace-no-wrap">Referred</th>
                            <th className="text-center whitespace-no-wrap">investment made</th>
                            <th className="text-left whitespace-no-wrap">Made At</th>
                            <th className="text-center whitespace-no-wrap">Amount</th>
                            <th className="whitespace-no-wrap text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr key={idx} className="intro-x">
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
                                <td className="w-40">
                                    <div className="flex flex-col lg:flex-row items-center py-5">
                                        <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                            <img alt={item.referrer.firstname} className="rounded-full" src={item.referrer.image || "/dist/images/profile-5.jpg"} />
                                        </div>
                                        <div className="lg:ml-4 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                            <div className="font-medium">
                                                {item.referrer.firstname} {item.referrer.lastname}
                                            </div>
                                            <div className="text-gray-600 text-xs">{item.referrer.email}</div>
                                            <div className="text-theme-1 font-bold text-xs">{item.referrer.wallet_address}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="font-medium">${toCurrency(item.investment.investment_made)}</div>
                                </td>
                                <td className="text-left">
                                    <div className="font-medium">{CleanDate(item.created_at, true)}</div>
                                </td>
                                <td className="text-center">
                                    <div className="font-medium">${toCurrency(item.amount)}</div>
                                </td>
                                <td className="table-report__action w-56">
                                    <div className="flex justify-center items-center">
                                        <a
                                            id={item.id}
                                            onClick={async () => {
                                                if (window.confirm("Are you sure you want to confirm Payment?")) {
                                                    await payFunc({
                                                        variables: {
                                                            id: item.id,
                                                        },
                                                    });
                                                }
                                            }}
                                            className="flex items-center mr-3 border-theme-9 text-theme-9"
                                            href="javascript:;"
                                        >
                                            <Cash className="w-4 h-4 mr-1" />
                                            Pay
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <LoadingIcon loading={loading} />
            </div>
        );
    return (
        <div className="flex flex-col">
            <Albums className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 mx-auto mt-5">No Referral bonus for payment!</p>
        </div>
    );
};
export default ReferralItems;
