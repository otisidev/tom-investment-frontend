import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AppName, toCurrency } from "../../../../context/App";
import PayoutList from "./items";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { GET_PAYOUT_LIST, PAYOUT, PREPARE_TRANSACTION } from "../../../../queries/payout.query";
import { LoadingIcon } from "./../../../../components/Button/index";
import { HelpBuoy, Refresh, Search, ArrowForward } from "@styled-icons/ionicons-outline";
import { Investment } from "../../../../model/investment.model";
import PaginationSummary from "../../../../components/Paging/Summary";
import PageNumber from "../../../../components/Paging/Number";

const Payout = () => {
    const title = "Investment Payout";
    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const [user, setUser] = useState<any>(null);
    const date = new Date();
    const [wallet, setWallet] = useState<any>();
    const [activeID, setId] = useState<string>();

    const { loading, data, fetchMore, refetch } = useQuery(GET_PAYOUT_LIST, {
        variables: { page, limit, user },
        onError: (er) => toast.error(CleanMessage(er.message)),
    });

    const [payoutFunc, { loading: pLoading }] = useMutation(PAYOUT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.Payout) {
                toast.success(data.Payout.message);
            }
        },
        update: (caches, { data }) => {
            // get local payout
            let local: any = caches.readQuery({
                query: GET_PAYOUT_LIST,
                variables: { page, limit, user },
            });
            // update
            const docs = local.GetPayableInvestments.docs;
            local.GetPayableInvestments.docs.splice(
                docs.findIndex((c: Investment) => c.id === data.Payout.doc.id),
                1
            );
            local.GetPayableInvestments.totalDocs--;

            caches.writeQuery({
                query: GET_PAYOUT_LIST,
                variables: { page, limit, user },
                data: {
                    GetPayableInvestments: local.GetPayableInvestments,
                },
            });
        },
    });

    const [prepareFunc, { loading: _loading }] = useLazyQuery(PREPARE_TRANSACTION, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.PrepareWalletTransaction) {
                setWallet(data.PrepareWalletTransaction);
            }
        },
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit, user },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return { GetPayableInvestments: fetchMoreResult.GetPayableInvestments };
            },
        });
    }, [page, user, limit, fetchMore]);

    return (
        <>
            <Helmet>
                <title>
                    {title} | {AppName}
                </title>
            </Helmet>
            <div className="intro-y flex items-center mt-8 mb-8">
                <h2 className="text-lg font-medium mr-auto">{title}</h2>
            </div>
            <LoadingIcon loading={loading} />
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                    {user && (
                        <button title="Reset Filter" onClick={async () => {}} className="intro-y button px-2 box mt-4 text-gray-700">
                            <span className="w-5 h-5 flex items-center justify-center">
                                <Refresh className="w-4 h-4" />
                            </span>
                        </button>
                    )}
                    {data && <PaginationSummary {...data.GetPayableInvestments} length={data.GetPayableInvestments.docs.length} />}
                    <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                await refetch({
                                    page,
                                    limit,
                                    user,
                                });
                            }}
                        >
                            <div className="w-56 relative text-gray-700">
                                <input
                                    defaultValue={user}
                                    onChange={({ currentTarget: { value } }) => setUser(value)}
                                    type="search"
                                    className="input w-56 box pr-10 placeholder-theme-13"
                                    placeholder="Search..."
                                />
                                <Search className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                {data && (
                    <PayoutList
                        onPay={async (item: any) => {
                            setId(item.id);
                            document.getElementById("payout-btn")?.click();
                            await prepareFunc({
                                variables: {
                                    amount: item.compounded?.status ? item.compounded.payout : item.payout_sum,
                                    wallet: item.user.wallet_address,
                                },
                            });
                        }}
                        items={data.GetPayableInvestments.docs}
                    />
                )}
            </div>

            {!data && date.getDay() !== 4 && !loading && (
                <div className="intro-x flex flex-col">
                    <HelpBuoy className="w-16 h-16 text-theme-6 mx-auto mt-16" />
                    <p className="text-gray-600 mx-auto mt-5">Payouts are only on Thursdays</p>
                </div>
            )}
            <div className="mt-5 intro-x">{data && <PageNumber onPageClicked={(page: number) => setPage(page)} {...data.GetPayableInvestments} length={data.GetPayableInvestments.docs.length} />}</div>
            <a className="hidden" data-toggle="modal" href="javascript:;" data-target="#pay-box" id="payout-btn"></a>
            <div className="modal" id="pay-box">
                <div className="modal__content">
                    <div className="flex items-center px-5 py-5 sm:py-3 border-b border-gray-200">
                        <h2 className="font-medium text-base mr-auto">Investment Payout</h2>
                    </div>
                    <form
                        onSubmit={async (ev) => {
                            ev.preventDefault();

                            await payoutFunc({
                                variables: {
                                    id: activeID,
                                    btc: wallet?.bitcoin,
                                    to: wallet?.receiver,
                                },
                            });
                            document.getElementById("payout-btn")?.click();
                        }}
                    >
                        <div className="p-5 grid grid-cols-12 gap-4 row-gap-3">
                            <div className="col-span-12 sm:col-span-12">
                                <div>
                                    <label className="font-medium text-grey-600">Your Bitcoin Wallet</label>
                                    <h6>{wallet?.sender}</h6>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <div>
                                    <label className="font-medium text-grey-600">Amount in USD</label>
                                    <h6>${toCurrency(wallet?.amount)}</h6>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <div>
                                    <label className="font-medium text-grey-600">Amount in BTC</label>
                                    <h6>{wallet?.bitcoin}</h6>
                                </div>
                            </div>

                            <div className="col-span-12 sm:col-span-12">
                                <div>
                                    <label className="font-medium text-grey-600">Balance in BTC</label>
                                    <h6>{wallet?.balance}</h6>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-12">
                                <div>
                                    <label className="font-medium text-grey-600">Receiver Wallet Address</label>
                                    <h6>{wallet?.receiver}</h6>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-12">
                                <div>
                                    {parseFloat(wallet?.balance) > parseFloat(wallet?.bitcoin) && <span className="text-theme-9">Account Funded</span>}
                                    {parseFloat(wallet?.balance) < parseFloat(wallet?.bitcoin) && <span className="text-theme-6">Insufficient fund</span>}
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-12">
                                <LoadingIcon loading={_loading || pLoading} />
                            </div>
                        </div>

                        <div className="px-5 py-3 text-right border-t border-gray-200">
                            <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 mr-1">
                                Cancel
                            </button>
                            <button type="submit" className="button w-35 bg-theme-1 text-white">
                                Proceed <ArrowForward className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Payout;
