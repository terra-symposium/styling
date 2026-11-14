/** Return the first available identity initial, matching the original Terra UI helper.
 * @param identity - Names and email available for the fallback initial.
 * @return Uppercase initial, or an empty string when the identity has no text.
 */
export function getInitials(identity: { firstName?: string | null; lastName?: string | null; name?: string | null; email?: string | null }): string {
	return (identity.firstName?.trim() || identity.lastName?.trim() || identity.name?.trim() || identity.email?.trim() || '').charAt(0).toUpperCase();
}
