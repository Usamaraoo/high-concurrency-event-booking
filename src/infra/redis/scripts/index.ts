import fs from 'fs'
import path from 'path'

const load = (name: string) =>
  fs.readFileSync(path.join(__dirname, name), 'utf8')

export const reserveSeatLua = load('reserve-seat.lua')
export const restoreSeatLua = load('restore-seat.lua') 