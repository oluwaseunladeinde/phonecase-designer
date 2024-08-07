'use server'

import { db } from '@/db'
import { currentUser } from '@clerk/nextjs/server';

export const getPaymentStatus = async ({ orderId, reference, trxref }: { orderId: string; reference: string; trxref: string }) => {
    const user = await currentUser();

    if (!user?.id || !user?.emailAddresses[0].emailAddress) {
        throw new Error('You need to be logged in to view this page.')
    }

    //await getOrCreatePaystackPaymentReference({ orderId, reference, trxref })

    const order = await db.order.findFirst({
        where: { id: orderId, userId: user.id },
        include: {
            billingAddress: true,
            configuration: true,
            shippingAddress: true,
            user: true,
        },
    })

    if (!order) throw new Error('This order does not exist.')

    if (order.isPaid) {
        return order
    } else {
        return false
    }
}


const getOrCreatePaystackPaymentReference = async ({ orderId, reference, trxref }: { orderId: string; reference: string; trxref: string }) => {

    let paymentref = await db.paystackPaymentReference.findFirst({
        where: { orderId, reference, trxref },
    })

    if (!paymentref) {
        paymentref = await db.paystackPaymentReference.create({
            data: { orderId, reference, trxref }
        })
    }
}