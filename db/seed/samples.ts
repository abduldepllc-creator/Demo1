/** Sample admin data so every admin tab has something to show on a fresh install. */

export const sampleReviews: { sku: string; name: string; company?: string; city: string; rating: number; title: string; comment: string; status?: "approved" | "pending" }[] = [
  { sku: "SB-TR-001", name: "Ayesha Siddiqui", company: "Glow Naturals", city: "Karachi", rating: 5, title: "Truly crystal clear", comment: "Clarity is outstanding and it doesn't sweat even in Karachi's humidity. Our gift range looks premium now." },
  { sku: "SB-TR-001", name: "Bilal Ahmed", city: "Lahore", rating: 5, title: "Consistent batches", comment: "Third bulk order and every batch melts and sets exactly the same. Great for production planning." },
  { sku: "SB-TR-002", name: "Mehwish Raza", company: "Pure Leaf Organics", city: "Islamabad", rating: 5, title: "Perfect for our clean-label line", comment: "SLS-free yet still lathers well. Our customers with sensitive skin love it." },
  { sku: "SB-MK-001", name: "Usman Tariq", company: "Royal Inn Hotels", city: "Lahore", rating: 5, title: "Ideal for hotel amenities", comment: "Hard, long-lasting bars with a bright white finish. Delivery was on time too." },
  { sku: "SB-MK-001", name: "Sana Malik", company: "The Soap Studio", city: "Lahore", rating: 4, title: "Great pastel colours", comment: "Colours come out true. Slightly softer in peak summer but very good overall." },
  { sku: "SB-MK-002", name: "Hira Shah", city: "Hyderabad", rating: 5, title: "Lovely coconut feel", comment: "Bubbly lather and the coconut milk makes a difference. Customers keep reordering." },
  { sku: "SB-GM-001", name: "Fatima Noor", company: "Little Petals Baby Care", city: "Faisalabad", rating: 5, title: "Gentle enough for babies", comment: "Moisturising and mild. It became the base for our entire baby-care range." },
  { sku: "SB-GM-002", name: "Zainab Ali", city: "Multan", rating: 5, title: "Beautiful golden colour", comment: "The honey blend smells lovely and the bars look rustic and premium." },
  { sku: "SB-AV-001", name: "Hamza Khan", company: "Khyber Cosmetics", city: "Peshawar", rating: 5, title: "Fresh and soothing", comment: "Natural green look without colourants. Our summer collection sold out." },
  { sku: "SB-AV-002", name: "Rabia Javed", city: "Rawalpindi", rating: 4, title: "Nice facial bar base", comment: "Light and refreshing. Would love a slightly stronger cucumber note." },
  { sku: "SB-SH-001", name: "Omar Farooq", company: "Velvet Spa", city: "Islamabad", rating: 5, title: "Spa-grade quality", comment: "Rich, lotion-like lather. Our spa clients ask for it by name." },
  { sku: "SB-SH-002", name: "Nida Hussain", city: "Sialkot", rating: 5, title: "Winter bestseller", comment: "The double-butter formula is perfect for dry winter skin." },
  { sku: "SB-CH-001", name: "Ali Raza", company: "Urban Groom", city: "Karachi", rating: 5, title: "Men love it", comment: "Striking black bars that deep-clean. Our best-selling men's product." },
  { sku: "SB-CH-002", name: "Saad Iqbal", city: "Gujranwala", rating: 4, title: "Good for acne-prone skin", comment: "Tea tree and charcoal together work well. Packaging could be sturdier." },
  { sku: "SB-CH-002", name: "Maryam Aslam", city: "Quetta", rating: 5, title: "Fast delivery to Quetta", comment: "Arrived in 4 days, well packed. Quality is excellent.", status: "pending" },
];

