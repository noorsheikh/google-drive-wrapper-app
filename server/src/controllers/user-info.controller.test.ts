import {
  jest,
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
} from "@jest/globals";
import { Request, Response } from "express";
import { google } from "googleapis";
import userInfo from "./user-info.controller";
import googleOAuthClient from "../services/google-drive/google-drive.auth";

// Mock dependencies.
jest.mock("googleapis");
jest.mock("../services/google-drive/google-drive.auth");

describe("userInfo Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    sendMock = jest.fn();
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({
      send: sendMock,
      json: jsonMock,
    })) as unknown as jest.Mock;

    mockRequest = {
      query: {},
    };

    mockResponse = {
      status: statusMock,
    } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if no access_token is provided", async () => {
    await userInfo(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith(
      "Invalid access token parameter provide."
    );
  });

  it("should return 400 if invalid access_token is provided", async () => {
    mockRequest.query = { access_token: "invalid-access-token" };

    (googleOAuthClient as jest.Mock).mockReturnValue(null);

    await userInfo(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("invalid-access-token");
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith(
      "Invalid access token parameter provide."
    );
  });

  it("should fetch user info successfully and return user data", async () => {
    mockRequest.query = { access_token: "valid-access-token" };

    const mockOAuth2Client = {};
    const mockUserInfoResponse = {
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
      },
    };

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (google.oauth2 as jest.Mock).mockReturnValue({
      userinfo: {
        get: jest.fn().mockResolvedValue(mockUserInfoResponse as never),
      },
    });

    await userInfo(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("valid-access-token");
    expect(google.oauth2).toHaveBeenCalledWith({
      version: "v2",
      auth: mockOAuth2Client,
    });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      name: "John Doe",
      email: "johndoe@example.com",
    });
  });

  it("should return 400 if an error occurs while fetching user info", async () => {
    mockRequest.query = { access_token: "valid-access-token" };

    const mockOAuth2Client = {};
    const mockError = new Error("API Error");

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (google.oauth2 as jest.Mock).mockReturnValue({
      userinfo: {
        get: jest.fn().mockRejectedValue(mockError as never),
      },
    });

    await userInfo(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("valid-access-token");
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith(mockError);
  });
});
