export const getInitialsForName = (name: string) =>
  name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export const scopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/drive",
];
