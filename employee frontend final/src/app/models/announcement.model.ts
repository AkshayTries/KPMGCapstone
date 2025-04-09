export interface Announcement {
    id?: number;              // Optional, backend auto-generates
    title: string;
    content: string;
    createdAt?: string;       // Use string because LocalDateTime comes as ISO string in JSON
    createdBy: string;
  }
  