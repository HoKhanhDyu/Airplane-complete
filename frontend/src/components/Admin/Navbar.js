import React from "react";
import { MenuItem } from "./MenuItem";

function Navbar ()  {
  return (
    <aside className="w-[270px] p-5 bg-[#2d5167] text-white flex flex-col items-center h-screen overflow-y-auto overflow-visible relative z-10 max-h-400px">
      <h1 className="text-2xl font-bold mb-5 color">QUẢN LÝ</h1>
      <nav className="w-full">
        <ul className="list-none">
          <li className="mb-4">
            <span className="font-bold cursor-default">HỆ THỐNG QUẢN LÝ</span>
            <ul className="mt-2">
              <MenuItem
                icon="fa-plane"
                text="Quản lý máy bay"
                link="test.html"
              />
              <MenuItem
                icon="fa-plane-departure"
                text="Quản lý chuyến bay"
                link="#"
              />
              <MenuItem
                icon="fa-building"
                text="Quản lý hãng hàng không"
                link="#"
              />
              <MenuItem
                icon="fa-map-marked-alt"
                text="Quản lý sân bay"
                link="#"
              />
              <MenuItem
                icon="fa-ticket-alt"
                text="Quản lý Vé"
                link="#"
              />
              <MenuItem
                icon="fa-file-invoice"
                text="Quản lý hóa đơn"
                link="#"
              />
              <MenuItem
                icon="fa-chart-line"
                text="Quản lý doanh thu"
                link="#"
              />
              <MenuItem
                icon="fa-users"
                text="Quản lý người dùng"
                link="#"
                hasDropdown
                dropdownItems={[
                  { icon: "fa-user", text: "Khách hàng", link: "#" },
                  { icon: "fa-user-tie", text: "Nhân viên", link: "#" },
                ]}
              />
            </ul>
          </li>
          <li>
            <span className="font-bold cursor-default">TÀI KHOẢN</span>
            <ul className="mt-2">
              <MenuItem
                text="Thông tin tài khoản"
                link="#"
              />
              <MenuItem
                text="Đăng xuất"
                link="#"
              />
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar