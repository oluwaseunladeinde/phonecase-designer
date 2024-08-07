import Footer from '@/components/Footer'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Navbar from '@/components/Navbar'
import Steps from '@/components/Steps'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <MaxWidthWrapper className='flex-1 flex flex-col'>
            <Navbar />
            {children}
            <Footer />
        </MaxWidthWrapper>
    )
}

export default Layout