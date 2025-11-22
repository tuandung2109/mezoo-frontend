function Footer() {
  return (
    <footer className="bg-black py-12 px-4 md:px-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Công ty</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-white">Việc làm</a></li>
              <li><a href="#" className="hover:text-white">Tin tức</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-white">Liên hệ</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Pháp lý</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Điều khoản</a></li>
              <li><a href="#" className="hover:text-white">Quyền riêng tư</a></li>
              <li><a href="#" className="hover:text-white">Cookie</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Mạng xã hội</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Facebook</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
          <p className="text-2xl font-bold text-netflix-red mb-2">mezoo</p>
          <p className="text-sm">© 2025 mezoo Movie Streaming Platform — Created by tuandung2109.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
