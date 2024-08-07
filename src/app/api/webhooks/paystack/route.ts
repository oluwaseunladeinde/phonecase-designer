
import { verifySignature } from "@/lib/paystack";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { generateRandomShippingAndBillingAddresses } from "@/lib/helpers";
import { Resend } from 'resend'
import OrderReceivedEmail from '@/components/emails/OrderReceivedEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
    //const event = req.body;
    const event = req.text;

    console.log({ event })

    const headersignature = headers().get("x-paystack-signature") as string;

    if (!headersignature) {
        return new NextResponse(`No signature provided`, { status: 400 })
    }

    if (!verifySignature(event, headersignature)) {
        return new NextResponse(`Invalid Signature`, { status: 400 })
    }

    const res = event as any;

    try {
        // Handle successful charge
        if (res?.event === 'charge.success' && res?.data.status === 'success') {

            const { userId, userEmail, orderId } = res?.metadata || { userId: null, orderId: null }

            // check that the metadata contains the necessary field to process this hook. 
            if (!userId || !userEmail || !orderId) {
                return new NextResponse(`Webhook Error: Invalid request metadata: ${res?.metadata}`, { status: 400 });
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

        } else if (res?.event === 'charge.failed') { // Handle failed charge

        } else if (res?.event === 'refund.created') { // Handle refund

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

    //return new NextResponse(null, { status: 200 });

    return NextResponse.json(
        { result: event, ok: true },
        { status: 200 }
    )
}