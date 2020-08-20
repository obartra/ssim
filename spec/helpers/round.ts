import { Matrix } from '../../src/types'

export function roundTo(num: number, precision = 3): number {
  return Math.round(num * 10 ** precision) / 10 ** precision
}

export function round(num: number): number {
  return roundTo(num, 3)
}

export function get(obj: Matrix, i: number, j: number, precision = 4): number {
  return roundTo(obj.data[i * obj.width + j], precision)
}
