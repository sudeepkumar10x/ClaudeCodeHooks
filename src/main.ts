import { open } from "sqlite";
import sqlite3 from "sqlite3";

import { createSchema } from "./schema";
import { getPendingOrders } from "./queries/alert_queries";
import { sendSlackAlert, formatOrderAlert } from "./slack";

async function main() {
  // Get Slack webhook URL from environment variable
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    console.error(
      "Error: SLACK_WEBHOOK_URL environment variable is not set. Alerts will not be sent."
    );
    return;
  }

  const db = await open({
    filename: "ecommerce.db",
    driver: sqlite3.Database,
  });

  try {
    await createSchema(db);

    // Check for pending orders that have been pending for more than 3 days
    const pendingOrders = await getPendingOrders(db, 3);

    if (pendingOrders.length > 0) {
      console.log(
        `Found ${pendingOrders.length} orders pending for more than 3 days`
      );

      // Send Slack alert for each pending order
      for (const order of pendingOrders) {
        const message = formatOrderAlert(
          order.customer_name,
          order.customer_phone,
          order.order_id,
          order.days_pending,
          order.order_date
        );

        const success = await sendSlackAlert(slackWebhookUrl, message);
        if (success) {
          console.log(`✓ Alert sent for order #${order.order_id}`);
        } else {
          console.error(`✗ Failed to send alert for order #${order.order_id}`);
        }
      }
    } else {
      console.log("No orders pending for more than 3 days");
    }
  } catch (error) {
    console.error("Error in main function:", error);
  } finally {
    await db.close();
  }
}

main();
