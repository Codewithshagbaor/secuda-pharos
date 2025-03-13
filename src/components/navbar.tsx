import Button from "./button";
import { Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="h-16  flex items-center justify-between px-4 sm:px-6 bg-[#040E24] border-b border-[#1e2d47]">
      <Link href="/" className="flex items-center">
        <Image
          src="/img/logo.png"
          alt="DataBank"
          width={200}
          height={200}
          className="h-6 w-auto"
        />
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          className="h-9 text-sm font-medium border-[#3A4358] hover:bg-[#0c1a36] hidden sm:flex"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
        <Button
          variant="primary"
          className="h-9 text-sm font-medium bg-[#2B9DDA] hover:bg-[#2589c2] truncate"
        >
          Hello! 0xe...0009
        </Button>
      </div>
    </header>
  );
}