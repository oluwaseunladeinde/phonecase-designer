'use server'

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products';
import { db } from '@/db';
import axios from "axios";
import { calculateVAT, generateRefenceNumber, INITIALIZETRANSACTIONURL } from '@/lib/paystack';
import { currentUser } from '@clerk/nextjs/server';
import { Order } from '@prisma/client';
import { getOrCreateUser } from '@/lib/helpers';
import { convertToNaira } from '@/lib/utils';

export const createCheckoutSession = async ({ configId }: { configId: string }) => {
    const configuration = await db.configuration.findUnique({
        where: { id: configId },
    })

    if (!configuration) {
        throw new Error('No such configuration found')
    }

    const user = await currentUser();

    if (!user) {
        throw new Error('You need to be logged in')
    }

    const { user: appuser } = await getOrCreateUser(user)

    const { finish, material } = configuration

    let totalprice = BASE_PRICE
    if (finish === 'textured')
        totalprice += PRODUCT_PRICES.finish.textured
    if (material === 'polycarbonate')
        totalprice += PRODUCT_PRICES.material.polycarbonate

    totalprice = convertToNaira(totalprice)

    let order: Order | undefined = undefined

    const existingOrder = await db.order.findFirst({
        where: {
            userId: appuser?.id,
            configurationId: configuration.id,
        },
    })

    const priceAfterVAT = Math.round((totalprice + calculateVAT(totalprice)))

    if (existingOrder) {
        order = existingOrder
    } else {
        order = await db.order.create({
            data: {
                amount: priceAfterVAT,
                userId: user.id,
                configurationId: configuration.id,
            },
        })
    }

    // create paystack data 
    const paymentPayload = {
        email: appuser?.email,
        amount: priceAfterVAT,
        reference: generateRefenceNumber(),
        callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        metadata: {
            userId: appuser?.id,
            userEmail: appuser?.email,
            orderId: order.id,
        },
        custom_fields: [
            {
                display_name: "Application's Name",
                variable_name: "application_name",
                value: "Custom iPhone Case",
            }
        ]
    }

    try {
        const response = await axios.post(INITIALIZETRANSACTIONURL, paymentPayload, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_API_KEY}` }
        });
        const response_data = response.data.data;
        return { url: response_data?.authorization_url }
    } catch (err) {
        console.error("DESIGN PREVIEW ERROR: ", err);
    }
    return { url: null };

}