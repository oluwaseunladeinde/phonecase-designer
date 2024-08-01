
import { verifySignature } from "@/lib/paystack";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { generateRandomShippingAndBillingAddresses } from "@/lib/helpers";

export async function POST(req: Request) {
    const event = req.body;
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

            const { userId, orderId } = res?.metadata || { userId: null, orderId: null }

            // check that the metadata contains the necessary field to process this hook. 
            if (!userId || !orderId) {
                return new NextResponse(`Webhook Error: Missing metadata: ${res?.metadata}`, { status: 400 });
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

    return new NextResponse(null, { status: 200 });
}