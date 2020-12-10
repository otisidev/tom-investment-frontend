import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../context/App";
import { Home } from "@styled-icons/feather";

interface iProp {
    history: any;
}

const NotFound: FC<iProp> = ({ history }) => {
    document.body.className = "app";
    return (
        <>
            <Helmet>
                <title>Not Found | {AppName}</title>
            </Helmet>
            <div className="container">
                <div className="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
                    <div className="-intro-x lg:mr-20">
                        <img alt="investment bot" className="h-48 lg:h-auto" src="../../dist/images/error-illustration.svg" />
                    </div>
                    <div className="text-white mt-10 lg:mt-0">
                        <div className="intro-x text-6xl font-medium">404</div>
                        <div className="intro-x text-xl lg:text-3xl font-medium">Oops. This page has gone missing.</div>
                        <div className="intro-x text-lg mt-3">You may have mistyped the address or the page may have moved.</div>
                        <button onClick={() => history.goBack()} className="intro-x button button--lg border border-white flex justify-between content-center mt-10">
                            <Home size={18} className="mr-2" /> <span>Back to Home</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;
