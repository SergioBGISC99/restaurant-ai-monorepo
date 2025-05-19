import { Product } from '@prisma/client';

export function parseProductsFromMessages(
  messages: string[],
  availableProducts: Product[],
) {
  const parsed: { productId: string; quantity: number }[] = [];

  for (const line of messages) {
    for (const product of availableProducts) {
      const name = product.name.toLowerCase();
      const regex = new RegExp(`(\\d+)\\s*(?:x|\\*)?\\s*${name}`, 'i');
      const match = line.match(regex);

      if (match) {
        parsed.push({
          productId: product.id,
          quantity: parseInt(match[1], 10),
        });
      }
    }
  }

  return parsed;
}
