require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const MENU = [
  // Black Coffees
  { id: 'pike', name: 'Pike Place Roast', price: 3.45, category: 'black coffee', tags: ['hot', 'black', 'drip', 'classic', 'medium roast'] },
  { id: 'dark', name: 'Dark Roast Bold', price: 3.65, category: 'black coffee', tags: ['hot', 'black', 'bold', 'dark roast'] },
  { id: 'americano', name: 'Caffè Americano', price: 3.95, category: 'black coffee', tags: ['hot', 'iced', 'black', 'espresso'] },

  // Cold Drinks
  { id: 'macchiato', name: 'Iced Caramel Macchiato', price: 5.45, category: 'cold drink', tags: ['iced', 'sweet', 'espresso', 'caramel'] },
  { id: 'shaken', name: 'Iced Brown Sugar Oatmilk Shaken Espresso', price: 5.95, category: 'cold drink', tags: ['iced', 'oatmilk', 'espresso', 'sweet'] },
  { id: 'coldbrew', name: 'Vanilla Sweet Cream Cold Brew', price: 4.95, category: 'cold drink', tags: ['iced', 'cold brew', 'vanilla', 'cream'] },

  // Teas & Lattes
  { id: 'matcha', name: 'Matcha Tea Latte', price: 5.25, category: 'tea', tags: ['matcha', 'green tea', 'latte'] },

  // Hot Sandwiches & Savory Food
  { id: 'gouda', name: 'Bacon, Gouda & Egg Sandwich', price: 5.45, category: 'sandwich', tags: ['sandwich', 'breakfast', 'warm', 'savory', 'bacon'] },
  { id: 'wrap', name: 'Spinach, Feta & Egg White Wrap', price: 5.25, category: 'sandwich', tags: ['wrap', 'sandwich', 'healthy', 'vegetarian'] },

  // Pastries & Bakery
  { id: 'croissant', name: 'Butter Croissant', price: 3.75, category: 'pastry', tags: ['pastry', 'bakery', 'flaky', 'butter'] },
  { id: 'muffin', name: 'Blueberry Streusel Muffin', price: 3.95, category: 'pastry', tags: ['pastry', 'muffin', 'blueberry', 'sweet'] }
];

function analyzeConversation(messages) {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
  const allCustomerText = userMessages.join(' ');
  const latestMessage = userMessages[userMessages.length - 1] || '';

  // 1. Detect all items ordered throughout the chat
  const orderedItems = [];
  for (const item of MENU) {
    if (allCustomerText.includes(item.name.toLowerCase()) || 
        (item.tags.some(tag => tag.length > 4 && allCustomerText.includes(tag)) && 
         (allCustomerText.includes('order') || allCustomerText.includes('have') || allCustomerText.includes('get') || allCustomerText.includes('add') || allCustomerText.includes('want')))) {
      if (!orderedItems.some(existing => existing.id === item.id)) {
        orderedItems.push(item);
      }
    }
  }

  // 2. Check if customer is saying "no, that is all" or finishing
  const finishPhrases = [
    'that is all', "that's all", 'thats all', 'no thank', 'no thanks', 'nothing else',
    'just that', 'that will be all', 'im good', "i'm good", 'ready to pay', 'checkout', 'done'
  ];
  const isFinishing = finishPhrases.some(phrase => latestMessage.includes(phrase)) || 
                      (latestMessage.trim() === 'no' || latestMessage.trim() === 'nope');

  return { latestMessage, orderedItems, isFinishing };
}

