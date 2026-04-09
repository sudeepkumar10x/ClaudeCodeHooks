import { Database } from "sqlite";

export interface PendingOrder {
  order_id: number;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  days_pending: number;
}

export async function getPendingOrders(
  db: Database,
  dayThreshold: number = 3
): Promise<PendingOrder[]> {
  const query = `
    SELECT 
      o.id as order_id,
      c.first_name || ' ' || c.last_name as customer_name,
      c.phone as customer_phone,
      o.created_at as order_date,
      CAST((julianday('now') - julianday(o.created_at)) AS INTEGER) as days_pending
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.status = 'pending'
    AND julianday('now') - julianday(o.created_at) > ?
    ORDER BY o.created_at ASC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dayThreshold], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}
