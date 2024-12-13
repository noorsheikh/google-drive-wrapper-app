import {
  jest,
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
} from "@jest/globals";
import { Request, Response } from "express";
import googleOAuthClient from "../services/google-drive/google-drive.auth";
import GoogleDriveService from "../services/google-drive/google-drive.service";
import { listFiles } from "./list-files.controller";

jest.mock("../services/google-drive/google-drive.auth");
jest.mock("../services/google-drive/google-drive.service");

describe("listFiles Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn(() => ({
      send: sendMock,
      json: jsonMock,
    })) as unknown as jest.Mock;

    mockRequest = {
      query: {},
    } as Partial<Request>;

    mockResponse = {
      status: statusMock,
    } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return files if access_token is valid", async () => {
    const mockAccessToken = "mock-access-token";
    const mockFiles = [
      { id: "1", title: "File1", createdDate: "2023-01-01" },
      { id: "2", title: "File2", createdDate: "2023-02-01" },
    ];

    mockRequest.query = { access_token: mockAccessToken };
    const mockOAuth2Client = {};
    const mockGoogleDriveService = {
      files: jest.fn().mockResolvedValue(mockFiles as never),
    };

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (GoogleDriveService as jest.Mock).mockImplementation(
      () => mockGoogleDriveService
    );

    await listFiles(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith(mockAccessToken);
    expect(GoogleDriveService).toHaveBeenCalledWith(mockOAuth2Client);
    expect(mockGoogleDriveService.files).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockFiles);
  });

  it("should return 400 if access_token is missing", async () => {
    await listFiles(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("");
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith(
      "Invalid access token parameter provided."
    );
  });

  it("should return 400 if GoogleDriveService throws an error", async () => {
    const mockAccessToken = "mock-access-token";
    const mockError = new Error("Google Drive API error");

    mockRequest.query = { access_token: mockAccessToken };
    const mockOAuth2Client = {};
    const mockGoogleDriveService = {
      files: jest.fn().mockRejectedValue(mockError as never),
    };

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (GoogleDriveService as jest.Mock).mockImplementation(
      () => mockGoogleDriveService
    );

    await listFiles(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith(mockAccessToken);
    expect(GoogleDriveService).toHaveBeenCalledWith(mockOAuth2Client);
    expect(mockGoogleDriveService.files).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith(mockError);
  });
});
