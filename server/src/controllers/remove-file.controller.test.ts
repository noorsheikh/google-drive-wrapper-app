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
import removeFile from "./remove-file.controller";

jest.mock("../services/google-drive/google-drive.auth");
jest.mock("../services/google-drive/google-drive.service");

describe("removeFile Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    sendMock = jest.fn();
    statusMock = jest.fn(() => ({
      send: sendMock,
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

  it("should delete a file successfully if access_token and file_id are valid", async () => {
    const mockAccessToken = "mock-access-token";
    const mockFileId = "mock-file-id";

    mockRequest.query = { access_token: mockAccessToken, file_id: mockFileId };

    const mockOAuth2Client = {};
    const mockGoogleDriveService = {
      removeFile: jest.fn().mockResolvedValue(true as never),
    };

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (GoogleDriveService as jest.Mock).mockImplementation(
      () => mockGoogleDriveService
    );

    await removeFile(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith(mockAccessToken);
    expect(GoogleDriveService).toHaveBeenCalledWith(mockOAuth2Client);
    expect(mockGoogleDriveService.removeFile).toHaveBeenCalledWith(mockFileId);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith("File deleted successfully");
  });

  it("should return 400 if file_id is missing", async () => {
    mockRequest.query = { access_token: "mock-access-token" };

    const mockOAuth2Client = {};

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);

    await removeFile(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("mock-access-token");
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith("Invalid file id");
  });

  it("should return 400 if removeFile fails", async () => {
    const mockAccessToken = "mock-access-token";
    const mockFileId = "mock-file-id";

    mockRequest.query = { access_token: mockAccessToken, file_id: mockFileId };

    const mockOAuth2Client = {};
    const mockGoogleDriveService = {
      removeFile: jest.fn().mockResolvedValue(false as never),
    };

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (GoogleDriveService as jest.Mock).mockImplementation(
      () => mockGoogleDriveService
    );

    await removeFile(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith(mockAccessToken);
    expect(GoogleDriveService).toHaveBeenCalledWith(mockOAuth2Client);
    expect(mockGoogleDriveService.removeFile).toHaveBeenCalledWith(mockFileId);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith("Error removing file");
  });

  it("should return 400 if an error occurs", async () => {
    const mockAccessToken = "mock-access-token";
    const mockFileId = "mock-file-id";

    mockRequest.query = { access_token: mockAccessToken, file_id: mockFileId };

    const mockOAuth2Client = {};
    const mockError = new Error("Google Drive error");

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (GoogleDriveService as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await removeFile(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith(mockAccessToken);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith(mockError);
  });
});
