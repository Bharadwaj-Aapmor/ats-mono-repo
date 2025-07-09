function validateJobDescription(description) {
  const trimmed = description.trim();

  if (!trimmed) return "Job description cannot be empty.";

  if (/^[^a-zA-Z0-9]+$/.test(trimmed))
    return "Job description cannot contain only special characters.";

  if (trimmed.length < 50)
    return "Job description is too short, please add more details.";

  if (trimmed.length > 6000)
    return "*Job description is too long. Please shorten it.";

  if (/(.)\1{10,}/.test(trimmed))
    return "Job description contains repetitive or invalid content.";

  const requiredKeywords = ["skills", "experience", "responsibilities"];
  const descLower = trimmed.toLowerCase();

  const hasKeyword = requiredKeywords.some((keyword) =>
    descLower.includes(keyword)
  );
  if (!hasKeyword)
    return "Job description should mention key details like skills and experience.";

  return null;
}

export default validateJobDescription;
