// ตรงนี้ต้องใช้ท่าพิเศษนิดนึงสำหรับ Next.js 15
export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // แกะกล่องเอา ID ออกมา
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white p-10 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">
        สินค้าหมายเลข: {id}
      </h1>
      <p className="text-2xl text-gray-500">
        นี่คือหน้ารายละเอียดของสินค้า ID {id}
      </p>

      <div className="mt-8 p-6 border rounded-xl bg-gray-50 max-w-lg text-center">
        สมมติว่าตรงนี้เป็นรูปภาพและรายละเอียดสินค้า...
      </div>
    </div>
  );
}
