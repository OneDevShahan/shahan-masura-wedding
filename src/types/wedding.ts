import type { WishMessage } from '../data/weddingConfig'

export type DisplayWish = WishMessage & {
  createdAt?: Date | null
}