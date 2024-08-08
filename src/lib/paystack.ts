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

export const verifySignature = (eventData: any, signature: string | string[]): boolean => {

    try {
        const hmac = crypto.createHmac('sha512', process.env.PAYSTACK_TEST_SECRET_API_KEY!);
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