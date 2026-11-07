/**
 * Shared date and text formatting utilities for classroom forums.
 * Ensures consistent display of full year, hours, and edit timestamps.
 */

export function formatForumDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Checks whether an entity has been edited after its creation.
 */
export function isEntityEdited(createdAt: string, updatedAt?: string): boolean {
  if (!updatedAt) return false;
  try {
    const createdTime = new Date(createdAt).getTime();
    const updatedTime = new Date(updatedAt).getTime();
    // Consider edited if updatedAt is at least 1 second after createdAt
    return updatedTime - createdTime > 1000;
  } catch {
    return false;
  }
}
