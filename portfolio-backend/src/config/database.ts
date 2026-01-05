import mysql from 'mysql2/promise';
import { Pool as PgPool } from 'pg';
import { config } from '../config';

export interface DatabaseConnection {
  query(sql: string, params?: any[]): Promise<any>;
  close(): Promise<void>;
}

class MySQLConnection implements DatabaseConnection {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('MySQL Query Error:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

class PostgreSQLConnection implements DatabaseConnection {
  private pool: PgPool;

  constructor() {
    this.pool = new PgPool({
      host: config.postgres.host,
      port: config.postgres.port,
      user: config.postgres.user,
      password: config.postgres.password,
      database: config.postgres.database,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      const result = await this.pool.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('PostgreSQL Query Error:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Database Factory
export function createDatabaseConnection(): DatabaseConnection {
  const dbType = config.dbType;
  
  if (dbType === 'mysql') {
    console.log('🔌 Connecting to MySQL database...');
    return new MySQLConnection();
  } else if (dbType === 'postgres') {
    console.log('🔌 Connecting to PostgreSQL database...');
    return new PostgreSQLConnection();
  } else {
    throw new Error(`Unsupported database type: ${dbType}`);
  }
}

// Global database instance
export const db = createDatabaseConnection();
