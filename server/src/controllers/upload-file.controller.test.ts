import {
  jest,
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
} from "@jest/globals";
import { Request, Response } from "express";
import googleOAuthClient from "../services/google-drive/google-drive.auth";
import GoogleDriveService from "../services/google-drive/google-drive.service";
import uploadFile from "./upload-file.controller";

jest.mock("../services/google-drive/google-drive.auth");
jest.mock("../services/google-drive/google-drive.service");

describe("uploadFile Controller", () => {
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
      file: undefined,
    } as Partial<Request> & { file: Express.Multer.File };

    mockResponse = {
      status: statusMock,
    } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if no file is provided", async () => {
    await uploadFile(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith("No file provided.");
  });

  it("should return 400 if access_token is invalid", async () => {
    mockRequest.file = {
      path: "mock-path",
      mimetype: "image/png",
      originalname: "mock.png",
    } as unknown as Express.Multer.File;

    (googleOAuthClient as jest.Mock).mockReturnValue(null);

    await uploadFile(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("");
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith(
      "Invalid access token parameter provided."
    );
  });

  it("should return 400 if file path is missing", async () => {
    mockRequest.file = {
      path: "",
      mimetype: "image/png",
      originalname: "mock.png",
    } as Express.Multer.File;
    mockRequest.query = { access_token: "mock-access-token" };

    const mockOAuth2Client = {};
    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);

    await uploadFile(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("mock-access-token");
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith("File content not found.");
  });

  it("should upload file successfully and return file metadata", async () => {
    mockRequest.file = {
      path: "mock-path",
      mimetype: "image/png",
      originalname: "mock.png",
    } as Express.Multer.File;
    mockRequest.query = { access_token: "mock-access-token" };

    const mockOAuth2Client = {};
    const mockUploadedFile = { id: "mock-id", title: "mock.png" };
    const mockGoogleDriveService = {
      uploadFile: jest.fn().mockResolvedValue(mockUploadedFile as never),
    };

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (GoogleDriveService as jest.Mock).mockImplementation(
      () => mockGoogleDriveService
    );

    await uploadFile(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("mock-access-token");
    expect(GoogleDriveService).toHaveBeenCalledWith(mockOAuth2Client);
    expect(mockGoogleDriveService.uploadFile).toHaveBeenCalledWith(
      mockRequest.file
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockUploadedFile);
  });

  it("should return 400 if an error occurs during upload", async () => {
    mockRequest.file = {
      path: "mock-path",
      mimetype: "image/png",
      originalname: "mock.png",
    } as Express.Multer.File;
    mockRequest.query = { access_token: "mock-access-token" };

    const mockOAuth2Client = {};
    const mockError = new Error("Upload error");

    (googleOAuthClient as jest.Mock).mockReturnValue(mockOAuth2Client);
    (GoogleDriveService as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await uploadFile(mockRequest as Request, mockResponse as Response);

    expect(googleOAuthClient).toHaveBeenCalledWith("mock-access-token");
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith(mockError);
  });
});
