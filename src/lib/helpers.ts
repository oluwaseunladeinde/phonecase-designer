import { db } from "@/db"
import { faker } from '@faker-js/faker';

interface Address {
    street?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    name: string;
    phoneNumber?: string;
}

function generateRandomAddress(): Address {
    return {
        name: faker.person.fullName(),
        street: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state(),
        phoneNumber: faker.phone.number(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
    };
}

export function generateRandomShippingAndBillingAddresses(): { shippingAddress: Address; billingAddress: Address } {
    return {
        shippingAddress: generateRandomAddress(),
        billingAddress: generateRandomAddress(),
    };
}


export const getOrCreateUser = async (userId: string, userEmail: string | null) => {
    let user = null
    const existingUser = await db.user.findFirst({
        where: { id: userId },
    })

    if (!existingUser) {
        user = await db.user.create({
            data: {
                id: userId,
                email: userEmail!,
            },
        })
    }
    return user
}  