export const sampleCustomers = [
  { name: "Ayesha Siddiqui", company: "Glow Naturals", email: "ayesha@glownaturals.pk", phone: "+92 300 1112233", city: "Karachi", address: "Block 6, PECHS, Karachi" },
  { name: "Hamza Khan", company: "Khyber Cosmetics", email: "procurement@khybercosmetics.pk", phone: "+92 333 4445566", city: "Peshawar", address: "University Road, Peshawar" },
  { name: "Sana Malik", company: "The Soap Studio", email: "sana@soapstudio.pk", phone: "+92 321 7778899", city: "Lahore", address: "MM Alam Road, Gulberg III, Lahore" },
  { name: "Usman Tariq", company: "Royal Inn Hotels", email: "purchasing@royalinn.pk", phone: "+92 302 1234321", city: "Lahore", address: "Mall Road, Lahore" },
  { name: "Fatima Noor", company: "Little Petals Baby Care", email: "fatima@littlepetals.pk", phone: "+92 345 9876543", city: "Faisalabad", address: "D Ground, Faisalabad" },
  { name: "Omar Farooq", company: "Velvet Spa", email: "omar@velvetspa.pk", phone: "+92 311 2223344", city: "Islamabad", address: "F-7 Markaz, Islamabad" },
];

/** Orders: customer index, months ago, status, payment, items [sku, kg] */
export const sampleOrders: {
  customer: number;
  monthsAgo: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment: "unpaid" | "partial" | "paid";
  deliveryFee: number;
  items: [string, number][];
}[] = [
  { customer: 0, monthsAgo: 5, status: "delivered", payment: "paid", deliveryFee: 2500, items: [["SB-TR-001", 200], ["SB-MK-001", 100]] },
  { customer: 3, monthsAgo: 5, status: "delivered", payment: "paid", deliveryFee: 0, items: [["SB-MK-001", 500]] },
  { customer: 1, monthsAgo: 4, status: "delivered", payment: "paid", deliveryFee: 4500, items: [["SB-AV-001", 150], ["SB-CH-001", 100]] },
  { customer: 2, monthsAgo: 3, status: "delivered", payment: "paid", deliveryFee: 0, items: [["SB-TR-001", 100], ["SB-GM-001", 50]] },
  { customer: 4, monthsAgo: 3, status: "delivered", payment: "paid", deliveryFee: 3000, items: [["SB-GM-001", 250]] },
  { customer: 5, monthsAgo: 2, status: "delivered", payment: "paid", deliveryFee: 3500, items: [["SB-SH-001", 120], ["SB-SH-002", 60]] },
  { customer: 0, monthsAgo: 1, status: "delivered", payment: "paid", deliveryFee: 2500, items: [["SB-TR-001", 300], ["SB-TR-002", 100]] },
  { customer: 3, monthsAgo: 1, status: "shipped", payment: "paid", deliveryFee: 0, items: [["SB-MK-001", 1000]] },
  { customer: 1, monthsAgo: 0, status: "processing", payment: "partial", deliveryFee: 4500, items: [["SB-CH-001", 200], ["SB-CH-002", 100]] },
  { customer: 2, monthsAgo: 0, status: "confirmed", payment: "unpaid", deliveryFee: 0, items: [["SB-MK-002", 100], ["SB-AV-002", 50]] },
  { customer: 4, monthsAgo: 0, status: "pending", payment: "unpaid", deliveryFee: 3000, items: [["SB-GM-002", 100]] },
];

export const sampleInquiries = [
  { name: "Kashif Mehmood", company: "Pure Glow Cosmetics", phone: "+92 300 5556677", email: "kashif@pureglow.pk", city: "Lahore", product: "Crystal Clear Glycerin Soap Base", quantityKg: 500, message: "Looking for monthly supply of 500 kg. Please share best price and delivery schedule.", status: "new" as const },
  { name: "Amna Rehman", phone: "+92 321 4433221", city: "Karachi", product: "Pure Goat Milk Soap Base", quantityKg: 50, message: "Starting a small baby-soap brand. Can I get a 1 kg sample first?", status: "new" as const },
  { name: "Tariq Jameel", company: "Hotel Serene", phone: "+92 333 1212121", email: "purchase@hotelserene.pk", city: "Islamabad", product: "Premium Milky White Soap Base", quantityKg: 1000, message: "Need 1 ton for hotel amenities. Private label options?", status: "contacted" as const },
  { name: "Sadia Butt", phone: "+92 345 6767676", city: "Sialkot", product: "Shea Butter Luxury Soap Base", quantityKg: 100, message: "Interested in shea butter base for winter range.", status: "quoted" as const },
];

export const sampleSubscribers = [
  "kashif@pureglow.pk",
  "amna.rehman@gmail.com",
  "orders@glownaturals.pk",
  "hello@craftycorner.pk",
  "info@naturalbliss.pk",
  "sadia.butt@outlook.com",
  "zain@handmadebyzain.pk",
  "studio@lahoresoaps.pk",
];
