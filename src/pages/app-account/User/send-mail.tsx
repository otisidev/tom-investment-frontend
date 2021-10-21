import { ArrowBack, Send } from "@styled-icons/ionicons-outline";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { AppName, CleanMessage } from "../../../context/App";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import Editor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import PrimaryButton, { ButtonType, LoadingIcon } from "../../../components/Button";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_EMAILS, NEW_EMAIL_MESSAGE } from "../../../queries/user.query";
import { toast } from "react-toastify";

const SendMail = () => {
    const title = "Bulk Emailing";

    const [model, setModel] = useState({ messageContent: "", subject: "" });
    const [emails, setEmails] = useState([]);

    const { loading } = useQuery(GET_EMAILS, {
        onError: (er) => {
            toast.error(CleanMessage(er.message));
        },
        onCompleted: (d) => {
            setEmails(d.GetUserEmailAddresses);
        }
    });
    //
    const [sendFunc, { loading: _loading }] = useMutation(NEW_EMAIL_MESSAGE, {
        onError: (er) => {
            toast.error(CleanMessage(er.message));
        },
        onCompleted: (d) => {
            toast.success(d.SendBulkEmail);
            setTimeout(() => {
                document.location.reload();
            }, 500);
        }
    });

    return (
        <>
            <Helmet>
                <title>
                    {title} | {AppName}
                </title>
            </Helmet>
            <div className="intro-y box p-4 mt-4" style={{ minHeight: "80vh" }}>
                <div className="intro-y flex items-center">
                    <Link to="/app/users">
                        <button className="button p-4 text-purple-600">
                            <ArrowBack className="w-6" />
                        </button>
                    </Link>
                    <h2 className="text-lg uppercase font-medium mr-auto">{title}</h2>
                </div>
                <hr />
                {/* CONTACT */}
                <div className="grid gap-4 mt-4">
                    <LoadingIcon loading={loading} />

                    <div>
                        <label>Total Receiver</label>
                        <h2 className="font-bold text-lg">{emails.length}</h2>
                    </div>
                    <div>
                        <p>Subject</p>
                        <input
                            onChange={({ currentTarget: { value } }) =>
                                setModel({
                                    ...model,
                                    subject: value
                                })
                            }
                            type="text"
                            required
                            className="input w-full input--lg border border-gray-300 block"
                            placeholder="Enter subject"
                            defaultValue={model.subject}
                        />
                    </div>
                    <div>
                        <label>Message body</label>
                        <Editor
                            config={{
                                placeholderText: "Start typing!",
                                charCounterCount: true,
                                heightMin: 400,
                                fontSizeSelection: true
                            }}
                            onModelChange={(content: any) => {
                                setModel({ ...model, messageContent: content });
                            }}
                        />
                    </div>
                    <div className="mt-6">
                        <PrimaryButton
                            className="button p-4 bg-purple-600 text-white  shadow"
                            onClick={async () => {
                                if (model.subject && emails.length)
                                    await sendFunc({ variables: { emails, subject: model.subject, message: model.messageContent } });
                                else toast.error("Mail subject and receiver is required!");
                            }}
                            loading={_loading}
                            type={ButtonType.button}
                        >
                            <Send className="w-6" /> Send Message
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SendMail;
