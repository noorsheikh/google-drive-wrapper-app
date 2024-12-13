import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/core/auth/context";
import uploadFile from "@/core/googleDrive/services/uploadFile";
import { DriveContext } from "@/core/googleDrive/context";

const UploadFileDialog = () => {
  const { accessToken } = useContext(AuthContext);
  const { addFile } = useContext(DriveContext);
  const [file, setFile] = useState<Blob | undefined>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFile(e?.target?.files?.[0]);
  };

  const uploadFileAction = async () => {
    const response = await uploadFile(accessToken, file);
    if (response) {
      addFile(response);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-500">Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload File</DialogTitle>
        <DialogDescription>
          <div className="flex flex-row items-center gap-1.5">
            <Input id="file" type="file" onChange={handleFileChange} />
            <DialogClose>
              <Button
                className="flex flex-1 self-end"
                disabled={!file}
                onClick={() => uploadFileAction()}
              >
                Upload
              </Button>
            </DialogClose>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
