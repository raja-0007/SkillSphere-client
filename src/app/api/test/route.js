import axios from "axios"

export async function POST(req){
    if(req.method == 'POST'){
        const data = await req.formData()
        console.log(data)
        // res.json('next server')
        // await axios.post('http://localhost:7777/api/createcourse', data)
        // .then(resp=>console.log(resp.data))
        return new Response('good')
    }
}