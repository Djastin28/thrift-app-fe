import { FolderTree } from "lucide-react";

export default function Categories() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Category Management</h1>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <FolderTree className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">Category Management Page</p>
        <p className="text-sm text-muted-foreground">
          Akan diimplementasikan di Phase 3 (Member B)
        </p>
      </div>
    </div>
  );
}
