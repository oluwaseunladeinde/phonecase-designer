import React, { useState } from 'react';

interface Address {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;

}

const BillingAndShippingForm = () => {
    const [billingAddress, setBillingAddress] = useState<Address>({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });
    const [shippingAddress, setShippingAddress] = useState<Address>({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });
    const [useSameAddress, setUseSameAddress] = useState(false);
    const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress({
            ...billingAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleUseSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseSameAddress(e.target.checked);
        if (e.target.checked) {
            setShippingAddress({ ...billingAddress });
        } else {
            setShippingAddress({
                firstName: '',
                lastName: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            });
        }
    };

    return (
        <div>
            {/* Billing Address */}
            <div>
                {/* Input fields for billing address */}
            </div>

            {/* Shipping Address */}
            <div>
                <input
                    type="checkbox"
                    id="useSameAddress"
                    name="useSameAddress"
                    checked={useSameAddress}
                    onChange={handleUseSameAddressChange}
                />
                <label htmlFor="useSameAddress">Use same address for shipping</label>
                {!useSameAddress && (
                    <div>
                        {/* Input fields for shipping address */}
                    </div>
                )}
            </div>
        </div>
    );
}