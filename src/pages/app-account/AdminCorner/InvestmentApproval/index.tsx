import React from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import InvestmentApprovalItems from './items';

const InvestmentApproval = () => {
    const title = "Investment Approval";

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
            
            <InvestmentApprovalItems />
        </>
    );
};

export default InvestmentApproval;
