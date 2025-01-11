import { Link } from 'react-router-dom';
import {useState} from 'react';

const CustomerAccountSidebar = () => {
    const [isSelect, setIsSelect] = useState('account');

    const handleSelect = (value) => {
        setIsSelect(value);
    }

    return (
        <div className="flex flex-col bg-[#4A7087] pt-14 px-4 h-screen text-white space-y-12">
            <h1 className='text-3xl text-center font-bold'>CUSTOMER</h1>
            <div className='flex flex-col space-y-2'>
                <h2 className='text-2xl font-bold'>GENERAL INFORMATION</h2>
                <div className='flex flex-col ml-6 space-y-2'>
                    <Link to={'/customer/homepage'}><button className='text-medium hover:text-rose-400 hover:scale-105 duration-300'>Homepage</button></Link>
                    <button onClick={() => {handleSelect('history')}} className={`${isSelect === 'history' ? "text-rose-400 scale-105" : ""} text-left text-medium hover:text-rose-400 hover:scale-105 duration-300`}>Ticket purchase history</button>
                    <Link to={'/search-ticket'}><button className='text-medium hover:text-rose-400 hover:scale-105 duration-300'>Buy ticket</button></Link>
                </div>
            </div>
            <div className='flex flex-col space-y-2'>
                <h2 className='text-2xl font-bold'>ACCOUNT</h2>
                <div className='flex flex-col ml-6 space-y-2'>
                    <Link to={'/customer-information'}><button className={`${isSelect === 'account' ? "text-rose-400 scale-105" : ""} text-medium hover:text-rose-400 hover:scale-105 duration-300`}>Account Information</button></Link>
                    <Link to={'/'}><button className='text-medium hover:text-rose-400 hover:scale-105 duration-300'>Log out</button></Link>
                </div>
            </div>
        </div>
    )
}

export default CustomerAccountSidebar;