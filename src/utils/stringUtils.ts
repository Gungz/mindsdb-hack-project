/**
 * Converts a JSON string wrapped in markdown code blocks to an array
 * @param jsonString - String like "```json\n[\"item1\", \"item2\"]\n```"
 * @returns Parsed array or null if parsing fails
 */
export function parseJsonArrayFromMarkdown(jsonString: string): string[] {
  try {
    // Remove markdown code block syntax
    const cleanedString = jsonString
      .replace(/```json\n?/g, '')  // Remove opening ```json
      .replace(/```\n?/g, '')      // Remove closing ```
      .trim();                     // Remove extra whitespace
    
    // Parse the JSON string
    const parsed = JSON.parse(cleanedString);
    
    // Ensure it's an array
    if (Array.isArray(parsed)) {
      return parsed;
    }
    
    return [];
  } catch (error) {
    console.error('Error parsing JSON Array from markdown:', error);
    return [];
  }
}

export function parseJsonFromMarkdown(jsonString: string): any {
  try {
    // Remove markdown code block syntax
    const cleanedString = jsonString
      .replace(/```json\n?/g, '')  // Remove opening ```json
      .replace(/```\n?/g, '')      // Remove closing ```
      .trim();                     // Remove extra whitespace
    
    // Parse the JSON string
    const parsed = JSON.parse(cleanedString);
    
    return parsed;
  } catch (error) {
    console.error('Error parsing JSON from markdown:', error);
    return null;
  }
}

/**
 * Alternative function that handles various JSON string formats
 * @param jsonString - JSON string that might be wrapped in markdown or other formatting
 * @returns Parsed array or null if parsing fails
 */
export function parseJsonArray(jsonString: string): any[] | null {
  try {
    let cleanedString = jsonString.trim();
    
    // Handle markdown code blocks
    if (cleanedString.startsWith('```')) {
      cleanedString = cleanedString
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
    }
    
    // Handle potential escape characters
    cleanedString = cleanedString.replace(/\\"/g, '"');
    
    const parsed = JSON.parse(cleanedString);
    
    if (Array.isArray(parsed)) {
      return parsed;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing JSON array:', error);
    return null;
  }
}

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date as a string in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets a specific date in YYYY-MM-DD format
 * @param date - Date object or date string
 * @returns Date as a string in YYYY-MM-DD format
 */
export function formatDateToYYYYMMDD(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converts a JSON object into a WHERE clause for SQL queries
 * @param conditions - JSON object where keys are column names and values are the values to match
 * @param operator - SQL operator to use between conditions (default: 'AND')
 * @param tableAlias - Optional table alias to prefix column names
 * @returns Object containing WHERE clause string and parameter values array
 */
export function jsonToWhereClause(
  conditions: Record<string, any>, 
  operator: 'AND' | 'OR' = 'AND',
  tableAlias?: string
): { whereClause: string; params: any[] } {
  const clauses: string[] = [];
  const params: any[] = [];
  
  for (const [column, value] of Object.entries(conditions)) {
    if (value !== null && value !== undefined) {
      const columnName = tableAlias ? `${tableAlias}.${column}` : column;
      
      if (Array.isArray(value)) {
        // Handle IN clause for arrays
        const placeholders = value.map(() => '?').join(', ');
        clauses.push(`${columnName} IN (${placeholders})`);
        params.push(...value);
      } else if (typeof value === 'string' && value.includes('%')) {
        // Handle LIKE clause for strings with wildcards
        clauses.push(`${columnName} LIKE ?`);
        params.push(value.toLowerCase());
      } else if (typeof value === 'object' && value.operator) {
        // Handle custom operators like { operator: '>', value: 10 }
        clauses.push(`${columnName} ${value.operator} ?`);
        params.push(value.value);
      } else {
        // Handle simple equality
        clauses.push(`${columnName} = ?`);
        if (typeof value === 'string') {
          params.push(value.toLowerCase());
        } else {
          params.push(value);
        }
      }
    }
  }
  
  const whereClause = clauses.length > 0 ? clauses.join(` ${operator} `) + ' AND ' : '';
  
  return { whereClause, params };
}

/**
 * Creates a complete SELECT query with WHERE clause from JSON conditions
 * @param tableName - Name of the table to query
 * @param conditions - JSON object with column-value pairs
 * @param columns - Array of columns to select (default: ['*'])
 * @param operator - SQL operator for WHERE clause (default: 'AND')
 * @param tableAlias - Optional table alias
 * @returns Object containing complete query string and parameter values array
 */
export function createSelectQuery(
  tableName: string,
  conditions: Record<string, any>,
  columns: string[] = ['*'],
  operator: 'AND' | 'OR' = 'AND',
  tableAlias?: string
): { query: string; params: any[] } {
  const { whereClause, params } = jsonToWhereClause(conditions, operator, tableAlias);
  const columnsStr = columns.join(', ');
  const aliasStr = tableAlias ? ` AS ${tableAlias}` : '';
  
  const query = `SELECT ${columnsStr} FROM ${tableName}${aliasStr} WHERE ${whereClause}`;
  
  return { query, params };
}

// Example usage:
// const jsonString = "```json\n[\"advanced\", \"operations\", \"language support\"]\n```";
// const result = parseJsonFromMarkdown(jsonString);
// console.log(result); // ["advanced", "operations", "language support"]
// 
// const today = getTodayDate();
// console.log(today); // "2024-01-15" (example)
// 
// // JSON to WHERE clause examples:
// const conditions = { status: 'active', type: 'online', organizer: 'Devpost' };
// const { whereClause, params } = jsonToWhereClause(conditions);
// console.log(whereClause); // "status = ? AND type = ? AND organizer = ?"
// console.log(params); // ['active', 'online', 'Devpost'] 