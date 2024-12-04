// pages/api/webflow.js
import axios from "axios";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "HEAD", "OPTIONS"],
  origin: "https://www.shoper.pl",
  credentials: true,
});

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Helper function to format price (remove .00)
const formatPrice = (price) => {
  return price.replace(".00", "");
};

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // 1. Fetch Shoper prices
    console.log("Fetching Shoper prices...");
    const shoperResponse = await axios.get(
      `${process.env.BACKEND_URL}`,
      {
        params: { action: "get_prices_list" },
      }
    );

    console.log("Shoper response:", shoperResponse.data);
    const priceData = shoperResponse.data;

    // Extract and format prices
    const standardNonCrossed = formatPrice(
      priceData.promotion.price.standard["12"].year.net
    ); // MIGRACJA STANDARD, CENA NIEPRZEKREŚLONA
    const standardCrossed = formatPrice(
      priceData.price.standard.regular_price_year
    ); // MIGRACJA STANDARD, CENA PRZEKREŚLONA
    const premiumNonCrossed = formatPrice(
      priceData.promotion.price.premium["12"].year.net
    ); // MIGRACJA PREMIUM, CENA NIEPRZEKREŚLONA
    const premiumCrossed = formatPrice(
      priceData.price.premium.regular_price_year
    ); // MIGRACJA PREMIUM, CENA PRZEKREŚLONA

    // 2. Fetch live items individually
    console.log("Fetching Webflow items...");
    const [standardItem, premiumItem] = await Promise.all([
      // Get standard item
      axios({
        method: "GET",
        url: `https://api.webflow.com/v2/collections/${process.env.COLLECTION_ID}/items/${process.env.STANDARD_ID}/live`,
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
          "accept-version": "1.0.0",
        },
      }),
      // Get premium item
      axios({
        method: "GET",
        url: `https://api.webflow.com/v2/collections/${process.env.COLLECTION_ID}/items/${process.env.PREMIUM_ID}/live`,
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
          "accept-version": "1.0.0",
        },
      }),
    ]);

    console.log("Items fetched:", {
      standard: standardItem.data,
      premium: premiumItem.data,
    });

    // 3. Update live items
    console.log("Updating items with prices:", {
      standardNonCrossed,
      standardCrossed,
      premiumNonCrossed,
      premiumCrossed,
    });

    await Promise.all([
      // Update standard item
      axios({
        method: "PATCH",
        url: `https://api.webflow.com/v2/collections/${process.env.COLLECTION_ID}/items/${process.env.STANDARD_ID}/live`,
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
          "accept-version": "1.0.0",
          "content-type": "application/json",
        },
        data: {
          fieldData: {
            "cena-w-pakiecie-standard-netto-2": standardNonCrossed,
            "cena-regularna-netto-2": standardCrossed,
            "cena-w-pakiecie-premium-netto-2": premiumNonCrossed,
            "cena-do-kalkulacji": standardNonCrossed, // For standard package, use standard promotional price
          },
        },
      }),
      // Update premium item
      axios({
        method: "PATCH",
        url: `https://api.webflow.com/v2/collections/${process.env.COLLECTION_ID}/items/${process.env.PREMIUM_ID}/live`,
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
          "accept-version": "1.0.0",
          "content-type": "application/json",
        },
        data: {
          fieldData: {
            "cena-w-pakiecie-standard-netto-2": standardNonCrossed,
            "cena-regularna-netto-2": premiumCrossed,
            "cena-w-pakiecie-premium-netto-2": premiumNonCrossed,
            "cena-do-kalkulacji": premiumNonCrossed, // For premium package, use premium promotional price
          },
        },
      }),
    ]);

    console.log("Updates completed successfully");

    res.status(200).json({
      success: true,
      message: "Live prices updated successfully",
      prices: {
        standard: {
          nonCrossed: standardNonCrossed,
          crossed: standardCrossed,
          calculation: standardNonCrossed, // Added for verification
        },
        premium: {
          nonCrossed: premiumNonCrossed,
          crossed: premiumCrossed,
          calculation: premiumNonCrossed, // Added for verification
        },
      },
    });
  } catch (error) {
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      shoperData: error.shoperData,
    });
    res.status(500).json({
      error: error.toString(),
      details: error.response?.data,
    });
  }
}
