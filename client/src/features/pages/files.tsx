import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/core/auth/context";
import { File } from "@/core/googleDrive/models/File";
import getAllFiles from "@/core/googleDrive/services/getAllFiles";
import removeFile from "@/core/googleDrive/services/removeFile";
import dayjs from "dayjs";
import { DownloadIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import TableActionItem from "../components/table-action-item";
import { formatDateTime } from "../utils";
import { Button } from "@/components/ui/button";

const Files = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    if (accessToken) {
      getFiles(accessToken);
    }
  }, [accessToken]);

  const getFiles = async (accessToken: string) => {
    setFiles(await getAllFiles(accessToken));
  };

  const removeFileActionHandler = async (fileId: string) => {
    if (accessToken && fileId) {
      const fileRemoved = await removeFile(accessToken, fileId);
      if (fileRemoved) {
        setFiles((files) => files?.filter((file) => file.id !== fileId));
      }
    }
  };

  const downloadFileActionHandler = (link: string) => {
    window.location.assign(link);
  };

  const viewFileActionHandler = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="container mx-auto place-items-center text-center py-2">
      <div className="container flex flex-row items-center justify-between content-between space-y-2">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold tracking-tight">
            All files in Google Drive
          </h2>
          <p className="text-muted-foreground">
            Here's a list of all your files in Google Drive.
          </p>
        </div>
        <div className="flex">
          <Button className="bg-blue-500">Upload File</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableHead>Title</TableHead>
          <TableHead>File Type</TableHead>
          <TableHead>Creation Date</TableHead>
          <TableHead>Last Modified Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {files &&
            files?.map((file) => (
              <TableRow key={file.id} className="text-left">
                <TableCell>{file.title}</TableCell>
                <TableCell className="w-[100px]">
                  {file.fileExtension ?? "unknown"}
                </TableCell>
                <TableCell className="w-[200px]">
                  {formatDateTime(file.createdDate)}
                </TableCell>
                <TableCell className="w-[200px]">
                  {formatDateTime(file.modifiedDate)}
                </TableCell>
                <TableCell>
                  <span className="flex flex-row gap-4">
                    <TableActionItem label="View">
                      <ExternalLinkIcon
                        className="cursor-pointer"
                        color="gray"
                        size={18}
                        onClick={() =>
                          viewFileActionHandler(file?.alternateLink ?? "")
                        }
                      />
                    </TableActionItem>
                    <TableActionItem label="Download">
                      {file?.exportLinks ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <DownloadIcon
                              className="cursor-pointer"
                              color="green"
                              size={18}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {Object.keys(file?.exportLinks)?.map(
                              (link, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={() =>
                                    downloadFileActionHandler(
                                      file?.exportLinks?.[link] ?? ""
                                    )
                                  }
                                >
                                  {link}
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <DownloadIcon
                          className="cursor-pointer"
                          color="green"
                          size={18}
                          onClick={() =>
                            downloadFileActionHandler(
                              file?.webContentLink ?? ""
                            )
                          }
                        />
                      )}
                    </TableActionItem>
                    <TableActionItem label="Remove">
                      <Trash2Icon
                        className="cursor-pointer"
                        color="red"
                        size={18}
                        onClick={() => removeFileActionHandler(file.id)}
                      />
                    </TableActionItem>
                  </span>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Files;
