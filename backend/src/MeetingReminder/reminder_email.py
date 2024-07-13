def reminder_email(s, meeting_id, confirmation_token):
    return f"""
        <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
            rel="stylesheet"
        />
        </head>

        <body
        style="
            font-family: 'Inter', sans-serif;
            font-optical-sizing: auto;
            font-weight: 300;
            font-style: normal;
            font-variation-settings: 'slnt' 0;
            color: #000;
        "
        >
        <div style="margin-bottom: 40px; background-color: #000; height: 100px; width: 800px; margin: 0 auto;"></div>

        <div style="display: flex; flex-direction: column">
            <div
            style="
                max-width: 750px;
                margin: 0 auto;
                padding-bottom: 20px;
                background-color: #fff;
            "
            >
            <div style="width: 750px; text-align: left">
                <h2
                style="
                    color: #000;
                    font-weight: 900;
                    margin-top: 40px;
                    margin-bottom: 70px;
                "
                >
                Meeting Confirmation
                </h2>
            </div>
            <div style="padding-left: 7px; padding-right: 7px">
                <p style="font-weight: bold" style="margin-top: 30px">Greetings!</p>

                <p>
                    {s}
                </p>

                <p style="font-weight: bold margin-top: 50px">Meeting Notes</p>

                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <div
                style="margin-top: 30px; margin-bottom: 70px"
                >
                <a
                    style="
                    background-color: black;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 14px;
                    "
                    href="https://alpha.intwine.app/confirm-meeting/{meeting_id}/{confirmation_token}"
                    >Confirm Meeting</a
                >
                <a
                    style="
                    background-color: black;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 14px;
                    margin-left: 20px;
                    "
                    style="margin-left: 20px"
                    href="https://alpha.intwine.app/cancel-meeting/{meeting_id}"
                    >Cancel Meeting</a
                >
                </div>
            </div>

            <p style="color: #9ca3af; margin-top: 70px">
                This email was sent to
                <a style="color: #6059e5; font-weight: 800">gawas.sachin@gmail.com</a>.
                If you’d rather not receive this kind of email, you can unsubscribe or
                manage your email preferences.
            </p>

            <div
                style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-top: 50px;
                border-bottom: #000 solid 1px;
                padding-bottom: 40px;
                "
            >
                <div>
                <p style="font-weight: 800">Intwine</p>
                </div>
                <div style="padding-top: 15px">
                <svg
                    style="
                    background-color: black;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 14px;
                    "
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000"
                >
                    <a href="https://www.intwine.app/">
                    <path
                        d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"
                    />
                    </a>
                </svg>

                <svg
                    style="
                    background-color: black;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 14px;
                    "
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000"
                >
                    <a href="https://www.intwine.app/">
                    <path
                        d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"
                    />
                    </a>
                </svg>
                </div>
            </div>
            </div>
        </div>
        </body>

    """
