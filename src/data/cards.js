export const cardDatabase = [
  // Khan 1 - Basic Cards
  {
    id: 'attack-basic',
    name: 'حمله پایه',
    description: 'یک حمله ساده به دشمن',
    cost: 10,
    attack: 15,
    defense: 0,
    icon: '⚔️',
    availableFromKhan: 1
  },
  {
    id: 'attack-strong',
    name: 'حمله قوی',
    description: 'حمله قدرتمندتر به دشمن',
    cost: 20,
    attack: 30,
    defense: 0,
    icon: '🗡️',
    availableFromKhan: 1
  },
  {
    id: 'defense-basic',
    name: 'دفاع پایه',
    description: 'کاهش آسیب دریافتی',
    cost: 10,
    attack: 0,
    defense: 10,
    icon: '🛡️',
    availableFromKhan: 1
  },
  {
    id: 'defense-strong',
    name: 'دفاع قوی',
    description: 'دفاع قدرتمندتر در برابر آسیب',
    cost: 20,
    attack: 0,
    defense: 20,
    icon: '🛡️',
    availableFromKhan: 1
  },
  
  // Khan 2 - Advanced Cards
  {
    id: 'nushdaru',
    name: 'نوشدارو',
    description: 'درمان و افزایش استقامت',
    cost: 30,
    attack: 0,
    defense: 0,
    heal: 25,
    icon: '💊',
    availableFromKhan: 2
  },
  {
    id: 'attack-combo',
    name: 'حمله ترکیبی',
    description: 'حمله سریع و قدرتمند',
    cost: 25,
    attack: 35,
    defense: 5,
    icon: '⚔️',
    availableFromKhan: 2
  },
  {
    id: 'defense-counter',
    name: 'دفاع متقابل',
    description: 'دفاع و حمله همزمان',
    cost: 25,
    attack: 15,
    defense: 15,
    icon: '🔄',
    availableFromKhan: 2
  }
]

export function getAvailableCards(currentKhan) {
  return cardDatabase.filter(card => card.availableFromKhan <= currentKhan)
}

