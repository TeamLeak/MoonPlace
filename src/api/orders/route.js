async function handler({ method, body, query }) {
  const session = getSession();
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === "admin";

  switch (method) {
    case "GET": {
      if (query.id) {
        const [order] = await sql`
          SELECT o.*, s.name as service_name, s.price 
          FROM orders o
          LEFT JOIN services s ON o.service_id = s.id
          WHERE o.id = ${query.id}
          AND (${isAdmin} OR o.user_id = ${userId})
        `;

        if (!order) {
          return { error: "Order not found", status: 404 };
        }

        const messages = await sql`
          SELECT * FROM messages 
          WHERE order_id = ${query.id}
          ORDER BY created_at ASC
        `;

        return { order: { ...order, messages } };
      }

      const orders = await sql`
        SELECT o.*, s.name as service_name, s.price 
        FROM orders o
        LEFT JOIN services s ON o.service_id = s.id
        WHERE ${isAdmin} OR o.user_id = ${userId}
        ORDER BY o.created_at DESC
      `;

      return { orders };
    }

    case "POST": {
      const { service_id, message } = body;

      if (!service_id || !message) {
        return { error: "Missing required fields", status: 400 };
      }

      const [service] = await sql`
        SELECT * FROM services WHERE id = ${service_id}
      `;

      if (!service) {
        return { error: "Service not found", status: 404 };
      }

      const [order] = await sql.transaction(async (sql) => {
        const [newOrder] = await sql`
          INSERT INTO orders (user_id, service_id, message)
          VALUES (${userId}, ${service_id}, ${message})
          RETURNING *
        `;

        await sql`
          INSERT INTO messages (order_id, user_id, content)
          VALUES (${newOrder.id}, ${userId}, ${message})
        `;

        return [newOrder];
      });

      return { order };
    }

    case "PUT": {
      const { id, status } = body;

      if (!id || !status) {
        return { error: "Missing required fields", status: 400 };
      }

      if (!isAdmin) {
        return { error: "Unauthorized", status: 401 };
      }

      const [order] = await sql`
        UPDATE orders 
        SET status = ${status}
        WHERE id = ${id}
        RETURNING *
      `;

      if (!order) {
        return { error: "Order not found", status: 404 };
      }

      return { order };
    }

    default:
      return { error: "Method not allowed", status: 405 };
  }
}
export async function POST(request) {
  return handler(await request.json());
}