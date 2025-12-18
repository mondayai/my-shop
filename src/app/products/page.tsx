import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-4xl mx-auto">
        {/* ปุ่มย้อนกลับ */}
        <Link
          href="/"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← กลับหน้าแรก
        </Link>

        <h1 className="text-4xl font-bold mb-6">สินค้าทั้งหมด</h1>

        <div className="space-y-4">
          <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <Link href="/products/1">
              <h2 className="text-2xl font-semibold hover:text-blue-500 cursor-pointer">
                คอมพิวเตอร์แล็ปท็อป
              </h2>
            </Link>
            <p className="text-gray-500">แรง เร็ว ทะลุนรก</p>
            <span className="text-green-600 font-bold">฿25,000</span>
          </div>

          <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <Link href="/products/2">
              <h2 className="text-2xl font-semibold hover:text-blue-500 cursor-pointer">
                หูฟังไร้สาย
              </h2>
            </Link>
            <p className="text-gray-500">ตัดเสียงรบกวน เงียบกริบ</p>
            <span className="text-green-600 font-bold">฿4,500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
