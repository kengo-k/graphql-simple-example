import { init } from './src/server'

const axios = require('axios')

const { start, stop } = init()
async function main() {
  await start()
  const response = await axios.post(
    'http://localhost:4000',
    {
      query: `
        query xxx {
          all {
            id
          }
        }`,
    },
    {
      headers: {
        'content-type': 'application/json',
      },
    }
  )
  console.log(JSON.stringify(response.data.data))
  await stop()
}

main()
