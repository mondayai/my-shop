import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {/* ส่วนหัวข้อ (Header) */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-blue-700 mb-6">
          ยินดีต้อนรับสู่ร้านของ Light
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          แหล่งรวมสินค้าไอทีที่ดีที่สุดในย่านนี้ (สร้างด้วย Next.js 15)
        </p>

        {/* ปุ่มกด */}
        <Link
          href="/products"
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg hover:bg-blue-800 transition shadow-lg"
        >
          🛒 ช้อปสินค้าเลย
        </Link>
      </div>

      {/* พื้นที่สำหรับสินค้า (Mockup) */}
      <div className="grid grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md h-40 flex items-center justify-center text-gray-400">
          สินค้าชิ้นที่ 1
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md h-40 flex items-center justify-center text-gray-400">
          สินค้าชิ้นที่ 2
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md h-40 flex items-center justify-center text-gray-400">
          สินค้าชิ้นที่ 3
        </div>
      </div>
    </div>
  );
}
