

const CustomerAccountHeader = ({customer}) => {
    const { username } = customer;
    return (
        <>
            <div className="flex justify-between items-center bg-[#88B7D4] p-4">
                <h1 className="text-3xl text-white font-bold">Airline Ticket Management System</h1>
                <div class="py-4 flex flex-col justify-center items-center space-y-2">
                    <p class="text-lg text-white">{username}</p>
                    <div class="bg-white w-36 rounded-lg text-center">Diamond Member</div>
                </div>
            </div>
        </>
    );
}

export default CustomerAccountHeader;