function generateBaristaResponse(messages) {
  const { latestMessage, orderedItems, isFinishing } = analyzeConversation(messages);

  // --- FINISH ORDER (When customer says "that's all" or "no") ---
  if (isFinishing) {
    if (orderedItems.length === 0) {
      return "All set! You don't have anything in your cart yet. Let me know if you want to grab a coffee or pastry whenever you're ready!";
    }

    const subtotal = orderedItems.reduce((acc, item) => acc + item.price, 0);
    const tax = subtotal * 0.0825;
    const total = subtotal + tax;

    const receiptLines = orderedItems.map(item => `  • ${item.name} — $${item.price.toFixed(2)}`).join('\n');

    return `Awesome! Here is your finalized order:\n\n${receiptLines}\n\nSubtotal: $${subtotal.toFixed(2)}\nEstimated Tax: $${tax.toFixed(2)}\nTotal: $${total.toFixed(2)}\n\nYour order has been sent to the barista bar. It'll be ready for pickup in 5 minutes! Thank you for visiting The Green Roast Co. ☕`;
  }

  // --- MENU BROWSE INTENT ---
  if (latestMessage.includes('menu') || latestMessage.includes('what do you have') || latestMessage.includes('options')) {
    return `Here is what we have brewing today:\n\n` +
      `☕ Black Coffee:\n` +
      `  • Pike Place Roast ($3.45)\n` +
      `  • Dark Roast Bold ($3.65)\n` +
      `  • Caffè Americano ($3.95)\n\n` +
      `❄️ Cold Drinks:\n` +
      `  • Iced Caramel Macchiato ($5.45)\n` +
      `  • Iced Brown Sugar Oatmilk Shaken Espresso ($5.95)\n` +
      `  • Vanilla Sweet Cream Cold Brew ($4.95)\n\n` +
      `🥐 Pastries & Food:\n` +
      `  • Bacon, Gouda & Egg Sandwich ($5.45)\n` +
      `  • Spinach & Feta Wrap ($5.25)\n` +
      `  • Butter Croissant ($3.75)\n` +
      `  • Blueberry Streusel Muffin ($3.95)\n\n` +
      `What would you like to start with?`;
  }

  // --- BLACK COFFEE SPECIFIC INQUIRIES ---
  if (latestMessage.includes('black coffee') || latestMessage.includes('drip') || latestMessage.includes('roast') || latestMessage.includes('americano')) {
    return "For black coffee, we have our classic medium Pike Place Roast ($3.45), our rich Dark Roast Bold ($3.65), and a smooth Caffè Americano ($3.95). Would you like one of those hot or iced?";
  }

  // --- COLD DRINK INQUIRIES ---
  if (latestMessage.includes('cold') || latestMessage.includes('iced') || latestMessage.includes('refreshing')) {
    return "Our top cold picks right now are the Vanilla Sweet Cream Cold Brew ($4.95) and the Iced Brown Sugar Oatmilk Shaken Espresso ($5.95). Can I get one started for you?";
  }

  // --- FOOD / PASTRY INQUIRIES ---
  if (latestMessage.includes('food') || latestMessage.includes('pastry') || latestMessage.includes('sandwich') || latestMessage.includes('eat') || latestMessage.includes('breakfast')) {
    return "Fresh from the bakery and kitchen: we have our Bacon, Gouda & Egg Sandwich ($5.45), Spinach & Feta Wrap ($5.25), warm Butter Croissants ($3.75), and Blueberry Muffins ($3.95). Want to pair one with a drink?";
  }

  // --- ORDERING ITEMS + SMART SCAN & RECOMMENDATION ---
  const currentItem = MENU.find(item => latestMessage.includes(item.name.toLowerCase()) || item.tags.some(t => t.length > 4 && latestMessage.includes(t)));

  if (currentItem) {
    const hasDrink = orderedItems.some(i => i.category.includes('coffee') || i.category.includes('drink') || i.category.includes('tea'));
    const hasFood = orderedItems.some(i => i.category === 'sandwich' || i.category === 'pastry');

    // Cross-suggest food if they ordered drink, or drink if they ordered food
    let recommendation = "";
    if (hasDrink && !hasFood) {
      recommendation = "Can I warm up a Butter Croissant ($3.75) or a Bacon, Gouda & Egg Sandwich ($5.45) to go with that, or is that all for you?";
    } else if (hasFood && !hasDrink) {
      recommendation = "Would you like a hot Pike Place Roast ($3.45) or an Iced Caramel Macchiato ($5.45) to drink with it, or is that everything?";
    } else {
      recommendation = "Would you like anything else today, or does that complete your order?";
    }

    return `Added the ${currentItem.name} ($${currentItem.price.toFixed(2)}) to your order! ${recommendation}`;
  }

  // --- GREETINGS ---
  if (latestMessage.includes('hi') || latestMessage.includes('hello') || latestMessage.includes('hey')) {
    return "Welcome to The Green Roast Co.! ☕ We have fresh black coffees, cold handcrafted espresso, warm breakfast sandwiches, and pastries. What can I get started for you?";
  }

  // Fallback conversational prompt
  return "I'm with you! We offer hot black coffees, cold espresso drinks, breakfast sandwiches, and fresh pastries. Would you like to add anything to your order, or are you all set?";
}

app.post('/api/chat', (req, res) => {
  try {
    const { messages } = req.body;
    const reply = generateBaristaResponse(messages || []);
    res.json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ reply: 'Sorry, I ran into a hiccup with that request.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`☕ Café server running at http://localhost:${PORT}`);
});
