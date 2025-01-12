import React, { useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DropzoneProps {
  onChange: React.Dispatch<React.SetStateAction<Array<File>>>;
  className?: string;
  fileExtensions?: Array<string>; // Array of allowed file extensions
  numLimit?: number; // Maximum number of files
  dataLimit?: number; // Maximum data size in MB
}

export const Dropzone: React.FC<DropzoneProps> = ({
  className,
  dataLimit = 5,
  fileExtensions,
  numLimit = 3,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileInfo, setFileInfo] = useState<Array<string>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length > numLimit) {
      setError(`Please limit file uploads to ${numLimit} files.`);
      return;
    }

    const totalSizeMB = Array.from(files).reduce(
      (acc, file) => acc + file.size / 1024 / 1024,
      0
    );
    if (totalSizeMB > dataLimit) {
      setError(
        `Total file size limit exceeded. Max allowed is ${dataLimit} MB.`
      );
      return;
    }

    if (
      fileExtensions &&
      !Array.from(files).every((file) =>
        fileExtensions.some((ext) => file.name.endsWith(`.${ext}`))
      )
    ) {
      setError(`Invalid file type. Expected: ${fileExtensions.join(", ")}`);
      return;
    }

    setError(null);
    onChange(Array.from(files));

    // Update file info display for each file
    const fileDetails = Array.from(files).map(
      (file) => `${file.name} (${Math.round(file.size / 1024)} KB)`
    );
    setFileInfo(fileDetails);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`border-2 ${isDragOver ? "border-green border-dashed" : "text-primary"} bg-accent border-gray-500 border-dashed hover:cursor-pointer hover:border-muted ${className}`}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs">
        <Icons.fileplus className="size-9 text-secondary" />

        <div className="flex items-center justify-center font-bold">
          <span style={{ display: "flex", alignItems: "center" }}>
            {isDragOver ? "Release to upload" : "Drag Files to Upload or "}
            {!isDragOver && (
              <Button
                className="ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs font-bold"
                onClick={handleButtonClick}
                size="sm"
                variant="ghost"
              >
                Click Here
              </Button>
            )}
          </span>

          <input
            ref={fileInputRef}
            accept={
              fileExtensions
                ? fileExtensions.map((ext) => `.${ext}`).join(",")
                : "*"
            }
            className="hidden"
            multiple
            onChange={handleFileInputChange}
            type="file"
          />
        </div>
        <p className="text-gray-500">
          {" "}
          We support only {fileExtensions
            ? fileExtensions.join(", ")
            : "all"}{" "}
          files up to 5 MB in size. Drag and drop your file in one go.
        </p>
        {fileInfo.map((info, index) => (
          <p key={index}>{info}</p>
        ))}
        {error && <span className="text-red-500">{error}</span>}
      </CardContent>
    </Card>
  );
};
