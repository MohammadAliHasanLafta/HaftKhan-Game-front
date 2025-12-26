export function useGameLogic(gameState) {
  const handleCardSelect = (card) => {
    if (gameState.selectedCards.length >= 3) {
      return // Max 3 cards
    }
    
    const totalCost = calculateTotalCost(gameState.selectedCards)
    if (totalCost + card.cost <= gameState.player.coins) {
      gameState.selectedCards.push({ ...card })
    }
  }
  
  const handleCardDeselect = (cardId) => {
    const index = gameState.selectedCards.findIndex(card => card.id === cardId)
    if (index > -1) {
      gameState.selectedCards.splice(index, 1)
    }
  }
  
  const calculateTotalCost = (cards) => {
    return cards.reduce((sum, card) => sum + card.cost, 0)
  }
  
  const executeCombatTurn = () => {
    if (gameState.selectedCards.length === 0) {
      return { success: false }
    }
    
    const totalCost = calculateTotalCost(gameState.selectedCards)
    
    // Check if player can afford
    if (totalCost > gameState.player.coins) {
      return { success: false, error: 'کافی نیست' }
    }
    
    // Deduct coins
    gameState.player.coins -= totalCost
    
    // Calculate player actions
    let totalAttack = 0
    let totalDefense = 0
    let totalHeal = 0
    
    gameState.selectedCards.forEach(card => {
      totalAttack += card.attack || 0
      totalDefense += card.defense || 0
      totalHeal += card.heal || 0
    })
    
    // Apply heal
    if (totalHeal > 0) {
      gameState.player.health = Math.min(
        gameState.player.maxHealth,
        gameState.player.health + totalHeal
      )
      gameState.combatLog.push({
        type: 'heal',
        message: `شما ${totalHeal} سلامت بازیافتید`
      })
    }
    
    // Apply attack to enemy
    if (totalAttack > 0) {
      gameState.enemy.health = Math.max(0, gameState.enemy.health - totalAttack)
      gameState.combatLog.push({
        type: 'damage',
        message: `شما ${totalAttack} آسیب به ${gameState.enemy.name} وارد کردید`
      })
    }
    
    // Clear selected cards
    gameState.selectedCards = []
    
    // Check if enemy is defeated
    const enemyDefeated = gameState.enemy.health <= 0
    
    if (enemyDefeated) {
      gameState.combatLog.push({
        type: 'victory',
        message: `${gameState.enemy.name} شکست خورد!`
      })
      // Reward coins
      gameState.player.coins += 30
      return { success: true, enemyDefeated: true }
    }
    
    // Enemy turn
    gameState.isPlayerTurn = false
    setTimeout(() => {
      const playerDefeated = executeEnemyTurn(totalDefense)
      if (playerDefeated) {
        gameState.combatLog.push({
          type: 'damage',
          message: 'شما شکست خوردید!'
        })
      }
    }, 1000)
    
    return { success: true, enemyDefeated: false, playerDefeated: false }
  }
  
  const executeEnemyTurn = (playerDefense) => {
    // Enemy attacks
    const enemyAttack = calculateEnemyAttack(gameState.currentKhan)
    const actualDamage = Math.max(0, enemyAttack - playerDefense)
    
    gameState.player.health = Math.max(0, gameState.player.health - actualDamage)
    
    gameState.combatLog.push({
      type: 'damage',
      message: `${gameState.enemy.name} ${actualDamage} آسیب به شما وارد کرد`
    })
    
    gameState.isPlayerTurn = true
    
    // Check if player is defeated
    return gameState.player.health <= 0
  }
  
  const calculateEnemyAttack = (khan) => {
    // Base attack increases with Khan number
    const baseAttack = 15 + (khan * 5)
    // Add some randomness
    const variation = Math.floor(Math.random() * 10) - 5
    return Math.max(10, baseAttack + variation)
  }
  
  return {
    handleCardSelect,
    handleCardDeselect,
    calculateTotalCost,
    executeCombatTurn
  }
}

