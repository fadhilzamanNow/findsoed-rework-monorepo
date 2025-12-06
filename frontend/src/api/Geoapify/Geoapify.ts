import axios from "axios"

export const getLocation = async (location : string) => {
    try{
        console.log("test : ", location)
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${location}&apiKey=55d95c9e97af4327b7ce93cabfdc35bd&format=json&limit=20&lang=id`)
        return response.data.results
    }catch(err){
        console.log("Isi err : ", err)
        throw new Error("Terdapat gangguan koneksi")
    }
}