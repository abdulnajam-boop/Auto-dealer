export class VinAuditError extends Error {
  public statusCode?: number;
  public endpoint?: string;
  public isOperational: boolean;

  constructor(message: string, statusCode?: number, endpoint?: string) {
    super(message);
    this.name = 'VinAuditError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.isOperational = true;
  }
}

export class VinAuditAuthError extends VinAuditError {
  constructor(message = 'VinAudit API key is missing or invalid') {
    super(message, 401);
    this.name = 'VinAuditAuthError';
  }
}

export class VinAuditRateLimitError extends VinAuditError {
  constructor(message = 'VinAudit rate limit exceeded') {
    super(message, 429);
    this.name = 'VinAuditRateLimitError';
  }
}

export class VinAuditNotFoundError extends VinAuditError {
  constructor(message = 'Vehicle or record not found in VinAudit') {
    super(message, 404);
    this.name = 'VinAuditNotFoundError';
  }
}
