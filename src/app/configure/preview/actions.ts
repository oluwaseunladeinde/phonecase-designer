'use server'

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products';
import { db } from '@/db';
import axios from "axios";
import { calculateVAT, generateRefenceNumber, INITIALIZETRANSACTIONURL } from '@/lib/paystack';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Order } from '@prisma/client';

export const createCheckoutSession = async ({ configId }: { configId: string }) => {
    const configuration = await db.configuration.findUnique({
        where: { id: configId },
    })

    if (!configuration) {
        throw new Error('No such configuration found')
    }

    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        throw new Error('You need to be logged in')
    }

    const { finish, material } = configuration

    let totalprice = BASE_PRICE
    if (finish === 'textured')
        totalprice += PRODUCT_PRICES.finish.textured
    if (material === 'polycarbonate')
        totalprice += PRODUCT_PRICES.material.polycarbonate

    let order: Order | undefined = undefined

    const existingOrder = await db.order.findFirst({
        where: {
            userId: user.id,
            configurationId: configuration.id,
        },
    })

    console.log(user.id, configuration.id)

    if (existingOrder) {
        order = existingOrder
    } else {
        order = await db.order.create({
            data: {
                amount: totalprice / 100,
                userId: user.id,
                configurationId: configuration.id,
            },
        })
    }

    const paymentPayload = {
        email: user.email,
        amount: Math.round((totalprice + calculateVAT(totalprice)) * 100),
        reference: generateRefenceNumber(),
        callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        metadata: {
            userId: user?.id,
            orderId: order.id,
        },
    }

    const response = await axios.post(INITIALIZETRANSACTIONURL, paymentPayload, {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_API_KEY}` }
    });
    const response_data = response.data.data;
    return { url: response_data?.authorization_url }
}