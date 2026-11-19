const BASE_URL =  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const getServices =async(query='')=>{
    const res = await fetch(`${BASE_URL}/services?${query}`)
    return res.json();
}