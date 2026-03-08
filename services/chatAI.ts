import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '' });

const BASE_SYSTEM_PROMPT = `You are a friendly, helpful AI assistant for "Online Store" — a premium e-commerce platform. You know everything about this store. Here is your complete knowledge:

## About the Store
- Name: Online Store
- Type: Premium e-commerce platform selling curated lifestyle products
- Contact Email: onlinestore7188@gmail.com
- Shipping Fee: Flat $10 on all orders

## Products We Sell
1. **Precision Timepiece** — $299 | Category: Accessories
   A masterpiece of horology, combining stainless steel elegance with sapphire crystal durability.

2. **SoundWave Elite** — $199 | Category: Electronics
   Immersive noise-canceling headphones with spatial audio and 40-hour battery life.

3. **Luxe Leather Tote** — $150 | Category: Bags
   Handcrafted from full-grain Italian leather, designed for both style and utility.

4. **Glow Skin Serum** — $45 | Category: Skincare
   Vitamin C-rich formula that rejuvenates skin and provides a radiant, natural glow.

5. **Smart Desk Lamp** — $79 | Category: Home Office
   Voice-controlled lighting with adjustable color temperatures and built-in wireless charging.

## Store Policies
- **Shipping**: Flat $10 shipping fee. Orders typically delivered within 5-7 business days.
- **Returns & Refunds**: We accept returns within 30 days of purchase. Items must be unused and in original packaging. Refund processed within 5-10 business days.
- **Privacy**: We respect customer privacy and never share personal data with third parties.
- **Payment**: We accept all major credit cards, debit cards, and digital payment methods.

## Store Pages & Navigation
- Home (/) — Featured products, hero banner
- Products (/products) — Full product catalog with search
- Product Detail (/product/:id) — Individual product with reviews
- Cart (/cart) — Shopping cart
- Checkout (/checkout) — Secure payment
- Profile (/profile) — Account settings, order history
- Wishlist (/wishlist) — Saved items
- About (/about) — Our story
- Contact (/contact) — Get in touch
- Login (/login) & Register (/register) — Account access
- Forgot Password (/forgot-password) — Password recovery

## Store Features
- User accounts with order tracking
- Wishlist functionality
- Product reviews and ratings
- Secure checkout with encrypted payment
- Order history and invoice downloads
- Support ticket system for issues
- Coupon/discount code support
- Real-time order status tracking
- AI-powered live chat (that's you!)

## How to Help Users
- Answer questions about products, pricing, availability
- Help with order tracking — direct them to their Profile > Orders page
- Explain shipping and return policies clearly
- Help with account issues — suggest password reset via Forgot Password page
- For complex issues, suggest emailing onlinestore7188@gmail.com or creating a support ticket
- Be warm, professional, and concise
- Use emojis sparingly but naturally
- If you don't know something specific (like a user's exact order status), suggest they check their account or contact support
- When referencing the user by name, be natural about it (don't overdo it)
- If the user has items in cart, you can reference that context naturally

IMPORTANT: Keep responses short (2-4 sentences max unless the user asks for details). Be conversational and helpful. Never make up information about products or policies not listed above. Use **bold** for emphasis on product names, prices, and key terms.`;

// --- Dynamic context for personalization ---
export interface ChatContext {
  userName?: string;
  isLoggedIn?: boolean;
  cartItems?: number;
  cartTotal?: number;
  cartProductNames?: string[];
}

function buildSystemPrompt(context?: ChatContext): string {
  if (!context) return BASE_SYSTEM_PROMPT;

  let sessionBlock = '\n\n## Current User Session\n';
  if (context.isLoggedIn && context.userName) {
    sessionBlock += `- User: ${context.userName} (logged in)\n`;
  } else {
    sessionBlock += '- User: Guest (not logged in)\n';
  }
  if (context.cartItems !== undefined) {
    sessionBlock += `- Cart: ${context.cartItems} item${context.cartItems !== 1 ? 's' : ''}`;
    if (context.cartTotal !== undefined) {
      sessionBlock += ` ($${context.cartTotal.toFixed(2)} subtotal)`;
    }
    sessionBlock += '\n';
    if (context.cartProductNames && context.cartProductNames.length > 0) {
      sessionBlock += `- Cart contents: ${context.cartProductNames.join(', ')}\n`;
    }
  }

  return BASE_SYSTEM_PROMPT + sessionBlock;
}

// --- Chat history with localStorage persistence ---
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const HISTORY_KEY = 'os_chatHistory';

function loadHistory(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: ChatMessage[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* storage full, silently ignore */ }
}

let chatHistory: ChatMessage[] = loadHistory();

// --- Main send function ---
export async function sendChatMessage(userMessage: string, context?: ChatContext): Promise<string> {
  try {
    const systemPrompt = buildSystemPrompt(context);

    // Prepend system context as a model message at the start of history
    const systemMessage = { role: 'user' as const, parts: [{ text: `[System Instructions - follow these strictly]\n${systemPrompt}` }] };
    const systemAck = { role: 'model' as const, parts: [{ text: 'Understood! I\'ll follow these instructions and help users with the Online Store. How can I help?' }] };

    const contents = [
      systemMessage,
      systemAck,
      ...chatHistory,
      { role: 'user' as const, parts: [{ text: userMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        maxOutputTokens: 400,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I'm sorry, I couldn't process that. Please try again!";

    chatHistory.push(
      { role: 'user', parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: reply }] }
    );

    // Keep history manageable (last 20 turns = 40 messages)
    if (chatHistory.length > 40) {
      chatHistory = chatHistory.slice(-40);
    }
    saveHistory(chatHistory);

    return reply;
  } catch (error: any) {
    console.error('Chat AI Error:', error?.message || error);
    console.error('API Key present:', !!(process.env.GEMINI_API_KEY || process.env.API_KEY));
    return "I'm having trouble connecting right now. Please try again in a moment, or email us at onlinestore7188@gmail.com for help! 📧";
  }
}

export function resetChat() {
  chatHistory = [];
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch { /* ignore */ }
}
