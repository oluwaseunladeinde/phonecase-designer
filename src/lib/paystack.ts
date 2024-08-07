import axios from "axios";
import crypto, { randomUUID } from 'crypto';

export const ValidIPAddresses = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];
export const INITIALIZETRANSACTIONURL = `https://api.paystack.co/transaction/initialize`;
export const VerifyTransactionUrl = `https://api.paystack.co/transaction/verify/:reference`;

export const generateRefenceNumber = (reftype?: string) => {
    if (reftype === "maths") {
        return Math.floor(Math.random() * 10000000000 + 1)
    } else if (reftype === "mathsdate") {
        return Math.floor(Math.random() * Date.now()).toString(16);
    } else {
        return randomUUID().toString();
    }
}

export const thankyouurl = {
    "event": "charge.success",
    "data": {
        "id": 4054823223,
        "domain": "test",
        "status": "success",
        "reference": "d0fc043f-6173-4ff2-9f86-eaa2a188fdc6",
        "amount": 3313069,
        "message": null,
        "gateway_response": "Successful",
        "paid_at": "2024-08-07T16:30:24.000Z",
        "created_at": "2024-08-07T16:29:23.000Z",
        "channel": "card", "currency": "NGN",
        "ip_address": "154.113.84.185",
        "metadata": {
            "userId": "user_2eo74cnGRUh3k42mhcvFoSfu3ie",
            "userEmail": "seanlegend.official@gmail.com",
            "orderId": "clzk19a6400014wi617pwly1r"
        },
        "fees_breakdown": null,
        "log": null,
        "fees": 59697,
        "fees_split": null,
        "authorization": {
            "authorization_code": "AUTH_5hsa6o5hrm",
            "bin": "408408",
            "last4": "4081",
            "exp_month": "12",
            "exp_year": "2030",
            "channel": "card",
            "card_type": "visa ",
            "bank": "TEST BANK",
            "country_code": "NG",
            "brand": "visa",
            "reusable": true,
            "signature": "SIG_TVylkCndWIpZEy2r68vL",
            "account_name": null,
            "receiver_bank_account_number": null,
            "receiver_bank": null
        },
        "customer": {
            "id": 178533415,
            "first_name": null,
            "last_name": null,
            "email": "seanlegend.official@gmail.com",
            "customer_code": "CUS_23zhyfn634gdoj0",
            "phone": null,
            "metadata": null,
            "risk_action": "default",
            "international_format_phone": null
        },
        "plan": {},
        "subaccount": {},
        "split": {},
        "order_id": null,
        "paidAt": "2024-08-07T16:30:24.000Z",
        "requested_amount": 3313069,
        "pos_transaction_data": null,
        "source": {
            "type": "api",
            "source": "merchant_api",
            "entry_point": "transaction_initialize",
            "identifier": null
        }
    }
}

export const verifySignature = (eventData: any, signature: string | string[]): boolean => {
    try {
        const hmac = crypto.createHmac('sha512', process.env.PAYSTACK_TEST_SECREY_API_KEY!);
        const expectedSignature = hmac.update(JSON.stringify(eventData)).digest('hex');
        return expectedSignature === signature;

    } catch (e) {
        console.log("VERIFYING PAYSTACK SIGNATURE FAIL", e)
    }
    return false;
}

export const initializePayment = async (amount: number, email: string) => {
    if (!amount || amount > 0) {
        return
    }

    let url = "";

    const paymentData = {
        mail: email,
        label: '', // String that replaces customer email as shown on the checkout f
        channels: ['card', 'bank', 'bank_transfer'], // An array of payment channels to control what channels you want to make available to the user to make a payment with. Available channels include; ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
        amount: Math.round(amount * 100),
        reference: generateRefenceNumber(),
        metadata: {

        },
    }
}

const VAT = 7.5 / 100
export const calculateVAT = (value: number) => {
    return value * VAT;
}