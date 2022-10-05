import { init } from './src/server'

const { start } = init()

async function main() {
  await start()
}

main()
