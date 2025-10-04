export const VALIDATION_PATTERNS = {
  email: '^[a-zA-Z0-9.@]*$',
  mobile: '^[0-9]*$',
  ipv4: '^[0-9.]*$',
  alphabets: '^[a-zA-Z\\s]*$',
  alphaNumericWithSpace: '^[A-Za-z0-9\\s]*$',
  alphabetsNumbersOnly: '^[A-Za-z0-9]*$',
  alphabetsOnly: '^[a-zA-Z]*$',
  password: '^[^<>]*$',
  region: '^[a-zA-Z-]*$',
  floatNumber: '^[0-9.]*$',
  alphabetsNumbersWithUnderscore: '^[A-Za-z0-9_]*$',
  emailGmailOnly: '^[a-zA-Z0-9._%+-]+@gmail\\.com$',
  website: '^([a-zA-Z0-9-]{1,63}\\.)+[a-zA-Z]{2,}(\\/.*)?$'
};