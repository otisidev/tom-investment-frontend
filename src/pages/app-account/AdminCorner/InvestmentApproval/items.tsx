import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage, toCurrency, CleanDate } from "./../../../../context/App";
import { DECLINE_INVESTMENT, ACCEPT_INVESTMENT, INVESTMENT_APPROVAL } from "../../../../queries/investment.query";
import PaginationSummary from "../../../../components/Paging/Summary";
import PageNumber from "../../../../components/Paging/Number";
import { LoadingIcon } from "../../../../components/Button";
import { Checkbox, CloseCircle, ArrowForward, Albums } from "@styled-icons/ionicons-outline";

const InvestmentApprovalItems = () => {
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(25);
    const [item, setItem] = useState<any>(null);
    const [nextFund, setNexFund] = useState<string>();

    // get investment approval list
    const { loading, data, fetchMore } = useQuery(INVESTMENT_APPROVAL, {
        variables: {
            page,
            limit,
        },
        onError: (er) => toast.error(CleanMessage(er.message)),
    });

    const [declineFunc, { loading: dLoading }] = useMutation(DECLINE_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        update: (caches, cb) => {
            // read
            let d: any = caches.readQuery({
                query: INVESTMENT_APPROVAL,
                variables: {
                    page,
                    limit,
                },
            });

            // update
            const docs = d.GetInvestmentsForApproval.docs;
            d.GetInvestmentsForApproval.docs.splice(
                docs.findIndex((x: any) => cb.data.DeclineInvestment.doc.id === x.id),
                1
            );

            //   reduce totalDocs count by 1
            d.GetInvestmentsForApproval.totalDocs--;

            //   write the new content back
            caches.writeQuery({
                query: INVESTMENT_APPROVAL,
                variables: {
                    page,
                    limit,
                },
                data: {
                    GetInvestmentsForApproval: d.GetInvestmentsForApproval,
                },
            });
        },
        onCompleted: (d) => {
            toast.success(d.DeclineInvestment.message);
        },
    });

    const [acceptFunc, { loading: aLoading }] = useMutation(ACCEPT_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        update: (caches, cb) => {
            //   read
            let d: any = caches.readQuery({
                query: INVESTMENT_APPROVAL,
                variables: {
                    page,
                    limit,
                },
            });
            // update
            const docs = d.GetInvestmentsForApproval.docs;
            d.GetInvestmentsForApproval.docs.splice(
                docs.findIndex((x: any) => x.id === cb.data.ApproveInvestment.doc.id),
                1
            );
            // reduce count by 1
            d.GetInvestmentsForApproval.totalDocs--;

            // write back
            caches.writeQuery({
                query: INVESTMENT_APPROVAL,
                variables: {
                    page,
                    limit,
                },
                data: { GetInvestmentsForApproval: d.GetInvestmentsForApproval },
            });
        },
        onCompleted: (d) => {
            document.getElementById("closeApproval")?.click();
            toast.success(d.ApproveInvestment.message);
        },
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return { GetInvestmentsForApproval: fetchMoreResult.GetInvestmentsForApproval };
            },
        });
    }, [page, limit, fetchMore]);

    return (
        <div>
            <LoadingIcon loading={loading || dLoading} />
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                    {data && data.GetInvestmentsForApproval.docs.length > 0 && <PaginationSummary {...data.GetInvestmentsForApproval} length={data.GetInvestmentsForApproval.docs.length} />}
                </div>
            </div>
            <div className="mt-4">
                <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                    <table className="table table-report -mt-2">
                        <thead className="uppercase font-bold">
                            {data && data.GetInvestmentsForApproval.docs.length > 0 && (
                                <tr>
                                    <th className="text-center whitespace-no-wrap">#</th>
                                    <th className="whitespace-no-wrap">Investor</th>
                                    <th className="whitespace-no-wrap text-center">Country</th>
                                    <th className="text-center whitespace-no-wrap">investment made</th>
                                    <th className="text-left whitespace-no-wrap">Plan</th>
                                    <th className="text-left whitespace-no-wrap">Investment Date</th>
                                    <th className="whitespace-no-wrap text-center">Actions</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {data &&
                                data.GetInvestmentsForApproval.docs.map((item: any, idx: number) => (
                                    <tr className="intro-x" key={idx}>
                                        <td className="text-center">
                                            <strong>{idx + 1}</strong>
                                        </td>

                                        <td className="w-50">
                                            <div className="flex flex-col lg:flex-row items-center py-3">
                                                <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                                    <img alt={item.user.firstname} className="rounded-full" src={item.user.image || "/dist/images/profile-5.jpg"} />
                                                </div>
                                                <div className="lg:ml-4 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                                    <div className="font-medium">
                                                        {item.user.firstname} {item.user.lastname}
                                                    </div>
                                                    <div className="text-gray-600 text-xs">{item.user.email}</div>
                                                    <div className="text-gray-600 text-xs">
                                                        Wallet: <span className="text-theme-1 font-bold">{item.walletAddress}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="font-medium">{item.user.nationality}</div>
                                        </td>
                                        <td className="text-center">
                                            <div className="font-medium text-theme-9">${toCurrency(item.investment_made)}</div>
                                        </td>
                                        <td className="text-left">{item.plan.title}</td>
                                        <td className="text-left">
                                            <span className="font-medium">{CleanDate(item.date, true)}</span>
                                        </td>
                                        <td className="table-report__action w-56">
                                            <div className="flex justify-center items-center text-theme-9">
                                                <a data-toggle="modal" data-target="#approval-box" id={item.id} onClick={() => setItem(item)} className="flex items-center mr-3" href="javascript:;">
                                                    <Checkbox className="w-4 h-4 mr-1" />
                                                    Approve
                                                </a>
                                                <a
                                                    onClick={async () => {
                                                        if (window.confirm("Are sure you want to decline this investment?")) {
                                                            await declineFunc({
                                                                variables: {
                                                                    id: item.id,
                                                                },
                                                            });
                                                        }
                                                    }}
                                                    className="flex items-center text-theme-6"
                                                    href="javascript:;"
                                                    data-toggle="modal"
                                                    data-target="#delete-confirmation-modal"
                                                >
                                                    <CloseCircle className="w-4 h-4 mr-1" />
                                                    Decline
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-5 intro-x">
                {data && data.GetInvestmentsForApproval.docs.length > 0 && (
                    <PageNumber onPageClicked={(page: number) => setPage(page)} {...data.GetInvestmentsForApproval} length={data.GetInvestmentsForApproval.docs.length} />
                )}
            </div>

            {data && data.GetInvestmentsForApproval.docs.length === 0 && (
                <div className="mt-5 intro-y">
                    <div className="flex flex-col">
                        <Albums className="w-16 h-16 text-theme-1 mx-auto mt-5" />
                        <p className="text-gray-600 mx-auto mt-5">No Investment for approval!</p>
                    </div>
                </div>
            )}

            <div className="modal" id="approval-box">
                <div className="modal__content">
                    <form
                        onSubmit={async (event) => {
                            event.preventDefault();

                            document.getElementById("dismiss")?.click();
                            await acceptFunc({
                                variables: {
                                    id: item.id,
                                    nextFund,
                                },
                            });
                        }}
                    >
                        <div className="flex items-center px-5 py-5 sm:py-3 border-b border-gray-200">
                            <h2 className="font-medium text-base mr-auto">Investment Approval</h2>
                        </div>
                        <div className="p-5 grid grid-cols-12 gap-4 row-gap-3">
                            <div className="col-span-12 sm:col-span-12">
                                <label> Next Fund Date</label>
                                <input
                                    type="date"
                                    defaultValue={nextFund}
                                    onChange={({ currentTarget: { value } }) => setNexFund(value)}
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-theme-1 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    required
                                />
                            </div>
                        </div>
                        <LoadingIcon loading={aLoading} />

                        <div className="px-5 py-3 text-right border-t border-gray-200">
                            <button id="dismiss" type="button" data-dismiss="modal" className="button w-20 border text-gray-700 mr-1">
                                Cancel
                            </button>
                            <button type="submit" className="button w-35 bg-theme-1 text-white">
                                Approve <ArrowForward className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InvestmentApprovalItems;
