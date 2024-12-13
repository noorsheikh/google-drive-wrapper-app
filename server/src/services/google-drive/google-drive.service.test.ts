import {
  jest,
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
} from "@jest/globals";
import { Auth, drive_v2, google } from "googleapis";
import GoogleDriveService from "./google-drive.service";
import fs from "fs";

jest.mock("googleapis", () => ({
  google: {
    drive: jest.fn(),
  },
}));

jest.mock("fs", () => ({
  createReadStream: jest.fn(),
  existsSync: jest.fn(),
  unlink: jest.fn(),
}));

describe("GoogleDriveService", () => {
  let mockDrive: jest.Mocked<drive_v2.Drive>;
  let googleDriveService: GoogleDriveService;

  beforeEach(() => {
    mockDrive = {
      files: {
        list: jest.fn(),
        insert: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as jest.Mocked<drive_v2.Drive>;

    (google.drive as jest.Mock).mockReturnValue(mockDrive);

    const mockOAuth2Client = {} as Auth.OAuth2Client;
    googleDriveService = new GoogleDriveService(mockOAuth2Client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("files", () => {
    it("should return a list of files sorted by createdDate", async () => {
      mockDrive.files.list.mockResolvedValueOnce({
        data: {
          items: [
            { id: "1", title: "File1", createdDate: "2024-12-01T10:00:00Z" },
            { id: "2", title: "File2", createdDate: "2024-12-10T10:00:00Z" },
          ],
        },
      } as never);

      const result = await googleDriveService.files();

      expect(mockDrive.files.list).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { id: "2", title: "File2", createdDate: "2024-12-10T10:00:00Z" },
        { id: "1", title: "File1", createdDate: "2024-12-01T10:00:00Z" },
      ]);
    });

    it("should throw an error if listing files fails", async () => {
      mockDrive.files.list.mockRejectedValueOnce(
        new Error("API Error") as never
      );

      await expect(googleDriveService.files()).rejects.toThrow(
        "Error listing files from google drive, ERROR: Error: API Error"
      );
    });
  });

  describe("uploadFile", () => {
    const mockFile: Express.Multer.File = {
      path: "/path/to/file",
      mimetype: "text/plain",
      originalname: "test.txt",
    } as Express.Multer.File;

    it("should upload a file and return the uploaded file details", async () => {
      (fs.createReadStream as jest.Mock).mockReturnValueOnce({});
      mockDrive.files.insert.mockResolvedValueOnce({
        data: {
          id: "123",
          title: "test.txt",
          createdDate: "2024-12-12T10:00:00Z",
        },
      } as never);

      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      const result = await googleDriveService.uploadFile(mockFile);

      expect(fs.createReadStream).toHaveBeenCalledWith("/path/to/file");
      expect(mockDrive.files.insert).toHaveBeenCalledWith({
        media: { mimeType: "text/plain", body: {} },
        requestBody: { title: "test.txt" },
      });
      expect(fs.unlink).toHaveBeenCalledWith(
        "/path/to/file",
        expect.any(Function)
      );
      expect(result).toEqual({
        id: "123",
        title: "test.txt",
        createdDate: "2024-12-12T10:00:00Z",
      });
    });

    it("should throw an error if file upload fails", async () => {
      (fs.createReadStream as jest.Mock).mockReturnValueOnce({});
      mockDrive.files.insert.mockRejectedValueOnce(
        new Error("API Error") as never
      );

      await expect(googleDriveService.uploadFile(mockFile)).rejects.toThrow(
        "Error uploading file to google drive, ERROR: Error: API Error"
      );
    });
  });

  describe("removeFile", () => {
    it("should remove a file by ID and return true", async () => {
      mockDrive.files.delete.mockResolvedValueOnce({} as never);

      const result = await googleDriveService.removeFile("123");

      expect(mockDrive.files.delete).toHaveBeenCalledWith({ fileId: "123" });
      expect(result).toBe(true);
    });

    it("should throw an error if file removal fails", async () => {
      mockDrive.files.delete.mockRejectedValueOnce(
        new Error("API Error") as never
      );

      await expect(googleDriveService.removeFile("123")).rejects.toThrow(
        "Error removing file from google drive, ERROR: Error: API Error"
      );
    });
  });
});
