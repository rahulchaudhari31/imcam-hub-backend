import pool from '../config/db.js';

const PricingPlan = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM pricing_plans ORDER BY display_order ASC'
    );
    return rows;
  },

  async findActive() {
    const { rows } = await pool.query(
      'SELECT * FROM pricing_plans WHERE is_active = true ORDER BY display_order ASC'
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM pricing_plans WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, monthly_price, annual_price, description, cta_text, cta_class, popular, check_color, display_order, is_active }) {
    const { rows } = await pool.query(
      `INSERT INTO pricing_plans (name, monthly_price, annual_price, description, cta_text, cta_class, popular, check_color, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, monthly_price, annual_price, description || null, cta_text, cta_class || null, popular || false, check_color || 'text-blue', display_order || 0, is_active !== false]
    );
    return rows[0];
  },

  async update(id, { name, monthly_price, annual_price, description, cta_text, cta_class, popular, check_color, display_order, is_active }) {
    const { rows } = await pool.query(
      `UPDATE pricing_plans
       SET name = COALESCE($2, name),
           monthly_price = COALESCE($3, monthly_price),
           annual_price = COALESCE($4, annual_price),
           description = COALESCE($5, description),
           cta_text = COALESCE($6, cta_text),
           cta_class = COALESCE($7, cta_class),
           popular = COALESCE($8, popular),
           check_color = COALESCE($9, check_color),
           display_order = COALESCE($10, display_order),
           is_active = COALESCE($11, is_active),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, name, monthly_price, annual_price, description, cta_text, cta_class, popular, check_color, display_order, is_active]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM pricing_plans WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};

const PricingFeature = {
  async findByPlanId(planId) {
    const { rows } = await pool.query(
      'SELECT * FROM pricing_features WHERE pricing_plan_id = $1 ORDER BY display_order ASC',
      [planId]
    );
    return rows;
  },

  async create({ pricingPlanId, feature, display_order }) {
    const { rows } = await pool.query(
      `INSERT INTO pricing_features (pricing_plan_id, feature, display_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [pricingPlanId, feature, display_order || 0]
    );
    return rows[0];
  },

  async update(id, { feature, display_order }) {
    const { rows } = await pool.query(
      `UPDATE pricing_features
       SET feature = COALESCE($2, feature),
           display_order = COALESCE($3, display_order)
       WHERE id = $1
       RETURNING *`,
      [id, feature, display_order]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM pricing_features WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },

  async reorder(planId, items) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          'UPDATE pricing_features SET display_order = $1 WHERE id = $2 AND pricing_plan_id = $3',
          [item.display_order, item.id, planId]
        );
      }
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
};

const PricingComparison = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM pricing_comparison ORDER BY display_order ASC'
    );
    return rows;
  },

  async create({ label, standard_value, pro_value, display_order }) {
    const { rows } = await pool.query(
      `INSERT INTO pricing_comparison (label, standard_value, pro_value, display_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [label, standard_value || null, pro_value || null, display_order || 0]
    );
    return rows[0];
  },

  async update(id, { label, standard_value, pro_value, display_order }) {
    const { rows } = await pool.query(
      `UPDATE pricing_comparison
       SET label = COALESCE($2, label),
           standard_value = COALESCE($3, standard_value),
           pro_value = COALESCE($4, pro_value),
           display_order = COALESCE($5, display_order)
       WHERE id = $1
       RETURNING *`,
      [id, label, standard_value, pro_value, display_order]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM pricing_comparison WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },

  async reorder(items) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          'UPDATE pricing_comparison SET display_order = $1 WHERE id = $2',
          [item.display_order, item.id]
        );
      }
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
};

export { PricingPlan, PricingFeature, PricingComparison };