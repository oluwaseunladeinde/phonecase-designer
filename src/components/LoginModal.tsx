import type { Dispatch, SetStateAction } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import Image from 'next/image'
import { Button, buttonVariants } from './ui/button'
import Link from 'next/link'
import { SignInButton, SignUpButton } from '@clerk/clerk-react'

const LoginModal = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogContent className='absolute z-[9999999]'>
                <DialogHeader>
                    <div className='relative mx-auto w-24 h-24 mb-2'>
                        <Image
                            src='/snake-1.png'
                            alt='snake image'
                            className='object-contain'
                            fill
                        />
                    </div>
                    <DialogTitle className='text-3xl text-center font-bold tracking-tight text-gray-900'>
                        Log in or Register to continue
                    </DialogTitle>
                    <DialogDescription className='text-base text-center py-2'>
                        <span className='font-medium text-zinc-900'>
                            Your configuration was saved!
                        </span>{' '}
                        Please login or create an account to complete your purchase.
                    </DialogDescription>
                </DialogHeader>

                <div className='grid grid-cols-2 gap-6 divide-x divide-gray-200'>
                    <SignInButton>
                        <Button variant={"outline"}>
                            LOG IN
                        </Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button variant={"default"}>
                            REGISTER
                        </Button>
                    </SignUpButton>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LoginModal