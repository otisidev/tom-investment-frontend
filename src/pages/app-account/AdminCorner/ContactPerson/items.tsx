import React, { FC, useState } from "react";
import { ContactPersonModel } from "./../../../../model/contact-person.model";
import { CloseCircle, InformationCircle } from "@styled-icons/ionicons-outline";
import { LoadingIcon } from "../../../../components/Button";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_CONTACT_PERSON } from "./../../../../queries/contact-person.query";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";

interface __ {
    items: Array<ContactPersonModel>;
    onDeleted: any;
    onUpdate: any;
}

const ContactPersonList: FC<__> = ({ items, onDeleted, onUpdate }) => {
    const [active, setActive] = useState<any>(undefined);

    const [deleteFunc, { loading: deleteLoading }] = useMutation(DELETE_CONTACT_PERSON, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            const { message, doc } = d.RemoveContactPerson;
            document.getElementById("deleteCmd")?.click();
            toast.success(message);
            onDeleted(doc);
        }
    });

    if (items.length)
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="box bg-gray-100 rounded-xl zoom-in shadow-lg p-8">
                            <img className="w-32 h-32 rounded-full mx-auto" src={item.image} alt={item.name} width="384" height="384" />
                            <div className="pt-4 text-center  space-y-4">
                                <figcaption className="font-medium mb-2">
                                    <div className="text-purple-600 text-lg">{item.name}</div>
                                    <div className="text-gray-500">{item.email}</div>
                                    <div className="text-gray-500">{item.phone}</div>
                                    <div className="text-teal-500">Position: {item.position}</div>
                                </figcaption>

                                <div>
                                    <button type="button" onClick={() => onUpdate(item)} className="button w-20 border text-theme-1 mr-1">
                                        Update
                                    </button>
                                    <a
                                        href="javascript:;"
                                        onClick={() => setActive(item)}
                                        data-toggle="modal"
                                        data-target="#delete-box"
                                        className="button w-35 border text-theme-6 text-white"
                                    >
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal" id="delete-box">
                    <div className="modal__content">
                        <div className="p-5 text-center">
                            <CloseCircle className="w-16 h-16 text-theme-6 mx-auto mt-3" />
                            <div className="text-3xl mt-5">Delete Contact person</div>
                            <div className="text-gray-600 mt-2">Are you sure you want to delete this contact person?</div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            <LoadingIcon loading={deleteLoading} />
                            <button type="button" id="deleteCmd" data-dismiss="modal" className="button w-24 border text-gray-700 mr-1">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => await deleteFunc({ variables: { id: active?.id } })}
                                className="button w-24 bg-theme-6 text-white"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    return (
        <div className="flex flex-col items-center py-16" style={{ minHeight: "60vh", alignItems: "center" }}>
            <InformationCircle className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 text-2xl mx-auto mt-5">No Contact Person is added yet!</p>
        </div>
    );
};

export default ContactPersonList;
