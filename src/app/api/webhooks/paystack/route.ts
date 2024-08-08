
import { verifySignature } from "@/lib/paystack";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { generateRandomShippingAndBillingAddresses } from "@/lib/helpers";
import { Resend } from 'resend';
import crypto, { randomUUID } from 'crypto';
import OrderReceivedEmail from '@/components/emails/OrderReceivedEmail'

const resend = new Resend(process.env.RESEND_API_KEY)
const PaystackValidIPAddresses = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

export async function POST(req: Request) {

    const isValidIPAddress = PaystackValidIPAddresses.includes(headers().get('x-forwarded-for') as string);
    if (!isValidIPAddress) {
        return new NextResponse(`Fraudulent Request Detected`, { status: 400 })
    }

    const signature = headers().get("x-paystack-signature") as string;
    if (!signature) {
        return new NextResponse(`No signature provided`, { status: 400 })
    }

    const response = await req.json()

    if (!verifySignature(response, signature)) {
        return new NextResponse(`Invalid Signature`, { status: 400 })
    }

    try {
        // Handle successful charge
        if (response?.event === 'charge.success' && response?.data.status === 'success') {

            const { userId, userEmail, orderId } = response?.data?.metadata || { userId: null, orderId: null }

            console.log({ metadata: response?.data?.metadata, userId, userEmail, orderId });

            // check that the metadata contains the necessary field to process this hook. 
            if (!userId || !userEmail || !orderId) {
                console.log("Could not find metadata payload")
                return new NextResponse(`Webhook Error: Invalid request metadata: ${response?.metadata}`, { status: 400 });
            }

            // TODO: Create a shipping address collector component
            const { billingAddress, shippingAddress } = generateRandomShippingAndBillingAddresses()

            const updatedOrder = await db.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    isPaid: true,
                    shippingAddress: {
                        create: {
                            name: shippingAddress!.name!,
                            city: shippingAddress!.city!,
                            country: shippingAddress!.country!,
                            postalCode: shippingAddress!.postalCode!,
                            street: shippingAddress!.street!,
                            state: shippingAddress!.state,
                        },
                    },
                    billingAddress: {
                        create: {
                            name: billingAddress!.name!,
                            city: billingAddress!.city!,
                            country: billingAddress!.country!,
                            postalCode: billingAddress!.postalCode!,
                            street: billingAddress!.street!,
                            state: billingAddress!.state,
                        },
                    },
                }
            })

            await resend.emails.send({
                from: 'Phonecase Designer <oluwaseun.ladeinde@yahoo.com>',
                to: [userEmail],
                subject: 'Thanks for your order!',
                react: OrderReceivedEmail({
                    orderId,
                    orderDate: updatedOrder.createdAt.toLocaleDateString(),
                    // @ts-ignore
                    shippingAddress: {
                        name: shippingAddress!.name!,
                        city: shippingAddress!.city!,
                        country: shippingAddress!.country!,
                        postalCode: shippingAddress!.postalCode!,
                        street: shippingAddress!.street!,
                        state: shippingAddress!.state,
                    },
                }),
            })

        } else if (response?.event === 'charge.failed') { // Handle failed charge

        } else if (response?.event === 'refund.created') { // Handle refund

        } else { // Handle other events

        }
    } catch (error: any) {
        console.log("[PAYSTACK_WEBHOOK]", error);
        //return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
        return NextResponse.json(
            { message: `Webhook Error: ${error.message}`, ok: false },
            { status: 500 }
        )
    }

    return NextResponse.json(
        { result: response, ok: true },
        { status: 200 }
    )
}