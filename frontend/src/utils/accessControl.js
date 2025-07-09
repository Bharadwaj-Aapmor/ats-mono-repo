export default function HasAccess(user, requiredTags = []) {
  if (!user?.access) {
    return false;
  }
  return requiredTags.some((tag) => user.access.includes(tag));
}
