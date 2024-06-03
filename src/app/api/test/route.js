let Vimeo = require('vimeo').Vimeo;
/// currently not using


export async function POST(req) {
    if (req.method == 'POST') {
        
        let client_id = 'fa8b5fcb9ba136006769f771eac3f2cc0404527a'
        let client_secret = 'POXFSUOLKsSRhYiiIIuJh2Jll8kGPuwa5LLxNDU2vhxBhe++M9HjNRq7JWSpncnoIwUGi5QmQFJ1mvrAPBzvmtHcOs5qFymxPWmhOMmdLDKknBoWUaOpmL4tuFZKylxs'
        let client = new Vimeo(client_id, client_secret, process.env.NEXT_PUBLIC_VIMEO_TOKEN);

        
        const data = await req.json()
        console.log(data)
        

        
            let file_name = "{path_to_a_video_on_the_file_system}"
            client.upload(
                file_name,
                {
                    'name': 'Untitled',
                    'description': 'The description goes here.'
                },
                function (uri) {
                    console.log('Your video URI is: ' + uri);
                },
                function (bytes_uploaded, bytes_total) {
                    var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
                    console.log(bytes_uploaded, bytes_total, percentage + '%')
                },
                function (error) {
                    console.log('Failed because: ' + error)
                }
            )
            return new Response('body')
            // res.json('next server')
            // await axios.post('http://localhost:7777/api/createcourse', data)
            // .then(resp=>console.log(resp.data))

        }
}