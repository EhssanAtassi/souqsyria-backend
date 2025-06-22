# 📊 SouqSyria Database Optimization Scripts

## 🎯 Purpose
Optimize audit_logs table performance for production-scale operations (1M+ logs)

## ⏱️ When to Run
- Before production deployment
- When audit logs exceed 100,000 records
- If queries become slow (>500ms)

---

## 🔧 Critical Performance Indexes

```sql
-- ✅ MOST IMPORTANT: Actor timeline queries (used in 80% of queries)
CREATE INDEX IDX_audit_actor_time ON audit_logs(actor_id, created_at DESC);

-- ✅ Action-based filtering (admin searches)
CREATE INDEX IDX_audit_action_time ON audit_logs(action, created_at DESC);

-- ✅ Module monitoring (system health dashboards)
CREATE INDEX IDX_audit_module_time ON audit_logs(module, created_at DESC);

-- ✅ Security monitoring (real-time security dashboard)
CREATE INDEX IDX_audit_security ON audit_logs(is_security_event, risk_score, created_at DESC) 
WHERE is_security_event = true;

-- ✅ Financial tracking (compliance and reporting)
CREATE INDEX IDX_audit_financial ON audit_logs(is_financial_event, monetary_amount, created_at DESC) 
WHERE is_financial_event = true;

-- ✅ Geographic analysis (Syrian market insights)
CREATE INDEX IDX_audit_country_time ON audit_logs(country, created_at DESC);

-- ✅ IP address tracking (security analysis)
CREATE INDEX IDX_audit_ip_time ON audit_logs(ip_address, created_at DESC);

-- ✅ Entity tracking (trace specific records)
CREATE INDEX IDX_audit_entity ON audit_logs(entity_type, entity_id);
```

---

## 📈 Advanced Performance Indexes

```sql
-- ✅ Compliance queries (GDPR, Syrian law)
CREATE INDEX IDX_audit_compliance ON audit_logs(is_compliance_event, regulatory_category, created_at DESC) 
WHERE is_compliance_event = true;

-- ✅ Business model analysis (B2B vs B2C)
CREATE INDEX IDX_audit_business_model ON audit_logs(business_model, created_at DESC);

-- ✅ Multi-tenant queries (enterprise customers)
CREATE INDEX IDX_audit_tenant ON audit_logs(tenant_id, created_at DESC);

-- ✅ Performance monitoring
CREATE INDEX IDX_audit_performance ON audit_logs(processing_time_ms, was_successful);

-- ✅ Error analysis
CREATE INDEX IDX_audit_errors ON audit_logs(was_successful, error_code, created_at DESC) 
WHERE was_successful = false;
```

---

## 🗂️ Table Partitioning (For 10M+ Records)

```sql
-- ✅ PARTITION BY MONTH for better performance
-- Run ONLY if you have MySQL 8.0+ and 10M+ records

ALTER TABLE audit_logs PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    PARTITION p202403 VALUES LESS THAN (202404),
    PARTITION p202404 VALUES LESS THAN (202405),
    PARTITION p202405 VALUES LESS THAN (202406),
    PARTITION p202406 VALUES LESS THAN (202407),
    PARTITION p202407 VALUES LESS THAN (202408),
    PARTITION p202408 VALUES LESS THAN (202409),
    PARTITION p202409 VALUES LESS THAN (202410),
    PARTITION p202410 VALUES LESS THAN (202411),
    PARTITION p202411 VALUES LESS THAN (202412),
    PARTITION p202412 VALUES LESS THAN (202501),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

---

## 🔍 Performance Monitoring Queries

```sql
-- ✅ CHECK INDEX USAGE
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    INDEX_TYPE
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = 'souqsyria' 
AND TABLE_NAME = 'audit_logs'
ORDER BY CARDINALITY DESC;

-- ✅ FIND SLOW QUERIES
SELECT 
    COUNT(*) as query_count,
    AVG(processing_time_ms) as avg_time,
    MAX(processing_time_ms) as max_time,
    action
FROM audit_logs 
WHERE processing_time_ms > 1000 
GROUP BY action 
ORDER BY avg_time DESC;

-- ✅ TABLE SIZE ANALYSIS
SELECT 
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "DB Size in MB",
    ROUND((data_length / 1024 / 1024), 2) AS "Data Size in MB",
    ROUND((index_length / 1024 / 1024), 2) AS "Index Size in MB",
    table_rows AS "Estimated Rows"
FROM information_schema.tables 
WHERE table_schema = 'souqsyria' 
AND table_name = 'audit_logs';

-- ✅ RECENT PERFORMANCE STATS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_logs,
    AVG(processing_time_ms) as avg_processing_time,
    COUNT(CASE WHEN was_successful = false THEN 1 END) as failed_logs,
    COUNT(CASE WHEN is_security_event = true THEN 1 END) as security_events
FROM audit_logs 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## ⚡ TypeORM Production Configuration

```typescript
// Add to your typeorm.config.ts
export const productionDatabaseConfig = {
  // ... existing config ...
  
  // ✅ CONNECTION POOLING
  extra: {
    connectionLimit: 50, // Max connections
    acquireTimeout: 30000, // 30 seconds
    timeout: 60000, // 60 seconds query timeout
  },
  
  // ✅ QUERY OPTIMIZATION
  maxQueryExecutionTime: 1000, // Log slow queries (1 sec)
  
  // ✅ CACHING (if Redis available)
  cache: {
    type: 'redis',
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    },
    duration: 300000, // 5 minutes
  },
};
```

---

## 📋 Execution Checklist

### Phase 1: Basic Optimization (Required)
- [ ] Run critical performance indexes (8 commands)
- [ ] Update TypeORM configuration
- [ ] Test query performance

### Phase 2: Advanced Optimization (Optional)
- [ ] Run advanced performance indexes (5 commands)
- [ ] Set up Redis caching
- [ ] Monitor with performance queries

### Phase 3: Scale Optimization (10M+ records)
- [ ] Implement table partitioning
- [ ] Set up automated archival
- [ ] Configure read replicas

---

## 🚨 Important Notes

1. **Backup First**: Always backup database before running these commands
2. **Run During Low Traffic**: Indexes can take time to create
3. **Monitor After**: Check performance improvements with monitoring queries
4. **Syrian Timezone**: All timestamps are UTC, convert for Syrian reporting

---

## 📞 Support

If queries still run slow after optimization:
1. Check the performance monitoring queries
2. Consider archiving old data (>1 year)
3. Implement read replicas for analytics
4. Contact database administrator for advanced tuning