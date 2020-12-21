import React, { FC } from "react";
import { ContactPersonModel } from "../../../../model/contact-person.model";
import { InformationCircle } from "@styled-icons/ionicons-outline";

interface _ {
    items: Array<ContactPersonModel>;
}
const PersonList: FC<_> = ({ items }) => {
    if (items.length)
        return (
            <div className="grid grid-cols-1 gap-2">
                {items.map((item, idx) => (
                    <div key={idx} className="box bg-gray-100 rounded-xl zoom-in shadow-lg p-8">
                        <img
                            className="w-32 h-32 rounded-full mx-auto"
                            src={item.image}
                            alt={item.name}
                            width="384"
                            height="384"
                        />
                        <div className="pt-4 text-center space-y-4">
                            <figcaption className="font-medium">
                                <div className="text-purple-600 text-lg">{item.name}</div>
                                <div className="text-gray-500">{item.email}</div>
                                <div className="text-gray-500">{item.phone}</div>
                                <div className="text-teal-500">Position: {item.position}</div>
                            </figcaption>
                        </div>
                    </div>
                ))}
            </div>
        );
    return (
        <div className="flex flex-col items-center py-16" style={{ minHeight: "60vh", alignItems: "center" }}>
            <InformationCircle className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 text-lg mx-auto mt-5">No Record!</p>
        </div>
    );
};

export default PersonList;
