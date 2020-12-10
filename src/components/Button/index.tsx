import React, { FC } from "react";

import "./button.css";

interface iProp {
    loading: boolean;
    type: ButtonType;
    children?: any;
    onClick?: any;
    className: String;
    disabled?: boolean;
}

export enum ButtonType {
    submit = "submit",
    button = "button",
}

const PrimaryButton: FC<iProp> = ({ loading, type, children, onClick, className, disabled = false }) => {
    return (
        <button onClick={onClick} disabled={disabled} type={type} className={`${className}`}>
            {loading ? (
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            ) : (
                <>{children}</>
            )}
        </button>
    );
};

export default PrimaryButton;

interface props {
    loading: boolean;
    className?: string;
}
export const LoadingIcon: FC<props> = ({ loading, className }) => {
    if (loading)
        return (
            <div className={`lds-ring lds-ring-themed mt-5 ${className}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );

    return null;
};
