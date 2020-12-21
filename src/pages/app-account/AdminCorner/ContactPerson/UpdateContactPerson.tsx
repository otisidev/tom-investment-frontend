import React, { useState, FC } from "react";
import { Save } from "@styled-icons/ionicons-outline";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../../context/App";
import { LoadingIcon } from "../../../../components/Button";
import { X } from "@styled-icons/feather";
import { imageService } from "./../../../../services/Image.service";
import { UPDATE_CONTACT_PERSON } from "../../../../queries/contact-person.query";
import { ContactPersonModel } from "../../../../model/contact-person.model";

interface _ {
    person: ContactPersonModel;
    onCancel?: any;
    onCompleted: any;
    category: string;
}

const UpdateContactPerson: FC<_> = ({ person, onCompleted, onCancel, category }) => {
    const [model, setModel] = useState<any>(person);
    const [uploading, setUploading] = useState(false);

    const [updateFunc, { loading }] = useMutation(UPDATE_CONTACT_PERSON, {
        onCompleted: (data) => {
            if (data.UpdateContactPerson) {
                const { doc, message } = data.UpdateContactPerson;
                onCompleted(doc);
                toast.success(message);
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message))
    });

    if (person)
        return (
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-col flex-1 sm:px-10 lg:px-5 pb-10 lg:pb-0">
                    <div className="intro-y flex-1 box p-16 lg:ml-5 mb-5 lg:mb-0">
                        <h4 className="text-2xl font-medium">Update Contact Person</h4>
                        <div className="p-5">
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();

                                    const { id, __typename, ...rest } = model;
                                    await updateFunc({
                                        variables: {
                                            id,
                                            model: { ...rest, category }
                                        }
                                    });
                                }}
                            >
                                <div className="grid grid-cols-12 gap-5">
                                    <div className="col-span-12 xl:col-span-6">
                                        <div>
                                            <label htmlFor="title">Name</label>
                                            <input
                                                onChange={({ currentTarget: { value } }) => setModel({ ...model, name: value })}
                                                type="text"
                                                id="Name"
                                                required
                                                className="input w-full border mt-2"
                                                placeholder="Enter name"
                                                defaultValue={person?.name}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                required
                                                id="email"
                                                placeholder="Enter email address"
                                                onChange={({ currentTarget: { value, validity } }) =>
                                                    validity.valid && setModel({ ...model, email: value })
                                                }
                                                defaultValue={person?.email}
                                                className="input w-full border mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-12 xl:col-span-6">
                                        <div className="mt-3">
                                            <label>Phone Number</label>
                                            <input
                                                type="text"
                                                required
                                                id="phone"
                                                placeholder="Enter phone"
                                                onChange={({ currentTarget: { value, validity } }) =>
                                                    validity.valid && setModel({ ...model, phone: value })
                                                }
                                                defaultValue={person?.phone}
                                                className="input w-full border mt-2"
                                            />
                                        </div>
                                        <div>
                                            <label>Position</label>
                                            <input
                                                type="text"
                                                required
                                                id="position"
                                                placeholder="Enter position"
                                                onChange={({ currentTarget: { value, validity } }) =>
                                                    validity.valid && setModel({ ...model, position: value })
                                                }
                                                defaultValue={person?.position}
                                                className="input w-full border mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-12">
                                        <div className="grid grid-cols-12 gap-5">
                                            <div className="col-span-12 xl:col-span-12">
                                                <div className="border border-gray-200 rounded-md p-5">
                                                    <div className="w-40 h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                                                        <img
                                                            className="rounded-md"
                                                            alt={model?.name || "no-name"}
                                                            src={model?.image || "/dist/images/profile.jpg"}
                                                        />
                                                    </div>
                                                    <div className="w-48 mx-auto cursor-pointer relative mt-5">
                                                        <button
                                                            disabled={loading}
                                                            type="button"
                                                            className="button w-full bg-theme-1 text-white"
                                                        >
                                                            {uploading ? "Please wait .." : <span>Select Display Picture</span>}
                                                        </button>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (event) => {
                                                                if (event.currentTarget.validity.valid && event.target.files?.length) {
                                                                    // upload service
                                                                    setUploading(true);
                                                                    const data = await imageService.Upload(event.target.files[0]);
                                                                    setUploading(false);
                                                                    if (data) {
                                                                        setModel({ ...model, image: data });
                                                                        toast.success("Image uploaded");
                                                                    } else toast.error("Unable to upload image!");
                                                                } else {
                                                                    toast.info("No file selected!");
                                                                }
                                                            }}
                                                            className="w-full h-full top-0 left-0 absolute opacity-0"
                                                        />
                                                    </div>
                                                    <LoadingIcon loading={uploading} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={onCancel}
                                        type="button"
                                        className="button  mr-4 mb-2  flex items-center justify-center bg-gray-100 shadow-lg text-red-600"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                    <button
                                        disabled={false}
                                        type="submit"
                                        className="button  mr-2 mb-2 flex items-center shadow-lg justify-center bg-theme-1 text-white"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Submit
                                    </button>
                                </div>
                            </form>
                            <LoadingIcon loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        );

    return null;
};

export default UpdateContactPerson;
