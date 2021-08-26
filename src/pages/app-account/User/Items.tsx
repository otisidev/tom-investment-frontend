import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import {  Info } from "@styled-icons/feather";
import { useTranslation } from "react-i18next";
import { CleanDate, DefaultImage } from "./../../../context/App";
import { PersonCircle } from "@styled-icons/ionicons-outline";

interface props {
    items: Array<any>;
}
const UserItems: FC<props> = ({ items }) => {
    const { t } = useTranslation();
    if (items.length)
        return (
            <div className="grid grid-cols-12 gap-6 mt-5">
                {items.map((user, idx) => (
                    <div key={idx} className="intro-y col-span-12 md:col-span-6">
                        <div className="box">
                            <div className="flex flex-col lg:flex-row items-center p-5">
                                <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                    <img alt="user" className="rounded-full" src={user.image || DefaultImage} />
                                </div>
                                <div className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                    <NavLink to={{ pathname: `/app/user/${user.id}` }} className="uppercase font-medium">
                                        {user.firstname} {user.lastname}
                                    </NavLink>
                                    <div className="text-gray-600 text-xs">{user.nationality}</div>
                                    <div className="text-gray-600 text-xs">
                                        {user.gender} | {CleanDate(user.dob, true, true)}
                                    </div>
                                    <p className="text-xs text-yellow-600 font-semibold">
                                        <span className="mr-4">Duration:</span> <span>{user.duration}</span>
                                    </p>
                                </div>
                                <div className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                    <div className="font-medium">Email address</div>
                                    <div className="text-gray-600 text-xs">{user.email}</div>
                                </div>
                                <div className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                    <div className="font-medium">Phone</div>
                                    <div className="text-gray-600 text-xs">{user.phone}</div>
                                </div>
                                <div className="flex mt-4 lg:mt-0">
                                    <NavLink
                                        to={{ pathname: `/app/user/${user.id}` }}
                                        className="button p-2 rounded-full mb-2 bg-theme-14 text-theme-10"
                                    >
                                         <PersonCircle className="h-6" />
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );

    return (
        <div className="flex flex-col">
            <Info className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 mx-auto mt-5">{t("no-referrer")}</p>
        </div>
    );
};

export default UserItems;
