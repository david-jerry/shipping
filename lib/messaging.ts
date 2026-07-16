type EmailPayload = {
    to: string;
    subject: string;
    html: string;
    text: string;
};

type SmsPayload = {
    to: string;
    body: string;
};

function requiredEnv(name: string) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export async function sendEmail(payload: EmailPayload) {
    const apiKey = requiredEnv("RESEND_API_KEY");
    const from = requiredEnv("RESEND_FROM_EMAIL");

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
        }),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Resend email send failed (${response.status}): ${body}`);
    }
}

export async function sendSms(payload: SmsPayload) {
    const accountSid = requiredEnv("TWILIO_ACCOUNT_SID");
    const authToken = requiredEnv("TWILIO_AUTH_TOKEN");
    const from = requiredEnv("TWILIO_FROM_PHONE");

    const params = new URLSearchParams({
        To: payload.to,
        From: from,
        Body: payload.body,
    });

    const basic = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        },
    );

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Twilio SMS send failed (${response.status}): ${body}`);
    }
}
