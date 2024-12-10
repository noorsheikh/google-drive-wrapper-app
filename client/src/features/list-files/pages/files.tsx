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
      <div className="flex flex-col items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          All files in Google Drive
        </h2>
        <p className="text-muted-foreground">
          Here's a list of your tasks for this month!
        </p>
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
                  {dayjs(file.createdDate).format("MM-DD-YYYY h:mm A")}
                </TableCell>
                <TableCell className="w-[200px]">
                  {dayjs(file.modifiedDate).format("MM-DD-YYYY h:mm A")}
                </TableCell>
                <TableCell>
                  <span className="flex flex-row gap-4">
                    <div className="group relative flex justify-center">
                      <ExternalLinkIcon
                        className="cursor-pointer"
                        color="gray"
                        size={18}
                        onClick={() =>
                          viewFileActionHandler(file?.alternateLink ?? "")
                        }
                      />
                      <span className="absolute top-5 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50">
                        View
                      </span>
                    </div>
                    <div className="group relative flex justify-center">
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
                      <span className="absolute top-5 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50">
                        Download
                      </span>
                    </div>
                    <div className="group relative flex justify-center">
                      <Trash2Icon
                        className="cursor-pointer"
                        color="red"
                        size={18}
                        onClick={() => removeFileActionHandler(file.id)}
                      />
                      <span className="absolute top-5 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50">
                        Remove
                      </span>
                    </div>
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
