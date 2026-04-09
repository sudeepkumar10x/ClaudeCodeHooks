export interface SlackMessage {
  channel: string;
  text: string;
  blocks?: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

export async function sendSlackAlert(
  webhookUrl: string,
  message: SlackMessage
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error(
        `Slack API error: ${response.status} ${response.statusText}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Slack alert:", error);
    return false;
  }
}

export function formatOrderAlert(
  customerName: string,
  customerPhone: string,
  orderId: number,
  daysPending: number,
  orderDate: string
): SlackMessage {
  return {
    channel: "#order-alerts",
    text: `Order Alert: Order #${orderId} pending for ${daysPending} days`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "⚠️ Order Pending Alert",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Order ID:*\n#${orderId}`,
          },
          {
            type: "mrkdwn",
            text: `*Days Pending:*\n${daysPending} days`,
          },
          {
            type: "mrkdwn",
            text: `*Customer:*\n${customerName}`,
          },
          {
            type: "mrkdwn",
            text: `*Phone:*\n${customerPhone}`,
          },
          {
            type: "mrkdwn",
            text: `*Order Date:*\n${orderDate}`,
          },
        ],
      },
    ],
  };
}
