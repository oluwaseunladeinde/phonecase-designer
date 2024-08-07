"use client"

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';

const CreateCase = () => {
    const pathname = usePathname();
    const isConfigurePage = pathname?.includes("/configure");
    return (
        <>
            {!isConfigurePage ? (
                <Link
                    href='/configure/upload'
                    className={buttonVariants({
                        size: 'sm',
                        className: 'hidden sm:flex items-center gap-1',
                    })}>
                    Create case
                    <ArrowRight className='ml-1.5 h-5 w-5' />
                </Link>
            ) : <p className='text-medium text-sm text-muted-foreground'>Create case</p>}
        </>
    )
}

export default CreateCase