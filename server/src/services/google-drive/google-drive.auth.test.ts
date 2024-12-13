import { jest, describe, beforeEach, expect, it } from "@jest/globals";
import { Auth, google } from "googleapis";
import googleOAuthClient from "./google-drive.auth";
import { afterEach } from "node:test";

jest.mock("googleapis", () => {
  const mockOAuth2Instance = {
    setCredentials: jest.fn(),
  };

  return {
    google: {
      auth: {
        OAuth2: jest.fn(() => mockOAuth2Instance),
      },
    },
  };
});

describe("googleOAuthClient", () => {
  let mockOAuth2Instance: Auth.OAuth2Client;

  beforeEach(() => {
    mockOAuth2Instance = new google.auth.OAuth2();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an OAuth2 client and set credentials if accessToken is valid", () => {
    const accessToken = "validAccessToken123";

    const client = googleOAuthClient(accessToken);

    expect(google.auth.OAuth2).toHaveBeenCalledTimes(2); // Ensures OAuth2 was instantiated
    expect(mockOAuth2Instance.setCredentials).toHaveBeenCalledWith({
      access_token: accessToken,
    });
    expect(client).toBe(mockOAuth2Instance); // Ensures the function returns the created client
  });

  it("should create an OAuth2 client without setting credentials if accessToken is invalid", () => {
    const invalidAccessToken = "";

    const client = googleOAuthClient(invalidAccessToken);

    expect(google.auth.OAuth2).toHaveBeenCalledTimes(2); // Ensures OAuth2 was instantiated
    expect(mockOAuth2Instance.setCredentials).not.toHaveBeenCalled(); // Ensures no credentials were set
    expect(client).toBe(mockOAuth2Instance);
  });

  it("should throw an error if an exception occurs during initialization", () => {
    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Initialization Error");
    });

    const accessToken = "validAccessToken123";

    expect(() => googleOAuthClient(accessToken)).toThrow(
      "Error setting google oauth client, ERROR: Error: Initialization Error"
    );
  });
});
