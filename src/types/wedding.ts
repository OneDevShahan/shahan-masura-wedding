import type { WishMessage } from '../data/wedding'

export type DisplayWish = WishMessage & {
  createdAt?: Date | null
}