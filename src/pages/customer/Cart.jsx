import { ShoppingCart } from "lucide-react";

export default function Cart() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Keranjang Belanja</h1>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">Cart Page</p>
        <p className="text-sm text-muted-foreground">
          Akan diimplementasikan di Phase 4 (Member C)
        </p>
      </div>
    </div>
  );
}
