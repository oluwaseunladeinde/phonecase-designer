import { db } from "@/db"



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