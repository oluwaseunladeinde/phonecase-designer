import React from 'react'

type Props = {}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='mt-24 h-full flex items-center justify-center'>
            {children}
        </div>
    )
}

export default AuthLayout