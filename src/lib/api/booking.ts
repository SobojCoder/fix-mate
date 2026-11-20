const BASE_URL =  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const getBooking =async(query='')=>{
    const res = await fetch(`${BASE_URL}/bookings?${query}`)
    return res.json();
}