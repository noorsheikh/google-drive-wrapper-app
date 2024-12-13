import { jest, describe, beforeAll, it, expect } from "@jest/globals";
import request from "supertest";
import express, { Request, Response } from "express";

import routes from "./";
import userInfo from "../controllers/user-info.controller";
import listFiles from "../controllers/list-files.controller";
import uploadFile from "../controllers/upload-file.controller";
import removeFile from "../controllers/remove-file.controller";

jest.mock("../controllers/user-info.controller", () =>
  jest.fn((req: Request, res: Response) => res.status(200).send("user info"))
);

jest.mock("../controllers/list-files.controller", () =>
  jest.fn((req: Request, res: Response) => res.status(200).send("files listed"))
);

jest.mock("../controllers/upload-file.controller", () =>
  jest.fn((req: Request, res: Response) =>
    res.status(200).send("file uploaded")
  )
);

jest.mock("../controllers/remove-file.controller", () =>
  jest.fn((req: Request, res: Response) => res.status(200).send("file removed"))
);

describe("Routes Test", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(routes);
  });

  describe("GET /user-info", () => {
    it("should call the userInfo controller with status 200", async () => {
      const response = await request(app).get("/user-info");
      expect(userInfo).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.text).toBe("user info");
    });
  });

  describe("GET /list-files", () => {
    it("should call the listFiles controller with status 200", async () => {
      const response = await request(app).get("/list-files");
      expect(listFiles).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.text).toBe("files listed");
    });
  });

  describe("Post /upload-file", () => {
    it("should call the uploadFile controller with status 200", async () => {
      const response = await request(app)
        .post("/upload-file")
        .attach("file", Buffer.from("test content"), "file.txt");
      expect(uploadFile).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.text).toBe("file uploaded");
    });
  });

  describe("GET /remove-file", () => {
    it("should call the removeFile controller with status 200", async () => {
      const response = await request(app).get("/remove-file");
      expect(removeFile).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.text).toBe("file removed");
    });
  });
});
